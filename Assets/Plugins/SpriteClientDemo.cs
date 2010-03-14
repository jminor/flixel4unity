using UnityEngine;
using System.Collections;

public class SpriteClientDemo : MonoBehaviour 
{
	public SpriteManager spriteMan;
	public GameObject canPrefab;
	public GameObject ballPrefab;

	protected ArrayList ballSprites = new ArrayList();
	protected ArrayList ballBillboards = new ArrayList();
	protected ArrayList canSprites = new ArrayList();
	protected ArrayList canBillboards = new ArrayList();
	
	protected ArrayList balls = new ArrayList();
	protected ArrayList cans = new ArrayList();

	private float counter;		// Used to demonstrate animation
	private Vector2 drPepperUV; // UV Coordinate of the Dr. Pepper image
	private Vector2 cokeUV;		// UV Coordinate of the Coke image
	private Vector2 sodaCanSize;// UV-space dimensions of the can images

	// Use this for initialization
	void Start () 
	{
		CreateGameObjects();
		CreateSprites();
	}
	
	void CreateGameObjects()
	{
		// Create balls:
		balls.Add(Instantiate(ballPrefab, new Vector3(-5f, 7f, 0), Quaternion.identity));
		balls.Add(Instantiate(ballPrefab, new Vector3(-4f, 7f, 0), Quaternion.identity));
		balls.Add(Instantiate(ballPrefab, new Vector3(-3f, 7f, 0), Quaternion.identity));

		balls.Add(Instantiate(ballPrefab, new Vector3(3f, 7f, 0), Quaternion.identity));
		balls.Add(Instantiate(ballPrefab, new Vector3(4f, 7f, 0), Quaternion.identity));
		balls.Add(Instantiate(ballPrefab, new Vector3(5f, 7f, 0), Quaternion.identity));

		// Create cans:
		cans.Add(Instantiate(canPrefab, new Vector3(-5.1f, 8.5f, 0), Quaternion.identity));
		cans.Add(Instantiate(canPrefab, new Vector3(-4.1f, 8.5f, 0), Quaternion.identity));
		cans.Add(Instantiate(canPrefab, new Vector3(-3.1f, 8.5f, 0), Quaternion.identity));

		cans.Add(Instantiate(canPrefab, new Vector3(3.1f, 8.5f, 0), Quaternion.identity));
		cans.Add(Instantiate(canPrefab, new Vector3(4.1f, 8.5f, 0), Quaternion.identity));
		cans.Add(Instantiate(canPrefab, new Vector3(5.1f, 8.5f, 0), Quaternion.identity));
	}
	
	void CreateSprites()
	{
		// Create sprites for three of the balls:
		for(int i=0; i<3; ++i)
		{
			Sprite s = spriteMan.AddSprite((GameObject)balls[i], // The game object to associate the sprite to
										1f, 		// The width of the sprite
										1f, 		// The height of the sprite
										251, 		// Left pixel
										509, 		// Bottom pixel
										256, 		// Width in pixels
										256, 		// Height in pixels
										false);		// Billboarded?
			ballSprites.Add(s);
		}
		
		// Create billboarded sprites for the other three balls:
		for(int i=3; i<6; ++i)
		{
			Sprite s = spriteMan.AddSprite((GameObject)balls[i], // The game object to associate the sprite to
										1f, 		// The width of the sprite
										1f, 		// The height of the sprite
										251, 		// Left pixel
										509, 		// Bottom pixel
										256, 		// Width in pixels
										256, 		// Height in pixels
										true);		// Billboarded?
			ballBillboards.Add(s);
		}

		// Create sprites for three of the cans:
		for(int i=0; i<3; ++i)
		{
			Sprite s = spriteMan.AddSprite((GameObject)cans[i], // The game object to associate the sprite to
										0.524f,		// The width of the sprite
										1f,			// The height of the sprite
										3, 			// Left pixel
										253, 		// Bottom pixel
										130, 		// Width in pixels
										256, 		// Height in pixels
										false);		// Billboarded?
			canSprites.Add(s);
		}
		
		// Create billboarded sprites for the other three cans:
		for(int i=3; i<6; ++i)
		{
			Sprite s = spriteMan.AddSprite((GameObject)cans[i], // The game object to associate the sprite to
										0.524f,		// The width of the sprite
										1f,			// The height of the sprite
										3, 			// Left pixel
										253, 		// Bottom pixel
										130, 		// Width in pixels
										256, 		// Height in pixels
										true);		// Billboarded?
			canBillboards.Add(s);
		}
		
		// Save the actual UVs of the two soda can images (lower-left corner):
		drPepperUV = spriteMan.PixelCoordToUVCoord(3, 253);
		cokeUV = spriteMan.PixelCoordToUVCoord(140, 253);
		sodaCanSize = spriteMan.PixelSpaceToUVSpace(130, 256);
	}

	// Update is called once per frame
	void Update () 
	{
		Sprite s;
		
		counter += 0.1f;
		
		// UV animate one of the cans:
		if( ((int)counter) % 3 == 0 )
		{
			s = (Sprite)canSprites[0];
			
			s.lowerLeftUV = (((int)counter) % 2 == 0)?drPepperUV:cokeUV;
			
			// Cause another can to flash (hide/unhide):
			s = (Sprite)canSprites[1];
			s.hidden = (((int)counter) % 2 == 0);
		}
		
		// Cause one of the balls to fade in and out:
		s = (Sprite)ballSprites[0];
		
		s.SetColor(new Color(1, 1, 1, Mathf.Cos(counter/2f)));
	}
}
