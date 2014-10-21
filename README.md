# HxRobot

![Robot screencast](https://cloud.githubusercontent.com/assets/1079715/4714711/03e1abb2-58f6-11e4-8ae7-f8bb9c5fc9e4.gif)

[Try a web frontend!](https://mandel59.github.io/hxrobot/)

HxRobot is a Robot Language interpreter written in Haxe. Write a frontend and ship the interpreter to various platforms!

A frontend is need to implement below methods:

```
typedef Screen = {
    // clear the screen
    function clear() : Void;
    // draw a line from (x0,y0) to (x1,y1)
    function line(x0 : Int, y0 : Int, x1 : Int, y1 : Int) : Void;
}
```

# References

-[Introduction of Robot Language by Takeoka@AXE](http://www.takeoka.org/~take/kvm/rob.html)
