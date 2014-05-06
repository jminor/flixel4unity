#pragma strict
#pragma implicit
#pragma downcast

//package com.adamatomic.Mode
//{
//	import com.adamatomic.flixel.*;
//
//	public
class PlayState extends FlxState
	{
//		[Embed(source="../../../data/tech_tiles.png")] 
static public var ImgTech:Texture2D;
//		[Embed(source="../../../data/dirt_top.png")] 
static public var ImgDirtTop:Texture2D;
//		[Embed(source="../../../data/dirt.png")] 
static public var ImgDirt:Texture2D;
//		[Embed(source="../../../data/notch.png")] 
static public var ImgNotch:Texture2D;
//		[Embed(source="../../../data/mode.mp3")] 
static public var SndMode:AudioClip;
//		[Embed(source="../../../data/countdown.mp3")] 
static public var SndCount:AudioClip;

		//major game objects
		private var _blocks:FlxArray;
		private var _blocks2:FlxCore[];
		private var _bullets:FlxArray;
		private var _bullets2:FlxSprite[];
		private var _player:Player;
		private var _bots:FlxArray;
		private var _bots2:FlxSprite[];
		private var _spawners:FlxArray;
		private var _botBullets:FlxArray;
		private var _botBullets2:FlxSprite[];

		//HUD
		private var _score:FlxText;
		private var _scoreShadow:FlxText;
		private var _score2:FlxText;
		private var _score2Shadow:FlxText;
		private var _scoreTimer:Number;
		private var _jamTimer:Number;
		private var _jamBar:FlxSprite;
		private var _jamText:FlxText;
		private var _notches:FlxArray;

		//just to prevent weirdness during level transition
		private var _fading:boolean;

		function PlayState()
		{
			super();

            var scale:uint = 1;

			//create basic objects
			_bullets = new FlxArray();
			_player = new Player(316/scale,300/scale,_bullets);
			_botBullets = new FlxArray();
			_bots = new FlxArray();
			_spawners = new FlxArray();

			//create level
			var i:uint;
			var r:uint = 160;
			_blocks = new FlxArray();
            // _blocks.add(this.add(new FlxBlock(0,0,640,16,ImgTech)));
            // _blocks.add(this.add(new FlxBlock(0,16,16,640-16,ImgTech)));
            // _blocks.add(this.add(new FlxBlock(640-16,16,16,640-16,ImgTech)));
            // _blocks.add(this.add(new FlxBlock(16,640-24,640-32,8,ImgDirtTop)));
            // _blocks.add(this.add(new FlxBlock(16,640-16,640-32,16,ImgDirt)));
            
            var levelSize:uint = 640/scale;
            r = 160/scale;
            
            _blocks.add(new FlxBlock(0,0,levelSize,16,ImgTech));
            _blocks.add(new FlxBlock(0,16,16,levelSize-16,ImgTech));
            _blocks.add(new FlxBlock(levelSize-16,16,16,levelSize-16,ImgTech));
            _blocks.add(new FlxBlock(16,levelSize-24,levelSize-32,8,ImgDirtTop));
            _blocks.add(new FlxBlock(16,levelSize-16,levelSize-32,16,ImgDirt));
            buildRoom(r*0,r*0,true);
            buildRoom(r*1,r*0);
            buildRoom(r*2,r*0);
            buildRoom(r*3,r*0,true);
            buildRoom(r*0,r*1,true);
            buildRoom(r*1,r*1);
            buildRoom(r*2,r*1);
            buildRoom(r*3,r*1,true);
            buildRoom(r*0,r*2);
            buildRoom(r*1,r*2);
            buildRoom(r*2,r*2);
            buildRoom(r*3,r*2);
            buildRoom(r*0,r*3,true);
            buildRoom(r*1,r*3);
            buildRoom(r*2,r*3);
            buildRoom(r*3,r*3,true);
            
            // turn the blocks into a megasprite
            this.add(new MegaSprite(_blocks,levelSize,levelSize));

			//create bullets
            for(i = 0; i < 50; i++)
             _botBullets.add(this.add(new BotBullet()));
            for(i = 0; i < 8; i++)
             _bullets.add(this.add(new Bullet()));

			//camera settings
			this.add(_player);
			FlxG.follow(_player,2.5);
			FlxG.followAdjust(0.5,0.0);
			FlxG.followBounds(0,0,levelSize,levelSize);

			//HUD - score
            _score = new FlxText(0,0,FlxG.width,40,null,0xd8eba2,null,16,"center");
            _score.scrollFactor.x = _score.scrollFactor.y = 0;
            _scoreShadow = this.add(new FlxText(_score.x+2,_score.y+2,_score.width,_score.height,null,0x131c1b,null,16,"center")) as FlxText;
            _scoreShadow.scrollFactor.x = _scoreShadow.scrollFactor.y = 0;
            this.add(_score);
			if(FlxG.scores.length < 2)
			{
				FlxG.scores.push(0);
				FlxG.scores.push(0);
			}

			//HUD - highest and last scores
            _score2 = new FlxText(FlxG.width/2,0,FlxG.width/2,40,null,0xd8eba2,null,8,"right");
            _score2.scrollFactor.x = _score2.scrollFactor.y = 0;
            _score2Shadow = this.add(new FlxText(_score2.x+1,_score2.y+1,_score2.width,_score2.height,null,0x131c1b,null,8,"right")) as FlxText;
            _score2Shadow.scrollFactor.x = _score2Shadow.scrollFactor.y = 0;
            this.add(_score2);
            var highscore:uint = FlxG.scores[0];
            if(FlxG.score > highscore) {
                FlxG.scores[0] = FlxG.score;
                highscore = FlxG.score;
            }
            if(highscore != 0)
            {
                _score2.setText("HIGHEST: "+highscore+"\nLAST: "+FlxG.score);
                _score2Shadow.setText("HIGHEST: "+highscore+"\nLAST: "+FlxG.score);
            }
			FlxG.score = 0;
			_scoreTimer = 0;

			//HUD - the "number of spawns left" icons
			_notches = new FlxArray();
			var tmp:FlxSprite;
            for(i = 0; i < 6; i++)
            {
             tmp = new FlxSprite(ImgNotch,4+i*10,4,true,false);
             tmp.scrollFactor.x = tmp.scrollFactor.y = 0;
             tmp.addAnimation("on",[0]);
             tmp.addAnimation("off",[1]);
             tmp.play("on");
             _notches.add(this.add(tmp));
            }

			//HUD - the "gun jammed" notification
            // _jamBar = this.add(new FlxSprite(null,0,FlxG.height-22,false,false,FlxG.width,24,0xff131c1b)) as FlxSprite;
            // _jamBar.scrollFactor.x = _jamBar.scrollFactor.y = 0;
            // _jamBar.visible = false;
            //             _jamText = this.add(new FlxText(0,FlxG.height-22,FlxG.width,20,"GUN IS JAMMED",0xd8eba2,null,16,"center")) as FlxText;
            //             _jamText.scrollFactor.x = _jamText.scrollFactor.y = 0;
            //             _jamText.visible = false;

			FlxG.setMusic(SndMode);
			FlxG.flash(0xff131c1b);
			_fading = false;
			
			// Snapshot these arrays into fixed size builtin arrays for speed
			_blocks2 = _blocks.ToBuiltin(FlxCore);
			_bullets2 = _bullets.ToBuiltin(FlxSprite);
			_bots2 = _bots.ToBuiltin(FlxSprite);
			_botBullets2 = _botBullets.ToBuiltin(FlxSprite);
			
            // debugArray("_blocks2", _blocks2);
            // debugArray("_bullets2", _bullets2);
            // debugArray("_bots2", _bots2);
            // debugArray("_botBullets2", _botBullets2);
		}

        public function debugArray(desc:String, arr:Object[]) {
            Debug.Log(desc+"["+arr.Length+"]");
            for(i=0; i<arr.Length; i++) {
                Debug.Log(i+": " + arr[i]);
            }
        }

		/*override*/ public function update():void
		{
			var os:uint = FlxG.score;

            // ~5-10ms
            super.update();
			
			// ~10ms
            
            // this is the only array that updates dynamically
			_bots2 = _bots.ToBuiltin(FlxSprite);

			//collisions with environment
            FlxG.collideBuiltinArrays(_blocks2,_bullets2);
            FlxG.collideBuiltinArrays(_blocks2,_botBullets2);
            FlxG.collideBuiltinArrays(_blocks2,_bots2);
            FlxG.collideBuiltinArray(_blocks2,_player);
            
            //don't let bots overlap
            FlxG.collideBuiltinArrays(_bots2,_bots2);
            
            //collisions between sprites
            FlxG.overlapArrays(_bullets,_bots,bulletHitBot);
            FlxG.overlapArrays(_bullets,_spawners,bulletHitBot);
            FlxG.overlapArray(_bots,_player,botHitPlayer);
            FlxG.overlapArray(_spawners,_player,botHitPlayer);
            FlxG.overlapArray(_botBullets,_player,bulletHitBot);

			//Jammed message
			if(FlxG.justPressed(FlxG.B) && _player.flickering())
			{
				_jamTimer = 1;
                // _jamBar.visible = true;
                // _jamText.visible = true;
			}
			if(_jamTimer > 0)
			{
				if(!_player.flickering()) _jamTimer = 0;
				_jamTimer -= FlxG.elapsed;
				if(_jamTimer < 0)
				{
                    // _jamBar.visible = false;
                    // _jamText.visible = false;
				}
			}

			if(!_fading)
			{
				//Score + countdown stuffs
				if(os != FlxG.score) _scoreTimer = 2;
				_scoreTimer -= FlxG.elapsed;
				if(_scoreTimer < 0)
				{
					if(FlxG.score > 0)
					{
						FlxG.play(SndCount);
						if(FlxG.score > 100) FlxG.score -= 100;
						else { FlxG.score = 0; } //_player.kill(); }
						_scoreTimer = 1;
						if(FlxG.score < 600)
							FlxG.play(SndCount);
						if(FlxG.score < 500)
							FlxG.play(SndCount);
						if(FlxG.score < 400)
							FlxG.play(SndCount);
						if(FlxG.score < 300)
							FlxG.play(SndCount);
						if(FlxG.score < 200)
							FlxG.play(SndCount);
					}
				}

				//Fade out to victory screen stuffs
				var i:uint;
				var found:uint = 0;
                for(i = 0; i < _spawners.length; i++)
                    if(!(_spawners[i] as Spawner).dead) found++;
				if(found == 0)
				{
					_fading = true;
					FlxG.fade(0xffd8eba2,3,onVictory);
				}
				else
				{
					for(i = 0; i < _notches.length; i++)
					{
                        if(i < found)
                            (_notches[i] as FlxSprite).play("on");
                        else
                            (_notches[i] as FlxSprite).play("off");
					}
				}
			}

			//actually update score text if it changed
			if(os != FlxG.score)
			{
				if(_player.dead) FlxG.score = 0;
                _score.setText(FlxG.score.ToString());
                _scoreShadow.setText(FlxG.score.ToString());
			}
		}

		private function bulletHitBot(Bullet:FlxSprite,Bot:FlxSprite):void
		{
			Bullet.hurt(0);
			Bot.hurt(1);
		}

		private function botHitPlayer(Bot:FlxSprite,Player:FlxSprite):void
		{
			Player.hurt(1);
		}

		private function onVictory():void
		{
			FlxG.stopMusic();
			FlxG.switchState(VictoryState);
		}

		//Just plops down a spawner and some blocks - haphazard and crappy atm but functional!
		private function buildRoom(RX:uint,RY:uint):void { buildRoom(RX,RY,false); }
		private function buildRoom(RX:uint,RY:uint,Spawners:boolean/*=false*/):void
		{
			//first place the spawn point (if necessary)
			var rw:uint = 20;
			var sx:uint;
			var sy:uint;
			if(Spawners)
			{
				sx = 2+Random.value*(rw-7);
				sy = 2+Random.value*(rw-7);
			}

			//then place a bunch of blocks
			var numBlocks:uint = 3+Random.value*4/2;
			if(!Spawners) numBlocks++;
			var maxW:uint = 10;
			var minW:uint = 2;
			var maxH:uint = 8;
			var minH:uint = 1;
			var bx:uint;
			var by:uint;
			var bw:uint;
			var bh:uint;
			var check:boolean;
			for(var i:uint = 0; i < numBlocks; i++)
			{
				check = false;
				while(true) {
					//keep generating different specs if they overlap the spawner
					bw = minW + Random.value*(maxW-minW);
					bh = minH + Random.value*(maxH-minH);
					bx = -1 + Random.value*(rw+1-bw);
					by = -1 + Random.value*(rw+1-bh);
					if(Spawners)
						check = ((sx>bx+bw) || (sx+3<bx) || (sy>by+bh) || (sy+3<by));
					else
						check = true;
					if (check) break;
				}
                // _blocks.add(this.add(new FlxBlock(RX+bx*8,RY+by*8,bw*8,bh*8,ImgTech)));
				_blocks.add(new FlxBlock(RX+bx*8,RY+by*8,bw*8,bh*8,ImgTech));

				//If the block has room, add some non-colliding "dirt" graphics for variety
				if((bw >= 4) && (bh >= 5))
				{
                    // this.add(new FlxBlock(RX+bx*8+8,RY+by*8,bw*8-16,8,ImgDirtTop));
                    // this.add(new FlxBlock(RX+bx*8+8,RY+by*8+8,bw*8-16,bh*8-24,ImgDirt));
                    _blocks.add(new FlxBlock(RX+bx*8+8,RY+by*8,bw*8-16,8,ImgDirtTop));
                    _blocks.add(new FlxBlock(RX+bx*8+8,RY+by*8+8,bw*8-16,bh*8-24,ImgDirt));
				}
			}

			//Finally actually add the spawner
            if(Spawners)
             _spawners.add(this.add(new Spawner(RX+sx*8,RY+sy*8,_bots,_botBullets,_player)));
		}
	}
//}
