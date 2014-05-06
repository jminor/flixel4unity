#pragma strict
#pragma implicit
#pragma downcast

//package com.adamatomic.flixel
//{
	//@desc		This is an organizational class that can update and render a bunch of FlxCore objects
//	public
	 class FlxLayer extends FlxCore
	{
		private var _children:FlxArray;

		//@desc		Constructor		
		public function FlxLayer()
		{
			_children = new FlxArray();
		}
		
		//@desc		Adds a new FlxCore subclass (FlxSprite, FlxBlock, etc) to the list of children
		//@param	Core	The object you want to add
		 public function add(Core:FlxCore):FlxCore
		{
			return _children.add(Core) as FlxCore;
		}
		
		//@desc		Automatically goes through and calls update on everything you added, override this function to handle custom input and perform collisions
		/*override*/ public function update():void
		{
			super.update();
			for(var i:uint = 0; i < _children.length; i++) {
				var child:FlxCore = _children[i];
				if((child != null) && child.exists && child.active) child.update();
			}
		}
		
		//@desc		Automatically goes through and calls render on everything you added, override this loop to do crazy graphical stuffs I guess?
		/*override*/ public function render():void
		{
			super.render();
			for(var i:uint = 0; i < _children.length; i++) {
				var child:FlxCore = _children[i];
				if((child != null) && child.exists && child.visible) child.render();
			}
		}
		
		//@desc		Override this function to handle any deleting or "shutdown" type operations you might need (such as removing traditional Flash children like Sprite objects)
		public function destroy():void { _children.clear(); }
	}
//}
