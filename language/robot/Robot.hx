package language.robot;

using language.robot.SListMethods;

enum Direction {
	North;
	NorthEast;
	East;
	SouthEast;
	South;
	SouthWest;
	West;
	NorthWest;
}

typedef Point = {
	var x : Int;
	var y : Int;
}

class DirectionMethods {
	public static function rotate(d : Direction) : Direction {
		return switch(d) {
		case North: NorthEast;
		case NorthEast: East;
		case East: SouthEast;
		case SouthEast: South;
		case South: SouthWest;
		case SouthWest: West;
		case West: NorthWest;
		case NorthWest: North;
		}
	}
	public static function meaning(d : Direction) : Point {
		return switch(d) {
		case North: {x: 0, y: 1};
		case NorthEast: {x: 1, y: 1};
		case East: {x: 1, y: 0};
		case SouthEast: {x: 1, y: -1};
		case South: {x: 0, y: -1};
		case SouthWest: {x: -1, y: -1};
		case West: {x: -1, y: 0};
		case NorthWest: {x: -1, y: 1};
		}
	}
}

enum Coef {
	Unit;
	Acc;
	Num(n : Int);
}

enum Term {
	Fun(f : String);
	Test(b0 : Stmts, b1 : Stmts);
	Def(f : String, b0 : Stmts, b1 : Stmts);
	Block(b : Stmts);
}

typedef Statement = {
	var c : Coef;
	var t : Term;
}

typedef Stmts = SList<Statement>

typedef Screen = {
	function clear() : Void;
	function line(x0 : Int, y0 : Int, x1 : Int, y1 : Int) : Void;
}

class Robot {
	var acc : Int;
	var dir : Direction;
	var coor : Point;
	var screen : Screen;
	var prims : Map<String, Void -> Void>;
	var defs : Map<String, Stmts>;
	var cont : Stmts;
	public function new(s : Screen, p : Stmts) {
		acc = 0;
		dir = North;
		coor = {x: 0, y: 0};
		screen = s;
		prims = [
		         "+" => inc,
		         "-" => dec,
		         "h" => home,
		         "n" => north,
		         "c" => clear,
		         "r" => rotate,
		         "f" => forward,
		         "j" => jump,
		         ];
		defs = new Map();
		cont = p;
	}
	public function step() : Bool {
		switch(cont) {
		case Nil: return false;
		case Cons(x, xs):
			switch(x.c) {
			case Unit:
				exec(x.t, xs);
			case Acc: cont = Cons({c: Num(acc), t: x.t}, xs);
			case Num(n) if (n > 0):
				exec(x.t, Cons({c: Num(n - 1), t: x.t}, xs));
			case Num(_): cont = xs;
			}
			return true;
		}
	}
	function inc() {
		acc++;
	}
	function dec() {
		acc--;
	}
	function home() {
		coor.x = 0;
		coor.y = 0;
	}
	function north() {
		dir = North;
	}
	function clear() {
		screen.clear();
	}
	function rotate() {
		dir = DirectionMethods.rotate(dir);
	}
	function forward() {
		var d = DirectionMethods.meaning(dir);
		var x0 = coor.x;
		var y0 = coor.y;
		var x1 = x0 + d.x;
		var y1 = y0 + d.y;
		coor.x = x1;
		coor.y = y1;
		screen.line(x0, y0, x1, y1);
	}
	function jump() {
		var d = DirectionMethods.meaning(dir);
		coor.x += d.x;
		coor.y += d.y;
	}
	function define(f : String, b : Stmts) {
		defs.set(f, b);
	}
	function exec(t: Term, ct: Stmts) {
		switch(t) {
		case Fun(f) if (prims.exists(f)):
			prims.get(f)();
			cont = ct;
		case Fun(f) if (defs.exists(f)):
			cont = defs.get(f).append(ct);
		case Fun(f):
			throw "calling undefined function $f";
		case Test(b0, _) if (acc != 0):
			cont = b0.append(ct);
		case Test(_, b1):
			cont = b1.append(ct);
		case Def(f, b0, b1):
			define(f, b0);
			cont = b1.append(ct);
		case Block(b):
			cont = b.append(ct);
		}
	}
}
