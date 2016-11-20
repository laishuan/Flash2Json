function is (value) {
    var str = Object.prototype.toString.call(value);
    switch (str) {
        case　"[object Number]":
            return "number";
        case "[object String]":
            return "string";
        case "[object Boolean]":
            return "boolean";
        case "[object Function]":
            return "function";
        case "[object Array]":
            return "array";
        case "[object Window]":
        case "[object Tools]":
        case "[object SwfPanel]":
            return "null";
        default:
            return "object";
    }
}

fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/stringE.jsfl');
fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/json2.jsfl');
fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/Config.jsfl');

print = fl.trace;