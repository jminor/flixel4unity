//-----------------------------------------------------------------
//	LinkedSpriteManager v0.52 (1-21-2009)
//  Copyright 2009 Brady Wright and Above and Beyond Software
//	All rights reserved
//-----------------------------------------------------------------
// A class to allow the drawing of multiple "quads" as part of a
// single aggregated mesh so as to achieve multiple, independently
// moving objects using a single draw call.
//-----------------------------------------------------------------


using UnityEngine;
using System.Collections;

// A variation on the SpriteManager that automatically links all
// translations and rotations of the client GameObjects to the
// associated sprite - meaning the client need not worry about
// micromanaging all transformations:
public class LinkedSpriteManager : SpriteManager 
{
	// Use this for initialization
	void Start () 
	{
	
	}

	// Transforms all sprites by their associated GameObject's
	// transforms:
	void TransformSprites()
	{
		for(int i=0; i<activeBlocks.Count; ++i)
		{
			((Sprite)activeBlocks[i]).Transform();
		}

		// Handle any billboarded sprites:
		if(activeBillboards.Count > 0)
		{
			Transform t = Camera.main.transform;
			Vector3 pos;
			Sprite s;

			for(int i=0; i<activeBillboards.Count; ++i)
			{
				s = (Sprite)activeBillboards[i];
				pos = s.clientTransform.position;

				vertices[s.mv1] = pos + t.TransformDirection(s.v1);
				vertices[s.mv2] = pos + t.TransformDirection(s.v2);
				vertices[s.mv3] = pos + t.TransformDirection(s.v3);
				vertices[s.mv4] = pos + t.TransformDirection(s.v4);
			}
		}
	}

	// LateUpdate is called once per frame
	new void LateUpdate() 
	{
		// Transform all sprites according to their
		// client GameObject's transforms:
		TransformSprites();

		if (vertCountChanged)
		{
    		mesh.Clear();
    		mesh.vertices = vertices;
			mesh.uv = UVs;
			mesh.colors = colors;
			mesh.triangles = triIndices;

			vertCountChanged = false;
			uvsChanged = false;
			colorsChanged = false;
		}
		else
		{
    		mesh.vertices = vertices;
    		
			if (uvsChanged)
			{
				mesh.uv = UVs;
				uvsChanged = false;
			}

			if (colorsChanged)
			{
				colorsChanged = false;

				mesh.colors = colors;
			}

			// Explicitly recalculate bounds since
			// we didn't assign new triangles (which
			// implicitly recalculates bounds)
			if (updateBounds || autoUpdateBounds)
			{
				mesh.RecalculateBounds();
				updateBounds = false;
			}
		}
	}
}
