package language.robot;

import haxe.ds.Option;
import language.robot.SList;
import language.robot.Robot;

using StringTools;

class Parser {
	static var digits = ~/^\d+/;
	static var func = ~/^[-+bce-su-z]$/;
	public static function parse(s : String) : Stmts {
		var st = parseStmts(s);
		if (st._1.ltrim().length > 0) throw "syntax error";
		return st._0;
	}
	static function parseCoef(s : String) : Option<{var _0 : Coef; var _1 : String;}> {
		s = s.ltrim();
		if (s.length == 0) return None;
		switch(s.charCodeAt(0)) {
		case 'a'.code: return Some({_0: Acc, _1: s.substr(1)});
		case x if ('0'.code <= x && x <= '9'.code):
			digits.match(s);
			return Some({_0: Num(Std.parseInt(digits.matched(0))), _1: digits.matchedRight()});
		case _: return Some({_0: Unit, _1: s});
		}
	}
	static function parseTerm(s : String) : Option<{var _0 : Term; var _1 : String;}> {
		s = s.ltrim();
		if (s.length == 0) return None;
		switch(s.charAt(0)) {
		case 'd':
			var f = s.charAt(1);
			if (!func.match(f)) return None;
			if (s.charAt(2) != "(") return None;
			var b0 = parseStmts(s.substr(3));
			var b0_1 = b0._1.ltrim();
			if (b0_1.charAt(0) != ")") return None;
			var b1 = parseStmts(b0_1.substr(1));
			return Some({_0: Def(f, b0._0, b1._0), _1: b1._1});
		case 't':
			if (s.charAt(1) != "(") return None;
			var b0 = parseStmts(s.substr(2));
			var b0_1 = b0._1.ltrim();
			if (b0_1.charAt(0) != ")") return None;
			b0_1 = b0_1.substr(1).ltrim();
			if (b0_1.charAt(0) != "(") return None;
			var b1 = parseStmts(b0_1.substr(1));
			var b1_1 = b1._1.ltrim();
			if (b1_1.charAt(0) != ")") return None;
			return Some({_0: Test(b0._0, b1._0), _1: b1_1.substr(1)});
		case '(':
			var b = parseStmts(s.substr(1));
			var b_1 = b._1.ltrim();
			if (b_1.charAt(0) != ")") return None;
			return Some({_0: Block(b._0), _1: b_1.substr(1)});
		case ')':
			return None;
		case f if (func.match(f)):
			return Some({_0: Fun(f), _1: s.substr(1)});
		default:
			return None;
		}
	}
	static function parseStatement(s : String) : Option<{var _0 : Statement; var _1 : String;}> {
		var co = parseCoef(s);
		switch (co) {
		case None: return None;
		case Some(c):
			var to = parseTerm(c._1);
			switch (to) {
			case None: return None;
			case Some(t):
				return Some({_0: {c: c._0, t: t._0}, _1: t._1});
			}
		}
	}
	static function parseStmts(s : String) : {var _0 : Stmts; var _1 : String;} {
		var s0o = parseStatement(s);
		switch (s0o) {
		case None: return {_0: Nil, _1: s};
		case Some(s0):
			var s1 = parseStmts(s0._1);
			return {_0: Cons(s0._0, s1._0), _1: s1._1};
		}
	}
}
