#pragma strict
#pragma implicit
#pragma downcast

/*package com.adamatomic.Mode
{
	import com.adamatomic.flixel.*;
*/
//	public 
class BotBullet extends FlxSprite
	{
//		[Embed(source="../../../data/bot_bullet.png")] 
static public var ImgBullet:Texture2D;
//		[Embed(source="../../../data/jump.mp3")] 
static public var SndHit:AudioClip;
//		[Embed(source="../../../data/enemy.mp3")] 
static public var SndShoot:AudioClip;
		
		public function BotBullet()
		{
			super(ImgBullet,0,0,true);
			addAnimation("idle",[0, 1], 50);
			addAnimation("poof",[2, 3, 4], 50, false);
			exists = false;
			
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
			FlxG.play(SndShoot,0.5);
			x = X;
			y = Y;
			velocity.x = VelocityX;
			velocity.y = VelocityY;
			play("idle");
			dead = false;
			exists = true;
			visible = true;
		}
	}
//}