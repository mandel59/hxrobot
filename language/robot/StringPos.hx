package language.robot;

class StringPos {
	var str : String;
	var pos : Int;
	public function new(s : String, p : Int) {
		str = s;
		pos = p;
	}
	public var length(get,never) : Int;
	function get_length() : Int {
		return str.length - pos;
	}
	public function ltrim() : StringPos {
		var p = pos;
		while(p < str.length && StringTools.isSpace(str, p)) {
			p++;
		}
		return new StringPos(str, p);
	}
	public inline function charCodeAt(p : Int) : Int {
		return str.charCodeAt(pos + p);
	}
	public inline function charAt(p : Int) : String {
		return str.charAt(pos + p);
	}
	public inline function advance(n : Int) : StringPos {
		return new StringPos(str, pos + n);
	}
	public function match(e : EReg) : StringPos {
		e.matchSub(str, pos);
		var p = e.matchedPos();
		return new StringPos(str, p.pos + p.len);
	}
	public inline function toString() : String {
		return str.substr(pos);
	}
}
