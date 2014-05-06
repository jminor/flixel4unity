#pragma strict
#pragma implicit
#pragma downcast

//	[SWF(width="640", height="480", backgroundColor="#000000")]
//	[Frame(factoryClass="Preloader")]

 class Mode extends FlxGame
	{
		public var ImgSpaceman:Texture2D;
		public var ImgGibs:Texture2D;
		public var ImgJet:Texture2D;
		
		public var ImgTech:Texture2D;
		public var ImgDirtTop:Texture2D;
		public var ImgDirt:Texture2D;
		public var ImgNotch:Texture2D;
		
		public var ImgBot:Texture2D;
        //public var ImgGibs:Texture2D;
        //public var ImgJet:Texture2D;
        
        public var ImgBullet:Texture2D;
        public var ImgBotBullet:Texture2D;
        
        //public var ImgTiles:Texture2D;
        
        public var ImgSpawner:Texture2D;
        public var ImgSpawnerGibs:Texture2D;
        
		public var SpriteManager:SpriteManager;
		
		public function Mode()
		{
		}
		
		public function Start()
		{
			Player.ImgSpaceman = ImgSpaceman;
			Player.ImgGibs = ImgGibs;
			Player.ImgJet = ImgJet;
			
			PlayState.ImgTech = ImgTech;
			PlayState.ImgDirtTop = ImgDirtTop;
			PlayState.ImgDirt = ImgDirt;
			PlayState.ImgNotch = ImgNotch;

    		Bot.ImgBot = ImgBot;
            Bot.ImgGibs = ImgGibs;
            Bot.ImgJet = ImgJet;

            Bullet.ImgBullet = ImgBullet;
            BotBullet.ImgBullet = ImgBotBullet;

            //PlayStateTiles.ImgTiles = ImgTiles;

            Spawner.ImgSpawner = ImgSpawner;
            Spawner.ImgSpawnerGibs = ImgSpawnerGibs;
			
			FlxG.SpriteManager = SpriteManager;
			
			//super(320,240,MenuState,2,0xff131c1b,true,0xff729954,null,null,0,0);
			//init(480,320,
		    init(240,160,
                //MenuState,
                PlayState,
                2,0xff131c1b,true,0xff729954,null,null,0,0);
			help("Jump", "Shoot", "Nothing", null);
		}
	}
//}
