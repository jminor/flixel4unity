#pragma strict
#pragma implicit
#pragma downcast

//package com.adamatomic.Mode
//{
//	import com.adamatomic.flixel.*;
//
//	public 
	class Bullet extends FlxSprite
	{
//		[Embed(source="../../../data/bullet.png")] 
static public var ImgBullet:Texture2D;
//		[Embed(source="../../../data/jump.mp3")] 
static public var SndHit:AudioClip;
//		[Embed(source="../../../data/shoot.mp3")] 
static public var SndShoot:AudioClip;
		
		public function Bullet()
		{
			super(ImgBullet,0,0,true);
			width = 6;
			height = 6;
			offset.x = 1;
			offset.y = 1;
			exists = false;
			
			addAnimation("up",[0]);
			addAnimation("down",[1]);
			addAnimation("left",[2]);
			addAnimation("right",[3]);
			addAnimation("poof",[4, 5, 6, 7], 50, false);
			
			//_sprite.SetColor(new Color(1,0,0,1));
            
		}
				
		/*override*/ public function update():void
		{
			if(dead && finished) exists = false;
			else super.update();
		}
		
		/*override*/ public function hitWall():boolean { hurt(0); return true; }
		/*override*/ public function hitFloor():boolean { hurt(0); return true; }
		/*override*/ public function hitCeiling():boolean { hurt(0); return true; }
		/*override*/ public function hurt(Damage:Number):void
		{
			if(dead) return;
			velocity.x = 0;
			velocity.y = 0;
			if(onScreen()) FlxG.play(SndHit);
			dead = true;
			play("poof");
		}
		
		public function shoot(X:int, Y:int, VelocityX:int, VelocityY:int):void
		{
			FlxG.play(SndShoot);
			x = X;
			y = Y;
			velocity.x = VelocityX;
			velocity.y = VelocityY;
			if(velocity.y < 0)
				play("up");
			else if(velocity.y > 0)
				play("down");
			else if(velocity.x < 0)
				play("left");
			else if(velocity.x > 0)
				play("right");
			dead = false;
			exists = true;
			visible = true;
		}
	}
//}