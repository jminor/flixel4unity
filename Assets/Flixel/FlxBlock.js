#pragma strict

//package com.adamatomic.flixel
//{
//	import flash.display.BitmapData;
//	import flash.geom.Point;
//	import flash.geom.Rectangle;
//	
//	//@desc		This is the basic "environment object" class, used to create walls and floors
//	public 
class FlxBlock extends FlxCore
	{
		public var pixels:Texture2D;
		public var _rects:FlxArray;
		public var _tileSize:uint;
		public var _p:Point;
		public var _sprites:FlxArray;
		public var _uv:Point;
		
		//@desc		Constructor
		//@param	X			The X position of the block
		//@param	Y			The Y position of the block
		//@param	Width		The width of the block
		//@param	Height		The height of the block
		//@param	TileGraphic The graphic class that contains the tiles that should fill this block
		//@param	Empties		The number of "empty" tiles to add to the auto-fill algorithm (e.g. 8 tiles + 4 empties = 1/3 of block will be open holes)
		public function FlxBlock(X:int,Y:int,Width:uint,Height:uint,TileGraphic:Texture2D) {
			super();
			init(X,Y,Width,Height,TileGraphic,0);
		}
		public function FlxBlock(X:int,Y:int,Width:uint,Height:uint,TileGraphic:Texture2D,Empties:uint/*=0*/) {
			super();
			init(X,Y,Width,Height,TileGraphic,Empties);
		}
		public function init(X:int,Y:int,Width:uint,Height:uint,TileGraphic:Texture2D,Empties:uint/*=0*/)
		{
			x = X;
			y = Y;
			width = Width;
			height = Height;
			_rects = new FlxArray();
			_sprites = new FlxArray();
			_p = new Point();
			if(TileGraphic == null)
				return;

			pixels = TileGraphic;
			_uv = FlxG.addBitmap(TileGraphic);
			_tileSize = pixels.height;
			var widthInTiles:uint = Mathf.Ceil(width/_tileSize);
			var heightInTiles:uint = Mathf.Ceil(height/_tileSize);
			width = widthInTiles*_tileSize;
			height = heightInTiles*_tileSize;
			var numTiles:uint = widthInTiles*heightInTiles;
			var numGraphics:uint = pixels.width/_tileSize;
			for(var i:uint = 0; i < numTiles; i++)
			{
			    var rect:Rectangle = null;
    			var sprite:Sprite = null;
    			
				if(Random.value*(numGraphics+Empties) > Empties) {
                    rect = new Rectangle(_tileSize*Mathf.Floor(Random.value*numGraphics),0,_tileSize,_tileSize);
        		}

				_rects.push(rect);
				_sprites.push(sprite);
			}
		}
		
		public function renderIntoTexture(texture:Texture2D, offsetX:int, offsetY:int):void
		{
		    getScreenXY(_p);
			var opx:int = _p.x;
			for(var i:uint = 0; i < _rects.length; i++)
			{
			    var rect:Rectangle = _rects[i];
				if(rect != null) {
				    var pix:Color[] = pixels.GetPixels(rect.x, rect.y, rect.width, rect.height, 0);
				    texture.SetPixels(_p.x+offsetX, texture.height-(_p.y+offsetY)-rect.height, rect.width, rect.height, pix, 0);
			    }
				_p.x += _tileSize;
				if(_p.x >= opx + width)
				{
					_p.x = opx;
					_p.y += _tileSize;
				}
			}
			
	    }
		
		//@desc		Draws this block
		/*override*/ public function render():void
		{
		    FlxG.log("This is very very slow, you should use a MegaSprite instead");
			super.render();
			getScreenXY(_p);
			var opx:int = _p.x;
			for(var i:uint = 0; i < _rects.length; i++)
			{
			    var rect:Rectangle = _rects[i];
				if(rect != null) {
				    var sprite:Sprite = _sprites[i];
				    if(!onScreen()) {
				        if (sprite != null) {
				            FlxG.SpriteManager.RemoveSprite(sprite);
				            _sprites[i] = null;
			            }
				        //if (!sprite.hidden) FlxG.SpriteManager.HideSprite(sprite);
			        }else{
			            if (sprite == null) {
                            sprite = FlxG.SpriteManager.AddSprite(null, rect.width, rect.height, _uv.x+rect.x, _uv.y+rect.y, rect.width, rect.height, false);
                            sprite.lowerLeftUV = FlxG.SpriteManager.PixelSpaceToUVSpace(_uv.x+rect.x, _uv.y+rect.y);
                            //sprite.SetColor(new Color(1,1,1,0.2));
                            _sprites[i] = sprite;
		                }
				        //if (sprite.hidden) FlxG.SpriteManager.ShowSprite(sprite);
    				    sprite.xform.SetTRS(new Vector3(_p.x+rect.width>>1,FlxG.height-(_p.y+rect.height>>1),0),
    				                        Quaternion.identity,
    				                        Vector3.one);
            		}
			    }
				_p.x += _tileSize;
				if(_p.x >= opx + width)
				{
					_p.x = opx;
					_p.y += _tileSize;
				}
			}
		}
	}
//}