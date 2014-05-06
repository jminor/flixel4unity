#pragma strict
#pragma implicit
#pragma downcast

class Point
{
	var x:float;
	var y:float;
	function Point() {
		x = 0;
		y = 0;
	}
	function Point(ax:float, ay:float) {
		x = ax;
		y = ay;
	}
}