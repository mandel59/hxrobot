import language.robot.Robot;
import language.robot.Parser;
import haxe.Timer;
import js.Browser;
import js.html.TextAreaElement;
import js.html.InputElement;
import js.html.CanvasElement;
import js.html.CanvasRenderingContext2D;

class RobotPlayer {
	static var program = "dx(t(-x6rk+)(f))
dk(t(-x2rk+)(f))
dw(cxw)
chn20j2r20j6ra-10+w";

	var width : Int;
	var height : Int;
	var scale : Float;
	var ctx : CanvasRenderingContext2D;
	var ta : TextAreaElement;
	var run_button : InputElement;
	var tweet_button : InputElement;
	var r : Robot;
	var t : Timer;

	function new() {
		var canvas : CanvasElement = cast(Browser.document.getElementById("robot"));
		ctx = canvas.getContext2d();
		width = 100;
		height = 100;
		scale = canvas.width / width;
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.scale(scale, -scale);
		ctx.strokeStyle = "black";
		ctx.lineWidth = 1 / scale;
		ta = cast(Browser.document.getElementById("program"));
		var s = StringTools.urlDecode(Browser.location.search);
		if (s.length > 0) {
			ta.value = s.substr(1);
		} else {
			ta.value = program;
		}
		run_button = cast(Browser.document.getElementById("run"));
		run_button.addEventListener("click", onRunButtonClick);
		tweet_button = cast(Browser.document.getElementById("tweet"));
		tweet_button.addEventListener("click", onTweetButtonClick);
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
		ctx.clearRect(-width / 2, -height / 2, width, height);
	}

	public function line(x1 : Int, y1 : Int, x2 : Int, y2 : Int) : Void {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
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

	function onRunButtonClick(e : Dynamic) {
		start();
	}

	function onTweetButtonClick(e : Dynamic) {
		var p = StringTools.urlEncode(ta.value);
		var url = StringTools.urlEncode('https://mandel59.github.io/hxrobot/?$p');
		Browser.window.open('https://twitter.com/intent/tweet?text=$p&url=$url', 'intent');
	}

	static function onload(e : Dynamic) {
		new RobotPlayer();
	}

	public static function main() {
		Browser.window.addEventListener("load", onload);
	}
}
