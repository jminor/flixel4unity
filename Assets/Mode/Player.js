#pragma strict
#pragma implicit
#pragma downcast

//package com.adamatomic.Mode
//{
//	import com.adamatomic.flixel.*;
//
//	public 
class Player extends FlxSprite
	{
//		[Embed(source="../../../data/spaceman.png")] 
        static public var ImgSpaceman:Texture2D;
//		[Embed(source="../../../data/gibs.png")] 
        static public var ImgGibs:Texture2D;
//		[Embed(source="../../../data/jump.mp3")] 
        static public var SndJump:AudioClip;
//		[Embed(source="../../../data/land.mp3")] 
        static public var SndLand:AudioClip;
//		[Embed(source="../../../data/asplode.mp3")] 
        static public var SndExplode:AudioClip;
//		[Embed(source="../../../data/menu_hit_2.mp3")] 
        static public var SndExplode2:AudioClip;
//		[Embed(source="../../../data/hurt.mp3")] 
        static public var SndHurt:AudioClip;
//		[Embed(source="../../../data/jam.mp3")] 
        static public var SndJam:AudioClip;
//		
//		//jetpack
//		[Embed(source="../../../data/jet.png")] 
        static public var ImgJet:Texture2D;

        
		private var _jumpPower:int;
		private var _bullets:FlxArray;
		private var _curBullet:uint;
		private var _bulletVel:int;
		private var _up:boolean;
		private var _down:boolean;
		private var _restart:Number;
		private var _gibs:FlxEmitter;
		
		//jetpack
		private var _boosters:boolean;
        private var _fuel:int;
        private var _jets:FlxEmitter;
        
		
		public function Player(X:int,Y:int,Bullets:FlxArray)
		{
			super(ImgSpaceman,X,Y,true,true);
			_restart = 0;
			
			//bounding box tweaks
			width = 6;
			height = 7;
			offset.x = 1;
			offset.y = 1;
			
			//basic player physics
			var runSpeed:uint = 80;
			drag.x = runSpeed*8;
			acceleration.y = 420;
			_jumpPower = 200;
			maxVelocity.x = runSpeed;
			maxVelocity.y = _jumpPower;
			
			//animations
			addAnimation("idle", [0]);
			addAnimation("run", [1, 2, 3, 0], 12);
			addAnimation("jump", [4]);
			addAnimation("idle_up", [5]);
			addAnimation("run_up", [6, 7, 8, 5], 12);
			addAnimation("jump_up", [9]);
			addAnimation("jump_down", [10]);
			
			//bullet stuff
			_bullets = Bullets;
			_curBullet = 0;
			_bulletVel = 360;
			
			_gibs = FlxG.state.add(new FlxEmitter(0,0,0,0,null,-1.5,-150,150,-200,0,-720,720,400,0,ImgGibs,10,true,null)) as FlxEmitter;
			
			//jetpack
			_fuel = 5000;
            _jets = FlxG.state.add(new FlxEmitter(0,0,0,0,null,0.01,-10,10,20,50,0,0,0,0,ImgJet,10,false,null)) as FlxEmitter;
            _jets.kill();
            
            //_sprite.SetColor(new Color(0,1,0,1));
		}
				
		/*override*/ public function update():void
		{
			//game restart timer
			if(dead)
			{
				_restart += FlxG.elapsed;
				if(_restart > 2)
					FlxG.switchState(PlayState);
				return;
			}
			
			//MOVEMENT
			acceleration.x = 0;
			if(FlxG.kLeft)
			{
				facing = LEFT;
				acceleration.x -= drag.x;
			}
			else if(FlxG.kRight)
			{
				facing = RIGHT;
				acceleration.x += drag.x;
			}
			if(FlxG.justPressed(FlxG.A) && !velocity.y)
			{
			    //FlxG.log("JUMP");
				velocity.y = -_jumpPower;
//				FlxG.play(SndJump);
			}
			
			//AIMING
			_up = false;
			_down = false;
			if(FlxG.kUp) _up = true;
			else if(FlxG.kDown && velocity.y) _down = true;
			
			//ANIMATION
			if(velocity.y != 0)
			{
				if(_up) play("jump_up");
				else if(_down) play("jump_down");
				else play("jump");
			}
			else if(velocity.x == 0)
			{
				if(_up) play("idle_up");
				else play("idle");
			}
			else
			{
				if(_up) play("run_up");
				else play("run");
			}
				
			//UPDATE POSITION AND ANIMATION
			super.update();
			
			//SHOOTING
			if(flickering())
			{
//				if(FlxG.justPressed(FlxG.B))
//					FlxG.play(SndJam);
				return;
			}else
			if(FlxG.justPressed(FlxG.B))
			{
			    //FlxG.log("SHOOT");
			    var curBullet:Bullet = _bullets[_curBullet];
				var bXVel:int = 0;
				var bYVel:int = 0;
				var bX:int = x;
				var bY:int = y;
				if(_up)
				{
					bY -= curBullet.height - 4;
					bYVel = -_bulletVel;
				}
				else if(_down)
				{
					bY += height - 4;
					bYVel = _bulletVel;
					velocity.y -= 36;
				}
				else if(facing == RIGHT)
				{
					bX += width - 4;
					bXVel = _bulletVel;
				}
				else
				{
					bX -= curBullet.width - 4;
					bXVel = -_bulletVel;
				}
				curBullet.shoot(bX,bY,bXVel,bYVel);
				if(++_curBullet >= _bullets.length)
					_curBullet = 0;
			}
			
			//jetpack
			if(FlxG.kA && (velocity.y >= -40 && velocity.y <= 20))
            {
            	_boosters = true;
            	_jets.reset();
            }
            if(_boosters && !FlxG.kA)
            {
            	_boosters = false;
            	_jets.kill();
            }
            if(_boosters && _fuel>0)
            {
            	velocity.y = -70;
            	_fuel += -10;
            	_jets.y = this.y;
            	_jets.x = this.x + 3;
            }
            if(!_boosters && _fuel<5000)
            {
            	_fuel += 20;
            }
            
		}
		
		/*override*/ public function hitFloor():boolean
		{
//			if(velocity.y > 50)
//				FlxG.play(SndLand);
			return super.hitFloor();
		}
		
		/*override*/ public function hurt(Damage:Number):void
		{
			Damage = 0;
			if(flickering())
				return;
//			FlxG.play(SndHurt);
			flicker(1.3);
			if(FlxG.score > 1000) FlxG.score -= 1000;
			if(velocity.x > 0)
				velocity.x = -maxVelocity.x;
			else
				velocity.x = maxVelocity.x;
			super.hurt(Damage);
		}
		
		/*override*/ public function kill():void
		{
			if(dead)
				return;
//			FlxG.play(SndExplode);
//			FlxG.play(SndExplode2);
			super.kill();
			flicker(-1);
			exists = true;
			visible = false;
			FlxG.quake(0.005,0.35);
			FlxG.flash(0xffd8eba2,0.35);
			_gibs.x = x + width/2;
			_gibs.y = y + height/2;
			_gibs.reset();
		}
	}
//}