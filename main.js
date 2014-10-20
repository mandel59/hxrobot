(function () { "use strict";
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw "EReg::matched";
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var IMap = function() { };
IMap.__name__ = true;
var RobotPlayer = function() {
	this.svg = window.document.getElementById("robot");
	this.ta = window.document.getElementById("program");
	this.ta.value = RobotPlayer.program;
	this.ta.addEventListener("change",$bind(this,this.onchange));
	this.start();
};
RobotPlayer.__name__ = true;
RobotPlayer.onload = function(e) {
	new RobotPlayer();
};
RobotPlayer.main = function() {
	window.addEventListener("load",RobotPlayer.onload);
};
RobotPlayer.prototype = {
	start: function() {
		if(this.t != null) {
			this.t.stop();
			this.t = null;
		}
		try {
			var p = language.robot.Parser.parse(this.ta.value);
			this.r = new language.robot.Robot(this,p);
			this.t = new haxe.Timer(10);
			this.t.run = $bind(this,this.run);
		} catch( e ) {
			console.log(e);
		}
	}
	,clear: function() {
		while(this.svg.firstChild != null) this.svg.removeChild(this.svg.firstChild);
	}
	,line: function(x1,y1,x2,y2) {
		var l = window.document.createElementNS("http://www.w3.org/2000/svg","line");
		var attrs;
		var _g = new haxe.ds.StringMap();
		_g.set("x1",x1);
		_g.set("y1",y1);
		_g.set("x2",x2);
		_g.set("y2",y2);
		attrs = _g;
		var $it0 = attrs.keys();
		while( $it0.hasNext() ) {
			var k = $it0.next();
			l.setAttribute(k,Std.string(attrs.get(k)));
		}
		this.svg.appendChild(l);
	}
	,run: function() {
		var _g = 0;
		while(_g < 100) {
			var i = _g++;
			if(!this.r.step()) {
				this.t.stop();
				this.t = null;
				break;
			}
		}
	}
	,onchange: function(e) {
		this.start();
	}
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
var haxe = {};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = true;
haxe.Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
};
haxe.ds = {};
haxe.ds.Option = { __ename__ : true, __constructs__ : ["Some","None"] };
haxe.ds.Option.Some = function(v) { var $x = ["Some",0,v]; $x.__enum__ = haxe.ds.Option; return $x; };
haxe.ds.Option.None = ["None",1];
haxe.ds.Option.None.__enum__ = haxe.ds.Option;
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
var language = {};
language.robot = {};
language.robot.Parser = function() { };
language.robot.Parser.__name__ = true;
language.robot.Parser.parse = function(s) {
	var st = language.robot.Parser.parseStmts(s);
	if(StringTools.ltrim(st._1).length > 0) throw "syntax error";
	return st._0;
};
language.robot.Parser.parseCoef = function(s) {
	s = StringTools.ltrim(s);
	if(s.length == 0) return haxe.ds.Option.None;
	var _g = HxOverrides.cca(s,0);
	var x = _g;
	switch(_g) {
	case 97:
		return haxe.ds.Option.Some({ _0 : language.robot.Coef.Acc, _1 : HxOverrides.substr(s,1,null)});
	default:
		if(48 <= x && x <= 57) {
			language.robot.Parser.digits.match(s);
			return haxe.ds.Option.Some({ _0 : language.robot.Coef.Num(Std.parseInt(language.robot.Parser.digits.matched(0))), _1 : language.robot.Parser.digits.matchedRight()});
		} else return haxe.ds.Option.Some({ _0 : language.robot.Coef.Unit, _1 : s});
	}
};
language.robot.Parser.parseTerm = function(s) {
	s = StringTools.ltrim(s);
	if(s.length == 0) return haxe.ds.Option.None;
	var _g = s.charAt(0);
	var f = _g;
	switch(_g) {
	case "d":
		var f1 = s.charAt(1);
		if(!language.robot.Parser.func.match(f1)) return haxe.ds.Option.None;
		if(s.charAt(2) != "(") return haxe.ds.Option.None;
		var b0 = language.robot.Parser.parseStmts(HxOverrides.substr(s,3,null));
		var b0_1 = StringTools.ltrim(b0._1);
		if(b0_1.charAt(0) != ")") return haxe.ds.Option.None;
		var b1 = language.robot.Parser.parseStmts(HxOverrides.substr(b0_1,1,null));
		return haxe.ds.Option.Some({ _0 : language.robot.Term.Def(f1,b0._0,b1._0), _1 : b1._1});
	case "t":
		if(s.charAt(1) != "(") return haxe.ds.Option.None;
		var b01 = language.robot.Parser.parseStmts(HxOverrides.substr(s,2,null));
		var b0_11 = StringTools.ltrim(b01._1);
		if(b0_11.charAt(0) != ")") return haxe.ds.Option.None;
		b0_11 = StringTools.ltrim(HxOverrides.substr(b0_11,1,null));
		if(b0_11.charAt(0) != "(") return haxe.ds.Option.None;
		var b11 = language.robot.Parser.parseStmts(HxOverrides.substr(b0_11,1,null));
		var b1_1 = StringTools.ltrim(b11._1);
		if(b1_1.charAt(0) != ")") return haxe.ds.Option.None;
		return haxe.ds.Option.Some({ _0 : language.robot.Term.Test(b01._0,b11._0), _1 : HxOverrides.substr(b1_1,1,null)});
	case "(":
		var b = language.robot.Parser.parseStmts(HxOverrides.substr(s,1,null));
		var b_1 = StringTools.ltrim(b._1);
		if(b_1.charAt(0) != ")") return haxe.ds.Option.None;
		return haxe.ds.Option.Some({ _0 : language.robot.Term.Block(b._0), _1 : HxOverrides.substr(b_1,1,null)});
	case ")":
		return haxe.ds.Option.None;
	default:
		if(language.robot.Parser.func.match(f)) return haxe.ds.Option.Some({ _0 : language.robot.Term.Fun(f), _1 : HxOverrides.substr(s,1,null)}); else return haxe.ds.Option.None;
	}
};
language.robot.Parser.parseStatement = function(s) {
	var co = language.robot.Parser.parseCoef(s);
	switch(co[1]) {
	case 1:
		return haxe.ds.Option.None;
	case 0:
		var c = co[2];
		var to = language.robot.Parser.parseTerm(c._1);
		switch(to[1]) {
		case 1:
			return haxe.ds.Option.None;
		case 0:
			var t = to[2];
			return haxe.ds.Option.Some({ _0 : { c : c._0, t : t._0}, _1 : t._1});
		}
		break;
	}
};
language.robot.Parser.parseStmts = function(s) {
	var s0o = language.robot.Parser.parseStatement(s);
	switch(s0o[1]) {
	case 1:
		return { _0 : language.robot.SList.Nil, _1 : s};
	case 0:
		var s0 = s0o[2];
		var s1 = language.robot.Parser.parseStmts(s0._1);
		return { _0 : language.robot.SList.Cons(s0._0,s1._0), _1 : s1._1};
	}
};
language.robot.Direction = { __ename__ : true, __constructs__ : ["North","NorthEast","East","SouthEast","South","SouthWest","West","NorthWest"] };
language.robot.Direction.North = ["North",0];
language.robot.Direction.North.__enum__ = language.robot.Direction;
language.robot.Direction.NorthEast = ["NorthEast",1];
language.robot.Direction.NorthEast.__enum__ = language.robot.Direction;
language.robot.Direction.East = ["East",2];
language.robot.Direction.East.__enum__ = language.robot.Direction;
language.robot.Direction.SouthEast = ["SouthEast",3];
language.robot.Direction.SouthEast.__enum__ = language.robot.Direction;
language.robot.Direction.South = ["South",4];
language.robot.Direction.South.__enum__ = language.robot.Direction;
language.robot.Direction.SouthWest = ["SouthWest",5];
language.robot.Direction.SouthWest.__enum__ = language.robot.Direction;
language.robot.Direction.West = ["West",6];
language.robot.Direction.West.__enum__ = language.robot.Direction;
language.robot.Direction.NorthWest = ["NorthWest",7];
language.robot.Direction.NorthWest.__enum__ = language.robot.Direction;
language.robot.DirectionMethods = function() { };
language.robot.DirectionMethods.__name__ = true;
language.robot.DirectionMethods.rotate = function(d) {
	switch(d[1]) {
	case 0:
		return language.robot.Direction.NorthEast;
	case 1:
		return language.robot.Direction.East;
	case 2:
		return language.robot.Direction.SouthEast;
	case 3:
		return language.robot.Direction.South;
	case 4:
		return language.robot.Direction.SouthWest;
	case 5:
		return language.robot.Direction.West;
	case 6:
		return language.robot.Direction.NorthWest;
	case 7:
		return language.robot.Direction.North;
	}
};
language.robot.DirectionMethods.meaning = function(d) {
	switch(d[1]) {
	case 0:
		return { x : 0, y : 1};
	case 1:
		return { x : 1, y : 1};
	case 2:
		return { x : 1, y : 0};
	case 3:
		return { x : 1, y : -1};
	case 4:
		return { x : 0, y : -1};
	case 5:
		return { x : -1, y : -1};
	case 6:
		return { x : -1, y : 0};
	case 7:
		return { x : -1, y : 1};
	}
};
language.robot.Coef = { __ename__ : true, __constructs__ : ["Unit","Acc","Num"] };
language.robot.Coef.Unit = ["Unit",0];
language.robot.Coef.Unit.__enum__ = language.robot.Coef;
language.robot.Coef.Acc = ["Acc",1];
language.robot.Coef.Acc.__enum__ = language.robot.Coef;
language.robot.Coef.Num = function(n) { var $x = ["Num",2,n]; $x.__enum__ = language.robot.Coef; return $x; };
language.robot.Term = { __ename__ : true, __constructs__ : ["Fun","Test","Def","Block"] };
language.robot.Term.Fun = function(f) { var $x = ["Fun",0,f]; $x.__enum__ = language.robot.Term; return $x; };
language.robot.Term.Test = function(b0,b1) { var $x = ["Test",1,b0,b1]; $x.__enum__ = language.robot.Term; return $x; };
language.robot.Term.Def = function(f,b0,b1) { var $x = ["Def",2,f,b0,b1]; $x.__enum__ = language.robot.Term; return $x; };
language.robot.Term.Block = function(b) { var $x = ["Block",3,b]; $x.__enum__ = language.robot.Term; return $x; };
language.robot.Robot = function(s,p) {
	this.acc = 0;
	this.dir = language.robot.Direction.North;
	this.coor = { x : 0, y : 0};
	this.screen = s;
	var _g = new haxe.ds.StringMap();
	_g.set("+",$bind(this,this.inc));
	_g.set("-",$bind(this,this.dec));
	_g.set("h",$bind(this,this.home));
	_g.set("n",$bind(this,this.north));
	_g.set("c",$bind(this,this.clear));
	_g.set("r",$bind(this,this.rotate));
	_g.set("f",$bind(this,this.forward));
	_g.set("j",$bind(this,this.jump));
	this.prims = _g;
	this.defs = new haxe.ds.StringMap();
	this.cont = p;
};
language.robot.Robot.__name__ = true;
language.robot.Robot.prototype = {
	step: function() {
		{
			var _g = this.cont;
			switch(_g[1]) {
			case 0:
				return false;
			case 1:
				var xs = _g[3];
				var x = _g[2];
				{
					var _g1 = x.c;
					switch(_g1[1]) {
					case 0:
						this.exec(x.t,xs);
						break;
					case 1:
						this.cont = language.robot.SList.Cons({ c : language.robot.Coef.Num(this.acc), t : x.t},xs);
						break;
					case 2:
						var n = _g1[2];
						if(n > 0) this.exec(x.t,language.robot.SList.Cons({ c : language.robot.Coef.Num(n - 1), t : x.t},xs)); else this.cont = xs;
						break;
					}
				}
				return true;
			}
		}
	}
	,inc: function() {
		this.acc++;
	}
	,dec: function() {
		this.acc--;
	}
	,home: function() {
		this.coor.x = 0;
		this.coor.y = 0;
	}
	,north: function() {
		this.dir = language.robot.Direction.North;
	}
	,clear: function() {
		this.screen.clear();
	}
	,rotate: function() {
		this.dir = language.robot.DirectionMethods.rotate(this.dir);
	}
	,forward: function() {
		var d = language.robot.DirectionMethods.meaning(this.dir);
		var x0 = this.coor.x;
		var y0 = this.coor.y;
		var x1 = x0 + d.x;
		var y1 = y0 + d.y;
		this.coor.x = x1;
		this.coor.y = y1;
		this.screen.line(x0,y0,x1,y1);
	}
	,jump: function() {
		var d = language.robot.DirectionMethods.meaning(this.dir);
		this.coor.x += d.x;
		this.coor.y += d.y;
	}
	,define: function(f,b) {
		this.defs.set(f,b);
	}
	,exec: function(t,ct) {
		switch(t[1]) {
		case 0:
			var f = t[2];
			if(this.prims.exists(f)) {
				(this.prims.get(f))();
				this.cont = ct;
			} else {
				var f1 = t[2];
				if(this.defs.exists(f1)) this.cont = language.robot.SListMethods.append(this.defs.get(f1),ct); else {
					var f2 = t[2];
					throw "calling undefined function $f";
				}
			}
			break;
		case 1:
			var b0 = t[2];
			if(this.acc != 0) this.cont = language.robot.SListMethods.append(b0,ct); else {
				var b1 = t[3];
				this.cont = language.robot.SListMethods.append(b1,ct);
			}
			break;
		case 2:
			var b11 = t[4];
			var b01 = t[3];
			var f3 = t[2];
			this.define(f3,b01);
			this.cont = language.robot.SListMethods.append(b11,ct);
			break;
		case 3:
			var b = t[2];
			this.cont = language.robot.SListMethods.append(b,ct);
			break;
		}
	}
};
language.robot.SList = { __ename__ : true, __constructs__ : ["Nil","Cons"] };
language.robot.SList.Nil = ["Nil",0];
language.robot.SList.Nil.__enum__ = language.robot.SList;
language.robot.SList.Cons = function(x,xs) { var $x = ["Cons",1,x,xs]; $x.__enum__ = language.robot.SList; return $x; };
language.robot.SListMethods = function() { };
language.robot.SListMethods.__name__ = true;
language.robot.SListMethods.append = function(a,b) {
	switch(a[1]) {
	case 0:
		return b;
	case 1:
		var xs = a[3];
		var x = a[2];
		return language.robot.SList.Cons(x,language.robot.SListMethods.append(xs,b));
	}
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.__name__ = true;
Array.__name__ = true;
RobotPlayer.program = "dx(t(-x6rk+)(f))\ndk(t(-x2rk+)(f))\ndw(cxw)\nchn20j2r20j6ra-10+w";
language.robot.Parser.digits = new EReg("^\\d+","");
language.robot.Parser.func = new EReg("^[-+bce-su-z]$","");
RobotPlayer.main();
})();
