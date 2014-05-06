//-----------------------------------------------------------------
//	SpriteManager v0.622 (1-24-2009)
//  Copyright 2009 Brady Wright and Above and Beyond Software
//	All rights reserved
//-----------------------------------------------------------------
// A class to allow the drawing of multiple "quads" as part of a
// single aggregated mesh so as to achieve multiple, independently
// moving objects using a single draw call.
//-----------------------------------------------------------------


using UnityEngine;
using System.Collections;


//-----------------------------------------------------------------
// Describes a sprite
//-----------------------------------------------------------------
public class Zprite
{
	protected float m_width;					// Width and Height of the sprite in worldspace units
	protected float m_height;
	protected Vector2 m_lowerLeftUV;			// UV coordinate for the upper-left corner of the sprite
	protected Vector2 m_UVDimensions;			// Distance from the upper-left UV to place the other UVs
	protected GameObject m_client;				// Reference to the client GameObject
	protected SpriteManager m_manager;			// Reference to the sprite manager in which this sprite resides
	protected bool m_billboarded = false;		// Is the sprite to be billboarded?
	protected bool m_hidden = false;			// Indicates whether this sprite is currently hidden

	protected Vector3[] meshVerts;				// Pointer to the array of vertices in the mesh
	protected Vector2[] UVs;					// Pointer to the array of UVs in the mesh

	public Transform clientTransform;			// Transform of the client GameObject
	public Matrix4x4 xform;                     // Used if client is null
	public Vector3 offset = new Vector3();		// Offset of sprite from center of client GameObject
	public Color color;							// The color to be used by all four vertices

	public int index;							// Index of this sprite in its SpriteManager's list
	
	public Vector3 v1 = new Vector3();			// The sprite's vertices in local space
	public Vector3 v2 = new Vector3();
	public Vector3 v3 = new Vector3();
	public Vector3 v4 = new Vector3();
	
	public int mv1;							// Indices of the associated vertices in the actual mesh (this just provides a quicker way for the SpriteManager to get straight to the right vertices in the vertex array)
	public int mv2;
	public int mv3;
	public int mv4;

	public int uv1;							// Indices of the associated UVs in the mesh
	public int uv2;
	public int uv3;
	public int uv4;

	public int cv1;							// Indices of the associated color values in the mesh
	public int cv2;
	public int cv3;
	public int cv4;

	public Zprite()
	{
	    init();
    }
    
    public void init()
    {
		m_width = 0;
		m_height = 0;
		m_client = null;
		m_manager = null;
		clientTransform = null;
		xform = new Matrix4x4();
		index = 0;
		color = Color.white;

		offset = Vector3.zero;
	}

	public SpriteManager manager
	{
		get { return m_manager; }
		set { m_manager = value; }
	}

	public GameObject client
	{
		get { return m_client; }
		set 
		{ 
			m_client = value;
			if (m_client != null)
				clientTransform = m_client.transform;
			else
				clientTransform = null;
		}
	}

	public Vector2 lowerLeftUV
	{
		get { return m_lowerLeftUV; }
		set 
		{ 
			m_lowerLeftUV = value;
			m_manager.UpdateUV(this);
		}
	}

	public Vector2 uvDimensions
	{
		get { return m_UVDimensions; }
		set 
		{ 
			m_UVDimensions = value;
			m_manager.UpdateUV(this);
		}
	}

	public float width
	{
		get { return m_width; }
	}

	public float height
	{
		get { return m_height; }
	}

	public bool billboarded
	{
		get { return m_billboarded; }
		set
		{
			m_billboarded = value;
		}
	}
	
	public bool hidden
	{
		get { return m_hidden; }
		set
		{
			// No need to do anything if we're
			// already in this state:
			if (value == m_hidden)
				return;

			m_hidden = value;

			if (value)
				m_manager.HideSprite(this);
			else
				m_manager.ShowSprite(this);
		}
	}

	// Sets the physical dimensions of the sprite in the XY plane:
	public void SetSizeXY(float width, float height)
	{
		m_width = width;
		m_height = height;
		v1 = offset + new Vector3(-m_width / 2, m_height / 2, 0);	// Upper-left
		v2 = offset + new Vector3(-m_width / 2, -m_height / 2, 0);	// Lower-left
		v3 = offset + new Vector3(m_width / 2, -m_height / 2, 0);	// Lower-right
		v4 = offset + new Vector3(m_width / 2, m_height / 2, 0);	// Upper-right

		m_manager.UpdatePositions();
	}

	// Sets the physical dimensions of the sprite in the XZ plane:
	public void SetSizeXZ(float width, float height)
	{
		m_width = width;
		m_height = height;
		v1 = offset + new Vector3(-m_width / 2, 0, m_height / 2);	// Upper-left
		v2 = offset + new Vector3(-m_width / 2, 0, -m_height / 2);	// Lower-left
		v3 = offset + new Vector3(m_width / 2, 0, -m_height / 2);	// Lower-right
		v4 = offset + new Vector3(m_width / 2, 0, m_height / 2);	// Upper-right

		m_manager.UpdatePositions();
	}

	// Sets the physical dimensions of the sprite in the YZ plane:
	public void SetSizeYZ(float width, float height)
	{
		m_width = width;
		m_height = height;
		v1 = offset + new Vector3(0, m_height / 2, -m_width / 2);	// Upper-left
		v2 = offset + new Vector3(0, -m_height / 2, -m_width / 2);	// Lower-left
		v3 = offset + new Vector3(0, -m_height / 2, m_width / 2);	// Lower-right
		v4 = offset + new Vector3(0, m_height / 2, m_width / 2);		// Upper-right

		m_manager.UpdatePositions();
	}

	// Sets the vertex and UV buffers
	public void SetBuffers(Vector3[] v, Vector2[] uv)
	{
		meshVerts = v;
		UVs = uv;
	}

	// Applies the transform of the client GameObject and stores
	// the results in the associated vertices of the overall mesh:
	public void Transform()
	{
	    if (clientTransform) {
    		meshVerts[mv1] = clientTransform.TransformPoint(v1);
    		meshVerts[mv2] = clientTransform.TransformPoint(v2);
    		meshVerts[mv3] = clientTransform.TransformPoint(v3);
    		meshVerts[mv4] = clientTransform.TransformPoint(v4);
    	}else{
    		meshVerts[mv1] = xform.MultiplyPoint3x4(v1);
    		meshVerts[mv2] = xform.MultiplyPoint3x4(v2);
    		meshVerts[mv3] = xform.MultiplyPoint3x4(v3);
    		meshVerts[mv4] = xform.MultiplyPoint3x4(v4);
	    }

		m_manager.UpdatePositions();
	}

	// Applies the transform of the client GameObject and stores
	// the results in the associated vertices of the overall mesh:
	public void TransformBillboarded(Transform t)
	{
		Vector3 pos = clientTransform.position;

		meshVerts[mv1] = pos + t.InverseTransformDirection(v1);
		meshVerts[mv2] = pos + t.InverseTransformDirection(v2);
		meshVerts[mv3] = pos + t.InverseTransformDirection(v3);
		meshVerts[mv4] = pos + t.InverseTransformDirection(v4);

		m_manager.UpdatePositions();
	}

	// Sets the specified color and automatically notifies the
	// SpriteManager to update the colors:
	public void SetColor(Color c)
	{
		color = c;
		m_manager.UpdateColors(this);
	}
}


//-----------------------------------------------------------------
// Holds a single mesh object which is composed of an arbitrary
// number of quads that all use the same material, allowing
// multiple, independently moving objects to be drawn on-screen
// while using only a single draw call.
//-----------------------------------------------------------------
public class SpriteManager : MonoBehaviour 
{
	// In which plane should we create the sprites?
	public enum SPRITE_PLANE
	{
		XY,
		XZ,
		YZ
	};

	// Which way to wind polygons?
	public enum WINDING_ORDER
	{
		CCW,		// Counter-clockwise
		CW			// Clockwise
	};

	public Material material;				// The material to use for the sprites
	public int allocBlockSize;				// How many sprites to allocate space for at a time. ex: if set to 10, 10 new sprite blocks will be allocated at a time. Once all of these are used, 10 more will be allocated, and so on...
	public SPRITE_PLANE plane;				// The plane in which to create the sprites
	public WINDING_ORDER winding=WINDING_ORDER.CCW;	// Which way to wind polygons
	public bool autoUpdateBounds = false;	// Automatically recalculate the bounds of the mesh when vertices change?

	protected ArrayList availableBlocks = new ArrayList(); // Array of references to sprites which are currently not in use
	protected bool vertsChanged = false;	// Have changes been made to the vertices of the mesh since the last frame?
	protected bool uvsChanged = false;		// Have changes been made to the UVs of the mesh since the last frame?
	protected bool colorsChanged = false;	// Have the colors changed?
	protected bool vertCountChanged = false;// Has the number of vertices changed?
	protected bool updateBounds = false;	// Update the mesh bounds?
	public Zprite[] sprites;				// Array of all sprites (the offset of the vertices corresponding to each sprite should be found simply by taking the sprite's index * 4 (4 verts per sprite).
	protected ArrayList activeBlocks = new ArrayList();	// Array of references to all the currently active (non-empty) sprites
	protected ArrayList activeBillboards = new ArrayList(); // Array of references to all the *active* sprites which are to be rendered as billboards
	protected float boundUpdateInterval;	// Interval, in seconds, to update the mesh bounds

	protected MeshFilter meshFilter;
	protected MeshRenderer meshRenderer;
	protected Mesh mesh;					// Reference to our mesh (contained in the MeshFilter)

	protected Vector3[] vertices;			// The vertices of our mesh
	protected int[] triIndices;				// Indices into the vertex array
	protected Vector2[] UVs;				// UV coordinates
	protected Color[] colors;				// Color values
	//protected Vector3[] normals;			// Normals

	//--------------------------------------------------------------
	// Utility functions:
	//--------------------------------------------------------------

	// Converts pixel-space values to UV-space scalar values
	// according to the currently assigned material.
	// NOTE: This is for converting widths and heights-not
	// coordinates (which have reversed Y-coordinates).
	// For coordinates, use PixelCoordToUVCoord()!
	public Vector2 PixelSpaceToUVSpace(Vector2 xy)
	{
		Texture t = material.mainTexture;

		return new Vector2(xy.x / ((float)t.width), xy.y / ((float)t.height));
	}

	// Converts pixel-space values to UV-space scalar values
	// according to the currently assigned material.
	// NOTE: This is for converting widths and heights-not
	// coordinates (which have reversed Y-coordinates).
	// For coordinates, use PixelCoordToUVCoord()!
	public Vector2 PixelSpaceToUVSpace(int x, int y)
	{
		return PixelSpaceToUVSpace(new Vector2((float)x, (float)y));
	}

	// Converts pixel coordinates to UV coordinates according to
	// the currently assigned material.
	// NOTE: This is for converting coordinates and will reverse
	// the Y component accordingly.  For converting widths and
	// heights, use PixelSpaceToUVSpace()!
	public Vector2 PixelCoordToUVCoord(Vector2 xy)
	{
		Vector2 p = PixelSpaceToUVSpace(xy);
		p.y = 1.0f - p.y;
		return p;
	}

	// Converts pixel coordinates to UV coordinates according to
	// the currently assigned material.
	// NOTE: This is for converting coordinates and will reverse
	// the Y component accordingly.  For converting widths and
	// heights, use PixelSpaceToUVSpace()!
	public Vector2 PixelCoordToUVCoord(int x, int y)
	{
		return PixelCoordToUVCoord(new Vector2((float)x, (float)y));
	}

	//--------------------------------------------------------------
	// End utility functions
	//--------------------------------------------------------------

	void Awake()
	{
		gameObject.AddComponent("MeshFilter");
		gameObject.AddComponent("MeshRenderer");

		meshFilter = (MeshFilter)GetComponent(typeof(MeshFilter));
		meshRenderer = (MeshRenderer)GetComponent(typeof(MeshRenderer));

		meshRenderer.renderer.material = material;
		mesh = meshFilter.mesh;

		// Create our first batch of sprites:
		EnlargeArrays(allocBlockSize);

		// Move the object to the origin so the objects drawn will not
		// be offset from the objects they are intended to represent.
		//transform.position = Vector3.zero;
		transform.rotation = Quaternion.identity;
	}

	// Allocates initial arrays
	protected void InitArrays()
	{
		sprites = new Zprite[1];
		vertices = new Vector3[4];
		UVs = new Vector2[4];
		colors = new Color[4];
		triIndices = new int[6];
	}

	// Enlarges the sprite array by the specified count and also resizes
	// the UV and vertex arrays by the necessary corresponding amount.
	// Returns the index of the first newly allocated element
	// (ex: if the sprite array was already 10 elements long and is 
	// enlarged by 10 elements resulting in a total length of 20, 
	// EnlargeArrays() will return 10, indicating that element 10 is the 
	// first of the newly allocated elements.)
	protected int EnlargeArrays(int count)
	{
		int firstNewElement;

		if (sprites == null)
		{
			InitArrays();
			firstNewElement = 0;
			count = count - 1;	// Allocate one less since InitArrays already allocated one sprite for us
		}
		else
			firstNewElement = sprites.Length;

	    //Debug.Log("enlarge "+sprites.Length+" +"+count+" colors="+colors.Length+" vertices="+vertices.Length);

		// Resize sprite array:
		Zprite[] tempSprites = sprites;
		sprites = new Zprite[sprites.Length + count];
		tempSprites.CopyTo(sprites, 0);

		// Vertices:
		Vector3[] tempVerts = vertices;
		vertices = new Vector3[vertices.Length + count*4];
		tempVerts.CopyTo(vertices, 0);
		
		// UVs:
		Vector2[] tempUVs = UVs;
		UVs = new Vector2[UVs.Length + count*4];
		tempUVs.CopyTo(UVs, 0);

		// Colors:
		Color[] tempColors = colors;
		colors = new Color[colors.Length + count * 4];
		tempColors.CopyTo(colors, 0);

		// Triangle indices:
		int[] tempTris = triIndices;
		triIndices = new int[triIndices.Length + count*6];
		tempTris.CopyTo(triIndices, 0);

		// Inform existing sprites of the new vertex and UV buffers:
		for (int i = 0; i < firstNewElement; ++i)
		{
			sprites[i].SetBuffers(vertices, UVs);
		}

		// Setup the newly-added sprites and Add them to the list of available 
		// sprite blocks. Also initialize the triangle indices while we're at it:
		for (int i = firstNewElement; i < sprites.Length; ++i)
		{
			// Create and setup sprite:

			sprites[i] = new Zprite();
			sprites[i].index = i;
			sprites[i].manager = this;

			sprites[i].SetBuffers(vertices, UVs);

			// Setup indices of the sprite's vertices in the vertex buffer:
			sprites[i].mv1 = i * 4 + 0;
			sprites[i].mv2 = i * 4 + 1;
			sprites[i].mv3 = i * 4 + 2;
			sprites[i].mv4 = i * 4 + 3;

			// Setup the indices of the sprite's UV entries in the UV buffer:
			sprites[i].uv1 = i * 4 + 0;
			sprites[i].uv2 = i * 4 + 1;
			sprites[i].uv3 = i * 4 + 2;
			sprites[i].uv4 = i * 4 + 3;

			// Setup the indices to the color values:
			sprites[i].cv1 = i * 4 + 0;
			sprites[i].cv2 = i * 4 + 1;
			sprites[i].cv3 = i * 4 + 2;
			sprites[i].cv4 = i * 4 + 3;

			// Setup the default color:
			sprites[i].SetColor(Color.white);

			// Add as an available sprite:
			availableBlocks.Add(sprites[i]);

			// Init triangle indices:
			if(winding == WINDING_ORDER.CCW)
			{	// Counter-clockwise winding
				triIndices[i * 6 + 0] = i * 4 + 0;	//	0_ 2			0 ___ 3
				triIndices[i * 6 + 1] = i * 4 + 1;	//  | /		Verts:	 |	/|
				triIndices[i * 6 + 2] = i * 4 + 3;	// 1|/				1|/__|2

				triIndices[i * 6 + 3] = i * 4 + 3;	//	  3
				triIndices[i * 6 + 4] = i * 4 + 1;	//   /|
				triIndices[i * 6 + 5] = i * 4 + 2;	// 4/_|5
			}
			else
			{	// Clockwise winding
				triIndices[i * 6 + 0] = i * 4 + 0;	//	0_ 1			0 ___ 3
				triIndices[i * 6 + 1] = i * 4 + 3;	//  | /		Verts:	 |	/|
				triIndices[i * 6 + 2] = i * 4 + 1;	// 2|/				1|/__|2

				triIndices[i * 6 + 3] = i * 4 + 3;	//	  3
				triIndices[i * 6 + 4] = i * 4 + 2;	//   /|
				triIndices[i * 6 + 5] = i * 4 + 1;	// 5/_|4
			}
		}

		vertsChanged = true;
		uvsChanged = true;
		colorsChanged = true;
		vertCountChanged = true;

		return firstNewElement;
	}

	// Adds a sprite to the manager at the location and rotation of the client 
	// GameObject and with its transform.  Returns a reference to the new sprite
	// Width and height are in world space units
	// leftPixelX and bottomPixelY- the bottom-left position of the desired portion of the texture, in pixels
	// pixelWidth and pixelHeight - the dimensions of the desired portion of the texture, in pixels
	public Zprite AddSprite(GameObject client, float width, float height, int leftPixelX, int bottomPixelY, int pixelWidth, int pixelHeight, bool billboarded)
	{
		return AddSprite(client, width, height, PixelCoordToUVCoord(leftPixelX, bottomPixelY), PixelSpaceToUVSpace(pixelWidth, pixelHeight), billboarded);
	}

	// Adds a sprite to the manager at the location and rotation of the client 
	// GameObject and with its transform.  Returns a reference to the new sprite
	// Width and height are in world space units
	// lowerLeftUV - the UV coordinate for the upper-left corner
	// UVDimensions - the distance from lowerLeftUV to place the other UV coords
	public Zprite AddSprite(GameObject client, float width, float height, Vector2 lowerLeftUV, Vector2 UVDimensions, bool billboarded)
	{
		int spriteIndex;

		// Get an available sprite:
		if (availableBlocks.Count < 1)
			EnlargeArrays(allocBlockSize);	// If we're out of available sprites, allocate some more:

		// Use a sprite from the list of available blocks:
		spriteIndex = ((Zprite)availableBlocks[0]).index;
		availableBlocks.RemoveAt(0);	// Now that we're using this one, remove it from the available list

		// Assign the new sprite:
		Zprite newSprite = sprites[spriteIndex];
		newSprite.xform = new Matrix4x4();
		newSprite.client = client;
		newSprite.lowerLeftUV = lowerLeftUV;
		newSprite.uvDimensions = UVDimensions;
		newSprite.SetColor(Color.white);

		switch(plane)
		{
			case SPRITE_PLANE.XY:
				newSprite.SetSizeXY(width, height);
				break;
			case SPRITE_PLANE.XZ:
				newSprite.SetSizeXZ(width, height);
				break;
			case SPRITE_PLANE.YZ:
				newSprite.SetSizeYZ(width, height);
				break;
			default:
				newSprite.SetSizeXY(width, height);
				break;
		}

		// Save this to an active list now that it is in-use:
		if(billboarded)			
		{
			newSprite.billboarded = true;
			activeBillboards.Add(newSprite);
		}
		else
			activeBlocks.Add(newSprite);

		// Transform the sprite:
		newSprite.Transform();

		// Setup the UVs:
		UVs[newSprite.uv1] = lowerLeftUV + Vector2.up * UVDimensions.y;	 // Upper-left
		UVs[newSprite.uv2] = lowerLeftUV;								 // Lower-left
		UVs[newSprite.uv3] = lowerLeftUV + Vector2.right * UVDimensions.x;// Lower-right
		UVs[newSprite.uv4] = lowerLeftUV + UVDimensions;					 // Upper-right

		// Set our flags:
		vertsChanged = true;
		uvsChanged = true;

		return newSprite;
	}

	public void SetBillboarded(Zprite sprite)
	{
		// Make sure the sprite isn't in the active list
		// or else it'll get handled twice:
		activeBlocks.Remove(sprite);
		activeBillboards.Add(sprite);
	}

	public void RemoveSprite(Zprite sprite)
	{
		sprite.SetSizeXY(0,0);
		sprite.v1 = Vector3.zero;
		sprite.v2 = Vector3.zero;
		sprite.v3 = Vector3.zero;
		sprite.v4 = Vector3.zero;

		vertices[sprite.mv1] = sprite.v1;
		vertices[sprite.mv2] = sprite.v2;
		vertices[sprite.mv3] = sprite.v3;
		vertices[sprite.mv4] = sprite.v4;

		sprite.client = null;

		availableBlocks.Add(sprite);

		// Remove the sprite from the billboarded list
		// since that list should only contain active
		// sprites:
		if (sprite.billboarded)
			activeBillboards.Remove(sprite);
		else
			activeBlocks.Remove(sprite);

		sprite.billboarded = false;

		vertsChanged = true;
	}
	
	public void HideSprite(Zprite sprite)
	{
		vertices[sprite.mv1] = Vector3.zero;
		vertices[sprite.mv2] = Vector3.zero;
		vertices[sprite.mv3] = Vector3.zero;
		vertices[sprite.mv4] = Vector3.zero;

		// Remove the sprite from the billboarded list
		// since that list should only contain sprites
		// we intend to transform:
		if (sprite.billboarded)
			activeBillboards.Remove(sprite);
		else
			activeBlocks.Remove(sprite);

		sprite.hidden = true;

		vertsChanged = true;
	}

	public void ShowSprite(Zprite sprite)
	{
		// Only show the sprite if it has a client:
        // if(sprite.client == null)
        //  return;

		if(sprite.billboarded)
			activeBillboards.Add(sprite);
		else
			activeBlocks.Add(sprite);

		sprite.hidden = false;

		// Update the vertices:
		sprite.Transform();

		vertsChanged = true;
	}

	public Zprite GetSprite(int i)
	{
		if (i < sprites.Length)
			return sprites[i];
		else
			return null;
	}

	// Updates the vertices of a sprite based on the transform
	// of its client GameObject
	public void Transform(Zprite sprite)
	{
		sprite.Transform();

		vertsChanged = true;
	}

	// Updates the vertices of a sprite such that it is oriented
	// more or less toward the camera
	public void TransformBillboarded(Zprite sprite)
	{
		Vector3 pos = sprite.clientTransform.position;
		Transform t = Camera.main.transform;

		vertices[sprite.mv1] = pos + t.TransformDirection(sprite.v1);
		vertices[sprite.mv2] = pos + t.TransformDirection(sprite.v2);
		vertices[sprite.mv3] = pos + t.TransformDirection(sprite.v3);
		vertices[sprite.mv4] = pos + t.TransformDirection(sprite.v4);

		vertsChanged = true;
	}

	// Informs the SpriteManager that some vertices have changed position
	// and the mesh needs to be reconstructed accordingly
	public void UpdatePositions()
	{
		vertsChanged = true;
	}

	// Updates the UVs of the specified sprite and copies the new values
	// into the mesh object.
	public void UpdateUV(Zprite sprite)
	{
		UVs[sprite.uv1] = sprite.lowerLeftUV + Vector2.up * sprite.uvDimensions.y;	// Upper-left
		UVs[sprite.uv2] = sprite.lowerLeftUV;										// Lower-left
		UVs[sprite.uv3] = sprite.lowerLeftUV + Vector2.right * sprite.uvDimensions.x;// Lower-right
		UVs[sprite.uv4] = sprite.lowerLeftUV + sprite.uvDimensions;					// Upper-right

		uvsChanged = true;
	}

	// Updates the color values of the specified sprite and copies the
	// new values into the mesh object.
	public void UpdateColors(Zprite sprite)
	{
		colors[sprite.cv1] = sprite.color;
		colors[sprite.cv2] = sprite.color;
		colors[sprite.cv3] = sprite.color;
		colors[sprite.cv4] = sprite.color;

		colorsChanged = true;
	}

	// Instructs the manager to recalculate the bounds of the mesh
	public void UpdateBounds()
	{
		updateBounds = true;
	}

	// Schedules a recalculation of the mesh bounds to occur at a
	// regular interval (given in seconds):
	public void ScheduleBoundsUpdate(float seconds)
	{
		boundUpdateInterval = seconds;
		InvokeRepeating("UpdateBounds", seconds, seconds);
	}

	// Cancels any previously scheduled bounds recalculations:
	public void CancelBoundsUpdate()
	{
		CancelInvoke("UpdateBounds");
	}

	// Use this for initialization
	void Start () 
	{
	
	}
	
	// LateUpdate is called once per frame
	public void LateUpdate () 
	{
		// Were changes made to the mesh since last time?
		if (vertCountChanged)
		{
			vertCountChanged = false;
			colorsChanged = false;
			vertsChanged = false;
			uvsChanged = false;
			updateBounds = false;

			mesh.Clear();
			mesh.vertices = vertices;
			mesh.uv = UVs;
			mesh.colors = colors;
			//mesh.normals = normals;
			mesh.triangles = triIndices;
		}
		else
		{
			if (vertsChanged)
			{
				vertsChanged = false;

				if (autoUpdateBounds)
					updateBounds = true;

				mesh.vertices = vertices;
			}

			if (updateBounds)
			{
				mesh.RecalculateBounds();
				updateBounds = false;
			}

			if (colorsChanged)
			{
				colorsChanged = false;

				mesh.colors = colors;
			}

			if (uvsChanged)
			{
				uvsChanged = false;
				mesh.uv = UVs;
			}
		}
	}
}
