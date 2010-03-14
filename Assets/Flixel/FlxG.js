#pragma strict

//package com.adamatomic.flixel
//{
//	import flash.display.BitmapData;
//	import flash.events.Event;
//	import flash.geom.Matrix;
//	import flash.geom.Point;
//	import flash.media.Sound;
//	import flash.media.SoundChannel;
//	import flash.media.SoundTransform;
//	import flash.net.URLRequest;
//	import flash.net.navigateToURL;
//	
//	//@desc		This is a global helper class full of useful functions for audio, input, basic info, and the camera system
//	public 
class FlxG
	{
		//@desc Represents the amount of time in seconds that passed since last frame
		static public var elapsed:Number;
		//@desc A reference or pointer to the current FlxState object being used by the game
		static public var state:FlxState;
		static public var width:uint;
		static public var height:uint;
		static public var level:uint;
		static public var levels:FlxArray;
		static public var score:uint;
		static public var scores:FlxArray;
		
		//@desc These are the constants for use with the Pressed and Releases functions
		static public var LEFT:uint = 0;
		//@desc These are the constants for use with the Pressed and Releases functions
		static public var RIGHT:uint = 1;
		//@desc These are the constants for use with the Pressed and Releases functions
		static public var UP:uint = 2;
		//@desc These are the constants for use with the Pressed and Releases functions
		static public var DOWN:uint = 3;
		//@desc These are the constants for use with the Pressed and Releases functions
		static public var A:uint = 4;
		//@desc These are the constants for use with the Pressed and Releases functions
		static public var B:uint = 5;
		//@desc These are the constants for use with the Pressed and Releases functions
		static public var MOUSE:uint = 6;
		
		//@desc A shortcut way of checking if a particular key is pressed
		static public var kUp:boolean;
		//@desc A shortcut way of checking if a particular key is pressed
		static public var kDown:boolean;
		//@desc A shortcut way of checking if a particular key is pressed
		static public var kLeft:boolean;
		//@desc A shortcut way of checking if a particular key is pressed
		static public var kRight:boolean;
		//@desc A shortcut way of checking if a particular key is pressed
		static public var kA:boolean;
		//@desc A shortcut way of checking if a particular key is pressed
		static public var kB:boolean;
		//@desc A shortcut way of checking if a particular key is pressed
		static public var kMouse:boolean;
		//@desc The current game coordinates of the mouse pointer (not necessarily the screen coordinates)
		static public var mouse:Point;
		static private var _keys:Array;
		static private var _oldKeys:Array;
		
		//audio
		static private var _muted:uint;
		static private var _music:Object;
		static private var _musicChannel:Object;
		static private var _musicPosition:Number;
		static private var _volume:Number;
		static private var _musicVolume:Number;
		static private var _masterVolume:Number;
		
		//Ccmera system variables
		static public var followTarget:FlxCore;
		static public var followLead:Point;
		static public var followLerp:Number;
		static public var followMin:Point;
		static public var followMax:Point;
		static private var _scrollTarget:Point;
		
		//graphics stuff
		static public var scroll:Point;
		static public var buffer:Object;
		static private var _cache:Hashtable;
        static public var atlas:Texture2D;
        static public var atlasSpot:Point;
		
		//function reflectors
		static private var _quake:Function;
		static private var _flash:Function;
		static private var _fade:Function;
		static private var _switchState:Function;
		static private var _log:Function;
		static private var _setCursor:Function;
		
		static public var SpriteManager:SpriteManager;
		
		//@desc		Resets the key register and shortcut booleans to "off"
		static public function resetKeys():void
		{
			kUp = kDown = kLeft = kRight = kA = kB = kMouse = false;
			for(var i:uint = 0; i < _keys.length; i++)
				_keys[i] = 0;
		}
		
		//@desc		Check to see if this key is pressed
		//@param	Key		One of the key constants listed above (e.g. LEFT or A)
		//@return	Whether the key is pressed
		static public function pressed(Key:uint):boolean { var v:int = _keys[Key]; return (v > 0); }
		
		//@desc		Check to see if this key was JUST pressed
		//@param	Key		One of the key constants listed above (e.g. LEFT or A)
		//@return	Whether the key was just pressed
		static public function justPressed(Key:uint):boolean { return (_keys[Key] == 2); }
		
		//@desc		Check to see if this key is NOT pressed
		//@param	Key		One of the key constants listed above (e.g. LEFT or A)
		//@return	Whether the key is not pressed
		static public function justReleased(Key:uint):boolean { return (_keys[Key] == -1); }
		
		//@desc		Set up and autoplay a music track
		//@param	Music		The sound file you want to loop in the background
		//@param	Volume		How loud the sound should be, from 0 to 1
		//@param	Autoplay	Whether to automatically start the music or not (defaults to true)
		static public function setMusic(Music/*:Class*/):void { setMusic(Music,1,true); }
		static public function setMusic(Music/*:Class*/,Volume:Number/*=1*/,Autoplay:boolean/*=true*/):void
		{
			stopMusic();
			//_music = new Music();
			_musicVolume = Volume;
			if(Autoplay)
				playMusic();
		}
		
		//@desc		Plays a sound effect once
		//@param	SoundEffect		The sound you want to play
		//@param	Volume			How loud to play it (0 to 1)
		static public function play(SoundEffect:Object):void { play(SoundEffect,1); }
		static public function play(SoundEffect:Object,Volume:Number/*=1*/):void
		{
			//(new SoundEffect()).play(0,0,new SoundTransform(Volume*_muted*_volume*_masterVolume));
		}
		
		//@desc		Plays or resumes the music file set up using setMusic()
		static public function playMusic():void
		{
//			if(_musicPosition < 0)
//				return;
//			if(_musicPosition == 0)
//			{
//				if(_musicChannel == null) _musicChannel = _music.play(0,9999,new SoundTransform(_muted*_volume*_musicVolume*_masterVolume));
//			}
//			else
//			{
//				_musicChannel = _music.play(_musicPosition,0,new SoundTransform(_muted*_volume*_musicVolume*_masterVolume));
//				_musicChannel.addEventListener(Event.SOUND_COMPLETE, loopMusic);
//			}
//			_musicPosition = 0;
		}
		
		//@desc		An internal helper function used to help Flash resume playing a looped music track
//      static private function loopMusic(event:Event/*=null*/):void
//      {
// //           if (_musicChannel == null)
// //               return;
// //           _musicChannel.removeEventListener(Event.SOUND_COMPLETE,loopMusic);
// //           _musicChannel = null;
// //           playMusic();
//      }
		
		//@desc		Pauses the current music track
		static public function pauseMusic():void
		{
//			if(_musicChannel == null)
//			{
//				_musicPosition = -1;
//				return;
//			}
//			_musicPosition = _musicChannel.position;
//			_musicChannel.stop();
//			while(_musicPosition >= _music.length)
//				_musicPosition -= _music.length;
//			_musicChannel = null;
		}
		
		//@desc		Stops the current music track
		static public function stopMusic():void
		{
//			_musicPosition = 0;
//			if(_musicChannel != null)
//			{
//				_musicChannel.stop();
//				_musicChannel = null;
//			}
		}
		
		//@desc		Mutes the sound
		//@param	SoundOff	Whether the sound should be off or on
		static public function setMute(SoundOff:boolean):void { if(SoundOff) _muted = 0; else _muted = 1; adjustMusicVolume(); }
		
		//@desc		Check to see if the game is muted
		//@return	Whether the game is muted
		static public function getMute():boolean { if(_muted == 0) return true; return false; }
		
		//@desc		Change the volume of the game
		//@param	Volume		A number from 0 to 1
		static public function setVolume(Volume:Number):void { _volume = Volume; adjustMusicVolume(); }
		
		//@desc		Find out how load the game is currently
		//@param	A number from 0 to 1
		static public function getVolume():Number { return _volume; }
		
		//@desc		Change the volume of just the music
		//@param	Volume		A number from 0 to 1
		static public function setMusicVolume(Volume:Number):void { _musicVolume = Volume; adjustMusicVolume(); }
		
		//@desc		Find out how loud the music is
		//@return	A number from 0 to 1
		static public function getMusicVolume():Number { return _musicVolume; }
		
		//@desc		An internal function that adjust the volume levels and the music channel after a change
		static private function adjustMusicVolume():void
		{
//			if(_muted < 0)
//				_muted = 0;
//			else if(_muted > 1)
//				_muted = 1;
//			if(_volume < 0)
//				_volume = 0;
//			else if(_volume > 1)
//				_volume = 1;
//			if(_musicVolume < 0)
//				_musicVolume = 0;
//			else if(_musicVolume > 1)
//				_musicVolume = 1;
//			if(_masterVolume < 0)
//				_masterVolume = 0;
//			else if(_masterVolume > 1)
//				_masterVolume = 1;
//			if(_musicChannel != null)
//				_musicChannel.soundTransform = new SoundTransform(_muted*_volume*_musicVolume*_masterVolume);
		}
		
		//@desc		Generates a new BitmapData object (basically a colored square :P) and caches it
		//@param	Width	How wide the square should be
		//@param	Height	How high the square should be
		//@param	Color	What color the square should be
		//@return	This object is used during the sprite blitting process
		static public function createBitmap(Width:uint, Height:uint, Color:long):Object
		{
//			var key:String = Width+"x"+Height+":"+Color;
//			if((_cache[key] == undefined) || (_cache[key] == null))
//				_cache[key] = new BitmapData(Width,Height,true,Color);
//			return _cache[key];
            //log("createBitmap "+Width+" x "+Height);
            return new Texture2D (Width, Height);
		}
		
		//@desc		Loads a bitmap from a file, caches it, and generates a horizontally flipped version if necessary
		//@param	Graphic		The image file that you want to load
		//@param	Reverse		Whether to generate a flipped version
		static public function addBitmap(graphic:Texture2D):Object { return addBitmap(graphic,false); }
		static public function addBitmap(graphic:Texture2D,Reverse:boolean/*=false*/):Object
		{
            var key:String = graphic.GetInstanceID().ToString();
            if(_cache[key] == null)
            {
                var pixels:Color[] = graphic.GetPixels(0);
                atlasSpot.x = 0;
                // if (atlasSpot.x + graphic.width > atlas.width) {
                //     atlasSpot.x = 0;
                //     atlasSpot.y += graphic.height;
                // }
                //log("ATLAS SPOT: "+graphic.name+" at "+atlasSpot.x+","+atlasSpot.y+" is "+graphic.width+"x"+graphic.height);
                _cache[key] = new Point(atlasSpot.x, atlasSpot.y);
                atlas.SetPixels(atlasSpot.x, atlasSpot.y, graphic.width, graphic.height, pixels, 0);
                atlas.Apply(true);
                //atlasSpot.x += graphic.width;
                atlasSpot.y += graphic.height;
            }

            return _cache[key];
		}
		
		//@desc		Rotates a point in 2D space around another point by the given angle
		//@param	X		The X coordinate of the point you want to rotate
		//@param	Y		The Y coordinate of the point you want to rotate
		//@param	PivotX	The X coordinate of the point you want to rotate around
		//@param	PivotY	The Y coordinate of the point you want to rotate around
		//@param	Angle	Rotate the point by this many degrees
		//@return	A Flash Point object containing the coordinates of the rotated point
		static public function rotatePoint(X:Number, Y:Number, PivotX:Number, PivotY:Number, Angle:Number):Point
		{
			var radians:Number = -Angle / 180 * Mathf.PI;
			var dx:Number = X-PivotX;
			var dy:Number = PivotY-Y;
			return new Point(PivotX + Mathf.Cos(radians)*dx - Mathf.Sin(radians)*dy, PivotY - (Mathf.Sin(radians)*dx + Mathf.Cos(radians)*dy));
		};
		
		//@desc		Calculates the angle between a point and the origin (0,0)
		//@param	X		The X coordinate of the point
		//@param	Y		The Y coordinate of the point
		//@return	The angle in degrees
		static public function getAngle(X:Number, Y:Number):Number
		{
			return Mathf.Atan2(Y,X) * 180 / Mathf.PI;
		};

		//@desc		Tells the camera subsystem what FlxCore object to follow
		//@param	Target		The object to follow
		//@param	Lerp		How much lag the camera should have (can help smooth out the camera movement)
		static public function follow(Target:FlxCore, Lerp:Number/*=1*/):void
		{
			followTarget = Target;
			followLerp = Lerp;
			
			scroll.x = _scrollTarget.x = (width>>1)-followTarget.x-(followTarget.width>>1);
			scroll.y = _scrollTarget.y = (height>>1)-followTarget.y-(followTarget.height>>1);
		}
		
		//@desc		Specify an additional camera component - the velocity-based "lead", or amount the camera should track in front of a sprite
		//@param	LeadX		Percentage of X velocity to add to the camera's motion
		//@param	LeadY		Percentage of Y velocity to add to the camera's motion
		static public function followAdjust(LeadX:Number/* = 0*/, LeadY:Number/* = 0*/):void
		{
			followLead = new Point(LeadX,LeadY);
		}
		
		//@desc		Specify an additional camera component - the boundaries of the level or where the camera is allowed to move
		//@param	MinX	The smallest X value of your level (usually 0)
		//@param	MinY	The smallest Y value of your level (usually 0)
		//@param	MaxX	The largest X value of your level (usually the level width)
		//@param	MaxY	The largest Y value of your level (usually the level height)
		static public function followBounds(MinX:int/*=0*/, MinY:int/*=0*/, MaxX:int/*=0*/, MaxY:int/*=0*/):void
		{
			followMin = new Point(-MinX,-MinY);
			followMax = new Point(-MaxX+width,-MaxY+height);
			if(followMax.x > followMin.x)
				followMax.x = followMin.x;
			if(followMax.y > followMin.y)
				followMax.y = followMin.y;
		}
		
		//@desc		A fairly stupid tween-like function that takes a starting velocity and some other factors and returns an altered velocity
		//@param	Velocity		Any component of velocity (e.g. 20)
		//@param	Acceleration	Rate at which the velocity is changing
		//@param	Drag			Really kind of a deceleration, this is how much the velocity changes if Acceleration is not set
		//@param	Max				An absolute value cap for the velocity
		static public function computeVelocity(velocity:Number, acceleration:Number/*=0*/, drag:Number/*=0*/, max:Number/*=10000*/):Number
		{
			if(acceleration != 0)
				velocity += acceleration*FlxG.elapsed;
			else if(drag != 0)
			{
				var d:Number = drag*FlxG.elapsed;
				if(velocity - d > 0)
					velocity -= d;
				else if(velocity + d < 0)
					velocity += d;
				else
					velocity = 0;
			}
			if((velocity != 0) && (max != 10000))
			{
				if(velocity > max)
					velocity = max;
				else if(velocity < -max)
					velocity = -max;
			}
			return velocity;
		}
		
		//@desc		Checks to see if a FlxCore overlaps any of the FlxCores in the array, and calls a function when they do
		//@param	Array		An array of FlxCore objects
		//@param	Core		A FlxCore object
		//@param	Collide		A function that takes two sprites as parameters (first the one from Array, then Sprite)
		static public function overlapArray(array:FlxArray,Core:FlxCore,Collide:Function):void
		{
			if((Core == null) || !Core.exists || Core.dead) return;
			var c:FlxCore;
			for(var i:uint = 0; i < array.length; i++)
			{
				c = array[i];
				if((c === Core) || (c == null) || !c.exists || c.dead) continue;
				if(c.overlaps(Core)) Collide(c,Core);
			}
		}
		
		//@desc		Checks to see if any FlxCore in Array1 overlaps any FlxCore in Array2, and calls Collide when they do
		//@param	Array1		An array of FlxCore objects
		//@param	Array2		Another array of FlxCore objects
		//@param	Collide		A function that takes two FlxCore objects as parameters (first the one from Array1, then the one from Array2)
		static public function overlapArrays(Array1:FlxArray,Array2:FlxArray,Collide:Function):void
		{
			var i:uint;
			var j:uint;
			var core1:FlxCore;
			var core2:FlxCore;
			if(Array1 === Array2)
			{
				for(i = 0; i < Array1.length; i++)
				{
					core1 = Array1[i];
					if((core1 == null) || !core1.exists || core1.dead) continue;
					for(j = i+1; j < Array2.length; j++)
					{
						core2 = Array2[j];
						if((core2 == null) || !core2.exists || core2.dead) continue;
						if(core1.overlaps(core2)) Collide(core1,core2);
					}
				}
			}
			else
			{
				for(i = 0; i < Array1.length; i++)
				{
					core1 = Array1[i];
					if((core1 == null) || !core1.exists || core1.dead) continue;
					for(j = 0; j < Array2.length; j++)
					{
						core2 = Array2[j];
						if((core1 === core2) || (core2 == null) || !core2.exists || core2.dead) continue;
						if(core1.overlaps(core2)) Collide(core1,core2);
					}
				}
			}
		}
		
		//@desc		Collides a FlxSprite against the FlxCores in the array 
		//@param	Array		An array of FlxCore objects
		//@param	Sprite		A FlxSprite object
		static public function collideArray(Cores:FlxArray,Sprite:FlxSprite):void
		{
			if((Sprite == null) || !Sprite.exists || Sprite.dead) return;
			var core:FlxCore;
			for(var i:uint = 0; i < Cores.length; i++)
			{
				core = Cores[i];
				if((core === Sprite) || (core == null) || !core.exists || core.dead) continue;
				core.collide(Sprite);
			}
		}
		
		//@desc		Collides an array of FlxSprites against a FlxCore object
		//@param	Sprites		An array of FlxSprites
		//@param	Core		A FlxCore object
		static public function collideArray2(Core:FlxCore,Sprites:FlxArray):void
		{
			if((Core == null) || !Core.exists || Core.dead) return;
			var sprite:FlxSprite;
			for(var i:uint = 0; i < Sprites.length; i++)
			{
				sprite = Sprites[i];
				if((Core === sprite) || (sprite == null) || !sprite.exists || sprite.dead) continue;
				Core.collide(sprite);
			}
		}
		
		//@desc		Collides the array of FlxSprites against the array of FlxCores
		//@param	Cores		An array of FlxCore objects
		//@param	Sprites		An array of FlxSprite objects
		static public function collideArrays(Cores:FlxArray,Sprites:FlxArray):void
		{
			var i:uint;
			var j:uint;
			var core:FlxCore;
			var sprite:FlxSprite;
			if(Cores === Sprites)
			{
				for(i = 0; i < Cores.length; i++)
				{
					core = Cores[i];
					if((core == null) || !core.exists || core.dead) continue;
					for(j = i+1; j < Sprites.length; j++)
					{
						sprite = Sprites[j];
						if((sprite == null) || !sprite.exists || sprite.dead) continue;
						core.collide(sprite);
					}
				}
			}
			else
			{
				for(i = 0; i < Cores.length; i++)
				{
					core = Cores[i];
					if((core == null) || !core.exists || core.dead) continue;
					for(j = 0; j < Sprites.length; j++)
					{
						sprite = Sprites[j];
						if((core === sprite) || (sprite == null) || !sprite.exists || sprite.dead) continue;
						core.collide(sprite);
					}
				}
			}
		}
		
		//@desc		Switch from one FlxState to another
		//@param	State		The class name of the state you want (e.g. PlayState)
		static public function switchState(State:Object):void { _switchState(State); }
		
		//@desc		Log data to the developer console
		//@param	Data		The data (in string format) that you wanted to write to the console
		static public function log(Data:String):void { _log(Data); }
		
		//@desc		Shake the screen
		//@param	Intensity	Percentage of screen size representing the maximum distance that the screen can move during the 'quake'
		//@param	Duration	The length in seconds that the "quake" should last
		static public function quake(Intensity:Number,Duration:Number/*=0.5*/):void { _quake(Intensity,Duration); }
		
		//@desc		Temporarily fill the screen with a certain color, then fade it out
		//@param	Color			The color you want to use
		//@param	Duration		How long it takes for the flash to fade
		//@param	FlashComplete	A function you want to run when the flash finishes
		//@param	Force			Force the effect to reset
		static public function flash(Color:long):void { _flash(Color,1,null,false); }
		static public function flash(Color:long, Duration:Number):void { _flash(Color,Duration,null,false); }
		static public function flash(Color:long, Duration:Number/*=1*/, FlashComplete:Function/*=null*/, Force:boolean/*=false*/):void { _flash(Color,Duration,FlashComplete,Force); }
		
		//@desc		Fade the screen out to this color
		//@param	Color			The color you want to use
		//@param	Duration		How long it should take to fade the screen out
		//@param	FadeComplete	A function you want to run when the fade finishes
		//@param	Force			Force the effect to reset
		static public function fade(Color:long, Duration:Number/*=1*/, FadeComplete:Function/*=null*/):void { _fade(Color,Duration,FadeComplete,false); }
		static public function fade(Color:long, Duration:Number/*=1*/, FadeComplete:Function/*=null*/, Force:boolean/*=false*/):void { _fade(Color,Duration,FadeComplete,Force); }
		
		//@desc		Set the mouse cursor to some graphic file
		//@param	CursorGraphic	The image you want to use for the cursor
		static public function setCursor(CursorGraphic:Texture2D):void { _setCursor(CursorGraphic); }
		
		//@desc		Switch to a different web page
		static public function openURL(URL:String):void
		{
			//navigateToURL(new URLRequest(URL));
		}

		//@desc		This function is only used by the FlxGame class to do important internal management stuff
		static internal function setGameData(Width:uint,Height:uint,SwitchState:Function,Log:Function,Quake:Function,Flash:Function,Fade:Function,SetCursor:Function):void
		{
			_cache = new Hashtable();
            atlas = new Texture2D(1024, 1024, TextureFormat.ARGB32, false);
			//atlas = new Texture2D(512, 512, TextureFormat.ARGB32, false);
			atlas.filterMode = FilterMode.Point;
			var x:uint;
			var y:uint;
			var c:Color = new Color(1,0,0,1);
			for(y=0; y<atlas.height; y++) for(x=0; x<atlas.width; x++) atlas.SetPixel(x,y,c);
			atlas.Apply();
			atlasSpot = new Point(0,0);
			SpriteManager.material.mainTexture = atlas;
			width = Width;
			height = Height;
			_muted = 1.0;
			_volume = 1.0;
			_musicVolume = 1.0;
			_masterVolume = 0.5;
			_musicPosition = -1;
			mouse = new Point();
			_switchState = SwitchState;
			_log = Log;
			_quake = Quake;
			_flash = Flash;
			_fade = Fade;
			_setCursor = SetCursor;
			unfollow();
			_keys = new Array();
			_oldKeys = new Array();
			for(var i:uint = 0; i < 7; i++)
			{
				_keys.push(0);
				_oldKeys.push(0);
			}
			FlxG.levels = new FlxArray();
			FlxG.scores = new FlxArray();
			level = 0;
			score = 0;
		}
		
		//@desc		This function is only used by the FlxGame class to do important internal management stuff
		static internal function setMasterVolume(Volume:Number):void { _masterVolume = Volume; adjustMusicVolume(); }
		
		//@desc		This function is only used by the FlxGame class to do important internal management stuff
		static internal function getMasterVolume():Number { return _masterVolume; }
		
		//@desc		This function is only used by the FlxGame class to do important internal management stuff
		static internal function doFollow():void
		{
			if(followTarget != null)
			{
				if(followTarget.exists && !followTarget.dead)
				{
					_scrollTarget.x = (width>>1)-followTarget.x-(followTarget.width>>1);
					_scrollTarget.y = (height>>1)-followTarget.y-(followTarget.height>>1);
					if((followLead != null) && (followTarget instanceof FlxSprite))
					{
						_scrollTarget.x -= (followTarget as FlxSprite).velocity.x*followLead.x;
						_scrollTarget.y -= (followTarget as FlxSprite).velocity.y*followLead.y;
					}
				}
				scroll.x += (_scrollTarget.x-scroll.x)*followLerp*FlxG.elapsed;
				scroll.y += (_scrollTarget.y-scroll.y)*followLerp*FlxG.elapsed;
				
				if(followMin != null)
				{
					if(scroll.x > followMin.x)
						scroll.x = followMin.x;
					if(scroll.y > followMin.y)
						scroll.y = followMin.y;
				}
				
				if(followMax != null)
				{
					if(scroll.x < followMax.x)
						scroll.x = followMax.x;
					if(scroll.y < followMax.y)
						scroll.y = followMax.y;
				}
			}
		}
		
		//@desc		This function is only used by the FlxGame class to do important internal management stuff
		static internal function unfollow():void
		{
			followTarget = null;
			followLead = null;
			followLerp = 1;
			followMin = null;
			followMax = null;
			scroll = new Point();
			_scrollTarget = new Point();
		}
		
		//@desc		This function is only used by the FlxGame class to do important internal management stuff
		static internal function pressKey(k:uint):void
		{
		    //log("pressKey "+k);
			var x:Number = _keys[k];
			if(x > 0)
				_keys[k] = 1;
			else
				_keys[k] = 2;
			switch(k) {
			    case A: kA = true; break;
			    case B: kB = true; break;
			    case UP: kUp = true; break;
			    case DOWN: kDown = true; break;
			    case LEFT: kLeft = true; break;
			    case RIGHT: kRight = true; break;
		    }
		}
		
		//@desc		This function is only used by the FlxGame class to do important internal management stuff
		static internal function releaseKey(k:uint):void
		{
		    //log("releaseKey "+k);
			var x:Number = _keys[k];
			if(x > 0)
				_keys[k] = -1;
			else
				_keys[k] = 0;
			switch(k) {
			    case A: kA = false; break;
			    case B: kB = false; break;
			    case UP: kUp = false; break;
			    case DOWN: kDown = false; break;
			    case LEFT: kLeft = false; break;
			    case RIGHT: kRight = false; break;
		    }
		}
		
		//@desc		This function is only used by the FlxGame class to do important internal management stuff
		static internal function updateKeys():void
		{
			for(var i:uint = 0; i < 7; i++)
			{
				var old:Number = _oldKeys[i];
				var x:Number = _keys[i];
				if((old == -1) && (x == -1))
					_keys[i] = 0;
				else if((old == 2) && (x == 2))
					_keys[i] = 1;
				_oldKeys[i] = _keys[i];
			}
//			mouse.x = state.mouseX-scroll.x;
//			mouse.y = state.mouseY-scroll.y;
		}
	}
//}
