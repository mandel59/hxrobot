package language.robot;

import language.robot.SList;

class SListMethods {
	public static function append<T>(a : SList<T>, b : SList<T>) {
		return switch(a) {
		case Nil: b;
		case Cons(x, xs): Cons(x, append(xs, b));
		}
	}
}
