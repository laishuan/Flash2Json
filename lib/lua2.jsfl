// Lua.jsfl

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
		return "["+quote+key+quote+"]";
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

		    for (var key in input) {
		    	var value = input[key];
		    	output += toLuaTable(value, transKey(key), intent + 1);
		    	output += ',' + enter;
		    }
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
		    	output +=  key + " " + eq + " " + quote + input + quote;
		    }
		    else {
			    output += quote + input + quote;
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
