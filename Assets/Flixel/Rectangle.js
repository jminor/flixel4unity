#pragma strict
#pragma implicit
#pragma downcast

class Rectangle
{
    public var x:uint;
    public var y:uint;
    public var width:uint;
    public var height:uint;
    
	public function Rectangle(a:Number, b:Number, c:Number, d:Number) {
		x = a;
		y = b;
		width = c;
		height = d;
	}
}