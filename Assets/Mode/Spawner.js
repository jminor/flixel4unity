#pragma strict
#pragma implicit
#pragma downcast

//package com.adamatomic.Mode
//{
//	import com.adamatomic.flixel.*;
//
//	public 
class Spawner extends FlxSprite
	{
//		[Embed(source="../../../data/spawner.png")] 
static public var ImgSpawner:Texture2D;
//		[Embed(source="../../../data/spawner_gibs.png")] 
static public var ImgSpawnerGibs:Texture2D;
//		[Embed(source="../../../data/asplode.mp3")] 
static public var SndExplode:AudioClip;
//		[Embed(source="../../../data/menu_hit_2.mp3")] 
static public var SndExplode2:AudioClip;
//		[Embed(source="../../../data/hit.mp3")] 
static public var SndHit:AudioClip;
		
		private var _timer:Number;
		private var _b:FlxArray;
		private var _b2:FlxArray;
		private var _gibs:FlxEmitter;
		private var _p:FlxSprite;
		
		public function Spawner(X:int, Y:int,Bots:FlxArray,BotBullets:FlxArray,ThePlayer:FlxSprite)
		{
			super(ImgSpawner, X, Y, true, false);
			_b = Bots;
			_b2 = BotBullets;
			_p = ThePlayer;
			_timer = Random.value*20;
			health = 8;

			addAnimation("open", [1, 2, 3, 4, 5], 40, false);
			addAnimation("close", [5, 4, 3, 2, 1, 0], 40, false);
			addAnimation("dead", [6]);
			
			//_sprite.SetColor(new Color(1,1,0,1));
            
		}
		
		/*override*/ public function update():void
		{
			if(dead)
				return;
				
			_timer += FlxG.elapsed;
			var limit:uint = 20;
			if(onScreen())
				limit = 2;
			if(_timer > limit)
			{
				_timer = 0;
				makeBot();
			}
			else if(_timer > limit - 0.35)
				play("open");
			else if(_timer > 1)
				play("close");
				
			super.update();
		}
		
		/*override*/ public function hurt(Damage:Number):void
		{
			FlxG.play(SndHit);
			flicker(0.2);
			FlxG.score += 50;
			super.hurt(Damage);
		}
		
		/*override*/ public function kill():void
		{
			if(dead)
				return;
			FlxG.play(SndExplode);
			FlxG.play(SndExplode2);
			super.kill();
			exists = true;
			flicker(-1);
			play("dead");
			FlxG.quake(0.005,0.35);
			FlxG.flash(0xffd8eba2,0.35);
			makeBot();
			_gibs = FlxG.state.add(new FlxEmitter(x+width/2,y+height/2,0,0,null,-2,-200,200,-300,0,-720,720,400,0,ImgSpawnerGibs,50,true,null)) as FlxEmitter;
			_gibs.reset();
			FlxG.score += 1000;
		}
		
		private function makeBot():void
		{
			var b:Bot;
			//try to recycle a dead bot
			for(var i:uint = 0; i < _b.length; i++) {
				b = _b[i];
				if(!b.exists)
				{
					b.reset(x + width/2 - b.width/2, y + width/2 - b.height/2);
					return;
				} 
			}
			
			//no more than 10 bots per spawner at once
			if (_b.length > 10) return;
			
			//if that fails just make a new one
			b = new Bot(x + width/2, y + width/2,_b2,_p);
			b.x -= b.width/2;
			b.y -= b.height/2;
			_b.add(FlxG.state.add(b));
		}
	}
//}