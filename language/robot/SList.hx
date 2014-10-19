package language.robot;

enum SList<T> {
	Nil;
	Cons(x : T, xs : SList<T>);
}
