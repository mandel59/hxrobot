import language.robot.Robot;
import language.robot.Parser;
import haxe.Timer;
import js.Browser;
import js.html.TextAreaElement;
import js.html.FormElement;
import js.html.svg.SVGElement;
import js.html.svg.LineElement;

class RobotPlayer {
	static var program = "dx(t(-x6rk+)(f))
dk(t(-x2rk+)(f))
dw(cxw)
chn20j2r20j6ra-10+w";

	var svg : SVGElement;
	var ta : TextAreaElement;
	var r : Robot;
	var t : Timer;

	function new() {
		svg = cast(Browser.document.getElementById("robot"));
		ta = cast(Browser.document.getElementById("program"));
		var s = StringTools.urlDecode(Browser.location.search);
		if (s.length > 0) {
			ta.value = s.substr(1);
		} else {
			ta.value = program;
		}
		ta.addEventListener("change", onchange);
		start();
	}

	function start() {
		if (t != null) {
			t.stop();
			t = null;
		}
		try {
			var p = Parser.parse(ta.value);
			r = new Robot(this, p);
			t = new Timer(10);
			t.run = run;
		} catch(e : Dynamic) {
			trace(e);
		}
	}

	public function clear() : Void {
		while (svg.firstChild != null) {
			svg.removeChild(svg.firstChild);
		}
	}

	public function line(x1 : Int, y1 : Int, x2 : Int, y2 : Int) : Void {
		var l : LineElement = cast(Browser.document.createElementNS("http://www.w3.org/2000/svg", "line"));
		var attrs = ["x1" => x1, "y1" => y1, "x2" => x2, "y2" => y2];
		for (k in attrs.keys()) {
			l.setAttribute(k, Std.string(attrs.get(k)));
		}
		svg.appendChild(l);
	}

	function run() {
		for (i in 0 ... 100) {
			if (!r.step()) {
				t.stop();
				t = null;
				break;
			}
		}
	}

	function onchange(e : Dynamic) {
		start();
	}

	static function onload(e : Dynamic) {
		new RobotPlayer();
	}

	public static function main() {
		Browser.window.addEventListener("load", onload);
	}
}
