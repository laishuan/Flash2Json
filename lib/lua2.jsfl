// Lua.jsfl

if (typeof LUA !== "object") {
    LUA = {};
}

(function () {
	var space = '    ';
	var quote = '"';
	var left = '{';
	var right = '}';
	var eq = "=";

	var enter = '\n';

	var NUMTYPE =1;
	var STRINGTYPE = 2;
	var ARRAYTYPE = 3;
	var HASHTYPE = 4;
	var BOOLTYPE = 5;
	var OTHERTYPE = 100;
	// body...
	var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var meta = {    // table of character substitutions
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
    function quote1(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string)
            ? "\"" + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === "string"
                    ? c
                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\""
            : "\"" + string + "\"";
    }

	function getType (obj) {
		if (typeof(obj) == "number") {
			return NUMTYPE;
		}
		else if (typeof(obj) == "string") {
			return STRINGTYPE;
		}
		else if (typeof(obj) == "boolean") {
			return BOOLTYPE;
		}
		else if (typeof(obj) == "object") {
			if (obj instanceof Array) {
				return ARRAYTYPE;
			}
			else if (obj instanceof Object) {
				return HASHTYPE;
			}
		}
		return OTHERTYPE;
	}

	var transKey = function (key) {
		return "["+quote1(key)+"]";
	}

	var getSpace = function (intent) {
		var ret = '';
	    for (var i = 0; i < intent; i++) {
	    	ret += space;
	    };
	    return ret;
	}

	var toLuaTable = function (input, key, intent) {
		var output = '';
		intent = intent ? intent : 0;
		var typeInput = getType(input);
		if (typeInput == HASHTYPE) {
			output += getSpace(intent);
		    if (key) {
		    	output += key +  " " + eq + " " + left + enter;
		    }
		    else {
			    output += left + enter;
		    }
		    var hadValue = false
		    for (var key in input) {
		    	var value = input[key];
		    	if (value !== undefined) {
			    	output += toLuaTable(value, transKey(key), intent + 1);
			    	output += ',' + enter;
			    	hadValue = true
		    	}
		    }
		    if (hadValue)
			    output = output.slice(0, output.length-2) + enter;
			output += getSpace(intent);
		    output += right;
		}
		else if (typeInput == ARRAYTYPE) {
			output += getSpace(intent);

		    if (key) {
		    	output += key + " " + eq + " " + left + enter;
		    }
		    else {
			    output += left + enter;
		    }
		    for (var i = 0; i < input.length; i++) {
		    	var value = input[i];
		    	output += toLuaTable(value, undefined, intent + 1);
		    	if (i != input.length - 1) {
			    	output += ',' + enter;
		    	}
		    	else
		    		output += enter;
		    }

			output += getSpace(intent);
		    output += right;
		}
		else if (typeInput == NUMTYPE) {
			output += getSpace(intent);

		    if (key) {
		    	output += key + " " + eq + " " + input;
		    }
		    else {
			    output += input;
		    }
		}

		else if (typeInput == STRINGTYPE) {
			output += getSpace(intent);

		    if (key) {
		    	output +=  key + " " + eq + " " + quote1(input);
		    }
		    else {
			    output += quote1(input);
		    }
		}
		else if (typeInput == BOOLTYPE) {
			output += getSpace(intent);
			var value;
			if (input)
				value = "true";
			else
				value = "false";
		    if (key) {
		    	output +=  key + " " + eq + " " + value;
		    }
		    else {
			    output += value;
		    }
		}
		return output;
	}

	LUA.stringify = function (input, intent) {
		var luaTableStr = toLuaTable(input, false, intent);
		var ret = "local cfg = \n" + luaTableStr + "\nreturn cfg\n";
		return ret;
	}
}())
