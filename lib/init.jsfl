function is (value) {
    var str = Object.prototype.toString.call(value);
    var ret
    if (str === "[object Number]")
        ret = "number"
    else if (str === "[object String]")
        ret = "string"
    else if (str === "[object Boolean]")
        ret = "boolean"
    else if (str === "[object Function]")
        ret = "function"
    else if (str === "[object Array]")
        ret = "array"
    else if (str === "[object Window]"
            || str === "[object Tools]"
            || str === "[object SwfPanel]")
        ret = "null"
    else
        ret = "object"
    
    return ret
}

fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/stringE.jsfl');
fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/lua2.jsfl')
fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/json2.jsfl');
fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/Config.jsfl');
print = fl.trace;