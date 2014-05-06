#pragma strict
#pragma implicit
#pragma downcast

//package com.adamatomic.flixel
//{
//	import com.adamatomic.flixel.data.FlxAnim;
//	
//	import flash.display.BitmapData;
//	import flash.geom.ColorTransform;
//	import flash.geom.Matrix;
//	import flash.geom.Point;
//	import flash.geom.Rectangle;
//	
//	//@desc		The main "game object" class, handles basic physics and animation
//	public
 class FlxSprite extends FlxCore
	{
		static public var LEFT:boolean = false;
		static public var RIGHT:boolean = true;
		
		//@desc If you changed the size of your sprite object to shrink the bounding box, you might need to offset the new bounding box from the top-left corner of the sprite
		public var offset:Point;
		public var velocity:Point;
		public var acceleration:Point;
		//@desc	This isn't drag exactly, more like deceleration that is only applied when acceleration is not affecting the sprite
		public var drag:Point;
		public var maxVelocity:Point;
		//@desc WARNING: rotating sprites decreases rendering performance for this sprite by a factor of 10x!
		public var angle:Number;
		public var angularVelocity:Number;
		public var angularAcceleration:Number;
		public var angularDrag:Number;
		public var maxAngular:Number;
		//@desc	If you want to do Asteroids style stuff, check out thrust (instead of directly accessing the object's velocity or acceleration)
		public var thrust:Number;
		public var maxThrust:Number;
		public var health:Number;
		//@desc	Scale doesn't currently affect collisions automatically, you will need to adjust the width, height and offset manually.  WARNING: scaling sprites decreases rendering performance for this sprite by a factor of 10x!
		public var scale:Point;
		
		//@desc	Whether the current animation has finished its first (or only) loop
		public var finished:boolean;
		private var _animations:FlxArray;
		private var _flipped:uint;
		protected var _curAnim:FlxAnim;
		protected var _curFrame:uint;
		private var _frameTimer:Number;
		private var _callback:Function;
		private var _facing:boolean;
		
		//helpers
		private var _bw:uint;
		private var _bh:uint;
		private var _r:Rectangle;
		private var _p:Point;
		private var _pZero:Point;
		public var pixels:Texture2D;
        // private var _pixels:Texture2D;
		private var _alpha:Number;
		
		public var _sprite:Zprite;
		protected var _uvCoordinatesOfFrame0:Point;
		
		//@desc		Constructor
		//@param	Graphic		The image you want to use
		//@param	X			The initial X position of the sprite
		//@param	Y			The initial Y position of the sprite
		//@param	Animated	Whether the Graphic parameter is a single sprite or a row of sprites
		//@param	Reverse		Whether you need this class to generate horizontally flipped versions of the animation frames
		//@param	Width		If you opt to NOT use an image and want to generate a colored block, or your sprite's frames are not square, you can specify a width here 
		//@param	Height		If you opt to NOT use an image you can specify the height of the colored block here (ignored if Graphic is not null)
		//@param	Color		Specifies the color of the generated block (ignored if Graphic is not null)
		public function FlxSprite(graphic:Texture2D/*=null*/) {
			super();
		    init(graphic,0,0,false,false,0,0,0);
		}
		public function FlxSprite(graphic:Texture2D/*=null*/,X:int/*=0*/,Y:int/*=0*/,Animated:boolean/*=false*/) { 
			super();
			init(graphic,X,Y,Animated,false,0,0,0); 
		}
		public function FlxSprite(graphic:Texture2D/*=null*/,X:int/*=0*/,Y:int/*=0*/,Animated:boolean/*=false*/,Reverse:boolean/*=false*/) {
			super();
			init(graphic,X,Y,Animated,Reverse,0,0,0); 
		}
		public function FlxSprite(graphic:Texture2D/*=null*/,X:int/*=0*/,Y:int/*=0*/,Animated:boolean/*=false*/,Reverse:boolean/*=false*/,Width:uint/*=0*/,Height:uint/*=0*/,Color:long/*=0*/)
		{
			super();
			init(graphic,X,Y,Animated,Reverse,Width,Height,Color);
		}

		public function init(graphic:Texture2D/*=null*/,X:int/*=0*/,Y:int/*=0*/,Animated:boolean/*=false*/,Reverse:boolean/*=false*/,Width:uint/*=0*/,Height:uint/*=0*/,Color:long/*=0*/)
		{
            if(graphic == null) {
                FlxG.log("createBitmap?");
                pixels = FlxG.createBitmap(Width,Height,Color);
                _uvCoordinatesOfFrame0 = new Point(0,0);
            } else {
			    _uvCoordinatesOfFrame0 = FlxG.addBitmap(graphic,Reverse);
			    pixels = graphic;
			}
			
			x = X;
			y = Y;
			if(Width == 0)
			{
				if(Animated)
					Width = pixels.height;
				else
					Width = pixels.width;
			}
			if(Height == 0)
			{
				Height = pixels.height;
			}
			width = _bw = Width;
			height = _bh = Height; //pixels.height;
//			_bw = Width;
//			_bh = pixels.height;
//			SetSizeXY(_bw, _bh);
			offset = new Point();
			
			velocity = new Point();
			acceleration = new Point();
			drag = new Point();
			maxVelocity = new Point(10000,10000);
			
			angle = 0;
			angularVelocity = 0;
			angularAcceleration = 0;
			angularDrag = 0;
			maxAngular = 10000;
			
			thrust = 0;
			
			scale = new Point(1,1);
			
			finished = false;
			_facing = true;
			_animations = new FlxArray();
			if(Reverse)
				_flipped = pixels.width>>1;
			else
				_flipped = 0;
			_curAnim = null;
			_curFrame = 0;
			_frameTimer = 0;
			
			_p = new Point(x,y);
			_pZero = new Point();
			_r = new Rectangle(0,0,_bw,_bh);
            // _pixels = pixels;
			
			health = 1;
			alpha = 1;
			
			_callback = null;
			
			_sprite = FlxG.SpriteManager.AddSprite(null,_bw,_bh,_uvCoordinatesOfFrame0.x,_uvCoordinatesOfFrame0.y,_bw,_bh,false);
			// turn this on to watch the pool of sprites grow:
			//FlxG.log("New FlxSprite: "+this+" "+_sprite.index+" of "+FlxG.SpriteManager.sprites.length);
		}
		
		//@desc		Called by game loop, handles animation and physics
		/*override*/ public function update():void
		{
			super.update();
			
			if(!active) return;
			
			//animation
			if((_curAnim != null) && (_curAnim.delay > 0) && (_curAnim.looped || !finished))
			{
				_frameTimer += FlxG.elapsed;
				if(_frameTimer > _curAnim.delay)
				{
					_frameTimer -= _curAnim.delay;
					if(_curFrame == _curAnim.frames.length-1)
					{
						if(_curAnim.looped) _curFrame = 0;
						finished = true;
					}
					else
						_curFrame++;
					calcFrame();
				}
			}
			
			//motion + physics
			angularVelocity = FlxG.computeVelocity(angularVelocity,angularAcceleration,angularDrag,maxAngular);
			angle += angularVelocity*FlxG.elapsed;
			var thrustComponents:Point;
			if(thrust != 0)
			{
				thrustComponents = FlxG.rotatePoint(-thrust,0,0,0,angle);
				var maxComponents:Point = FlxG.rotatePoint(-maxThrust,0,0,0,angle);
				maxVelocity.x = Mathf.Abs(maxComponents.x);
				maxVelocity.y = Mathf.Abs(maxComponents.y);
			}
			else
				thrustComponents = _pZero;
			velocity.x = FlxG.computeVelocity(velocity.x,acceleration.x+thrustComponents.x,drag.x,maxVelocity.x);
			velocity.y = FlxG.computeVelocity(velocity.y,acceleration.y+thrustComponents.y,drag.y,maxVelocity.y);
			x += (velocity.x)*FlxG.elapsed;
			y += (velocity.y)*FlxG.elapsed;
			//FlxG.log("x="+x+"  vx="+velocity.x+"  elapsed="+FlxG.elapsed);
		}
				
		//@desc		Called by game loop, blits current frame of animation to the screen (and handles rotation)
		/*override*/ public function render():void
		{
		    if(!_sprite /*|| !_gameObj*/) return;
            // if(!visible) {
            //     if (!_sprite.hidden) FlxG.SpriteManager.HideSprite(_sprite);
            //  return;
            // }
			getScreenXY(_p);

            _sprite.xform.SetTRS(new Vector3(_p.x+_bw/2,FlxG.height-(_p.y+_bh/2),0),
                                 Quaternion.Euler(0, 0, -angle),
                                 new Vector3(scale.x,scale.y,1));

			var rx:uint = 0;
			if (_curAnim != null) {
			    var f:uint = _curAnim.frames[_curFrame];
			    rx = f*_bw;
            }
            
            var uvCoordinates = FlxG.SpriteManager.PixelSpaceToUVSpace(_uvCoordinatesOfFrame0.x + rx, _uvCoordinatesOfFrame0.y);
            var uvDimensions = FlxG.SpriteManager.PixelSpaceToUVSpace(_bw, _bh);
            
            if (!facing) {
                uvCoordinates.x += uvDimensions.x;
                uvDimensions.x = -uvDimensions.x;
            }
            
            if (uvCoordinates != _sprite.lowerLeftUV) {
                _sprite.lowerLeftUV = uvCoordinates;
            }
            if (uvDimensions != _sprite.uvDimensions) {
                _sprite.uvDimensions = uvDimensions;
            }
            
            // if (_sprite.hidden) FlxG.SpriteManager.ShowSprite(_sprite);
		}
		
		//@desc		Checks to see if a point in 2D space overlaps this FlxCore object
		//@param	X			The X coordinate of the point
		//@param	Y			The Y coordinate of the point
		//@param	PerPixel	Whether or not to use per pixel collision checking
		//@return	Whether or not the point overlaps this object
		/*override*/ public function overlapsPoint(X:Number,Y:Number,PerPixel:boolean/* = false*/):boolean
		{
			var tx:Number = x;
			var ty:Number = y;
			if((scrollFactor.x != 1) || (scrollFactor.y != 1))
			{
				tx -= Mathf.Floor(FlxG.scroll.x*scrollFactor.x);
				ty -= Mathf.Floor(FlxG.scroll.y*scrollFactor.y);
			}
//			if(PerPixel)
//				return _pixels.hitTest(new Point(0,0),0xFF,new Point(X-tx,Y-ty));
			else if((X <= tx) || (X >= tx+width) || (Y <= ty) || (Y >= ty+height))
				return false;
			return true;
		}
		
		//@desc		Called when this object collides with a FlxBlock on one of its sides
		//@return	Whether you wish the FlxBlock to collide with it or not
		/*override*/ public function hitWall():boolean { velocity.x = 0; return true; }
		
		//@desc		Called when this object collides with the top of a FlxBlock
		//@return	Whether you wish the FlxBlock to collide with it or not
		/*override*/ public function hitFloor():boolean { velocity.y = 0; return true; }
		
		//@desc		Called when this object collides with the bottom of a FlxBlock
		//@return	Whether you wish the FlxBlock to collide with it or not
		/*override*/ public function hitCeiling():boolean { velocity.y = 0; return true; }
		
		//@desc		Call this function to "damage" (or give health bonus) to this sprite
		//@param	Damage		How much health to take away (use a negative number to give a health bonus)
		 public function hurt(Damage:Number):void
		{
			health -= Damage;
			if((health) <= 0)
				kill();
		}
		
		/*override*/ public function kill():void
		{
			if(dead)
				return;
			super.kill();
			//FlxG.SpriteManager.RemoveSprite(_sprite);
		}
		
		
		//@desc		Called if/when this sprite is launched by a FlxEmitter
		 public function onEmit():void { }
		
		//@desc		Adds a new animation to the sprite
		//@param	Name		What this animation should be called (e.g. "run")
		//@param	Frames		An array of numbers indicating what frames to play in what order (e.g. 1, 2, 3)
		//@param	FrameRate	The speed in frames per second that the animation should play at (e.g. 40 fps)
		//@param	Looped		Whether or not the animation is looped or just plays once
		public function addAnimation(Name:String, Frames:Array):void { addAnimation(Name,Frames,0,true); }
		public function addAnimation(Name:String, Frames:Array, FrameRate:Number):void { addAnimation(Name,Frames,FrameRate,true); }
		public function addAnimation(Name:String, Frames:Array, FrameRate:Number/*=0*/, Looped:boolean/*=true*/):void
		{
			_animations.add(new FlxAnim(Name,Frames,FrameRate,Looped));
		}
		
		//@desc		Pass in a function to be called whenever this sprite's animation changes
		//@param	AnimationCallback		A function that has 3 parameters: a string name, a uint frame number, and a uint frame index
		public function addAnimationCallback(AnimationCallback:Function):void
		{
			_callback = AnimationCallback;
		}
		
		//@desc		Plays an existing animation (e.g. "run") - if you call an animation that is already playing it will be ignored
		//@param	AnimName	The string name of the animation you want to play
		//@param	Force		Whether to force the animation to restart
		public function play(AnimName:String):void { play(AnimName,false); }
		public function play(AnimName:String,Force:boolean/*=false*/):void
		{
			if(!Force && (_curAnim != null) && (AnimName == _curAnim.name)) return;
			_curFrame = 0;
			_frameTimer = 0;
			for(var i:uint = 0; i < _animations.length; i++)
			{
				if((_animations[i] as FlxAnim).name == AnimName)
				{
					finished = false;
					_curAnim = _animations[i];
					calcFrame();
					return;
				}
			}
		}
		
		 public function set exists(value:boolean)
		{
			super(value);
            if (_sprite && (!_exists || !_visible) && !_sprite.hidden) FlxG.SpriteManager.HideSprite(_sprite);
            if (_sprite && _exists && _visible && _sprite.hidden) FlxG.SpriteManager.ShowSprite(_sprite);
		}

		 public function set visible(value:boolean)
		{
			//super(value);
			_visible = value;
            if (_sprite && (!_exists || !_visible) && !_sprite.hidden) FlxG.SpriteManager.HideSprite(_sprite);
            if (_sprite && _exists && _visible && _sprite.hidden) FlxG.SpriteManager.ShowSprite(_sprite);
		}
		
		//@desc		Tell the sprite which way to face (you can just set 'facing' but this function also updates the animation instantly)
		//@param	Direction		True is Right, False is Left (see static const members RIGHT and LEFT)		
		public function set facing(value:boolean)
		{
			var c:boolean = _facing != value;
			_facing = value;
			if(c) calcFrame();
		}
		
		//@desc		Get the direction the sprite is facing
		//@return	True means facing right, False means facing left (see static const members RIGHT and LEFT)
		public function get facing():boolean
		{
			return _facing;
		}
		
		//@desc		Tell the sprite to change to a random frame of animation (useful for instantiating particles or other weird things)
		public function randomFrame():void
		{
//			_pixels.copyPixels(pixels,new Rectangle(Math.floor(Math.random()*(pixels.width/_bw))*_bw,0,_bw,_bh),_pZero);
            addAnimation("random", [Mathf.Floor(Random.value*(pixels.width/_bw))]);
            play("random");
		}
		
		//@desc		Tell the sprite to change to a specific frame of animation (useful for instantiating particles)
		//@param	Frame	The frame you want to display
		public function specificFrame(Frame:uint):void
		{
//			_pixels.copyPixels(pixels,new Rectangle(Frame*_bw,0,_bw,_bh),_pZero);
		}
		
		//@desc		Call this function to figure out the post-scrolling "screen" position of the object
		//@param	P	Takes a Flash Point object and assigns the post-scrolled X and Y values of this object to it
		/*override*/ protected function getScreenXY(P:Point):void
		{
			P.x = Mathf.Floor(x-offset.x)+Mathf.Floor(FlxG.scroll.x*scrollFactor.x);
			P.y = Mathf.Floor(y-offset.y)+Mathf.Floor(FlxG.scroll.y*scrollFactor.y);
		}
		
		//@desc		Internal function to update the current animation frame
		private function calcFrame():void
		{
//			if(_curAnim == null)
//				_pixels.copyPixels(pixels,_r,_pZero);
//			else
//			{
//				var rx:uint = _curAnim.frames[_curFrame]*_bw;
//				if(!_facing && (_flipped > 0))
//					rx = (_flipped<<1)-rx-_bw;
//				_pixels.copyPixels(pixels,new Rectangle(rx,0,_bw,_bh),_pZero);
//			}
//			if(_alpha != 1) _pixels.colorTransform(_r,new ColorTransform(1,1,1,_alpha));
//			if(_callback != null) _callback(_curAnim.name,_curFrame,_curAnim.frames[_curFrame]);
		}
		
		//@desc		The setter for alpha
		//@param	Alpha	The new opacity value of the sprite (between 0 and 1)
		public function set alpha(value:Number)
		{
			if(value > 1) value = 1;
			if(value < 0) value = 0;
			_alpha = value;
			calcFrame();
		}
		
		//@desc		The getter for alpha
		//@return	The value of this sprite's opacity
		public function get alpha():Number
		{
			return _alpha;
		}
	}
//}