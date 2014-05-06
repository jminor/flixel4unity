#pragma strict
#pragma implicit
#pragma downcast

// This new class was introduced by jminor in an attempt to make Flixel work within Unity
// This class takes a bunch of other sprites (usually blocks) and pre-composites them into a
// single mega-sprite

class MegaSprite extends FlxSprite
	{
		private var _sprites:FlxArray;
		//private var _texture:Texture2D;
		
		public function MegaSprite(sprites:FlxArray,maxWidth:uint,maxHeight:uint)
		{
			_sprites = sprites;
		    var _texture:Texture2D = new Texture2D(maxWidth,maxHeight);
			var c:Color = new Color(0,0,0,0);
		    for(y=0; y<_texture.height; y++) for(x=0; x<_texture.width; x++) _texture.SetPixel(x,y,c);
			
		    // find the corner of all the sprites/blocks
		    var i:uint;
		    var thing:FlxCore = sprites[0];
		    var xPos:int = thing.x;
		    var yPos:int = thing.y;
		    for (i=1; i<sprites.length; i++) {
		        thing = sprites[i];
		        xPos = Mathf.Min(xPos,thing.x);
		        yPos = Mathf.Min(yPos,thing.y);
	        }

		    //FlxG.log("MegaSprite "+sprites.length+" items "+maxWidth+"x"+maxHeight);
		    
		    for (i=0; i<sprites.length; i++) {
		        thing = sprites[i];

		        if (thing instanceof FlxSprite) {
    		        var sprite:FlxSprite = thing;
    		        var pixels:Color[] = sprite.pixels.GetPixels(0);
                    _texture.SetPixels(sprite.x - xPos, sprite.y - yPos, sprite.pixels.width, sprite.pixels.height, pixels, 0);
    	        }else if (thing instanceof FlxBlock) {
    		        var block:FlxBlock = thing;
                    block.renderIntoTexture(_texture, -xPos, -yPos);
    	        }
            }
            
            _texture.Apply(true);
			super(_texture,xPos,yPos,true);
			_texture = null;
			
			width = maxWidth;
			height = maxHeight;
			
			x = xPos;
			y = yPos;
		}
		
	}
//}
