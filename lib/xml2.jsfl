// xml2.jsfl

if (typeof XML !== "object") {
    XML = {};
}

(function () {
	var NUMTYPE =1;
	var STRINGTYPE = 2;
	var ARRAYTYPE = 3;
	var HASHTYPE = 4;
	var BOOLTYPE = 5;
	var OTHERTYPE = 100;

	var space = '    ';
	var elementMark //= "_"
	var keyCheckFunc
	var maxLevel

	var checkAllElements = function (value) {
		var ret = {}
		ret.isAllElement = true
		ret.elementArr = []
		ret.notElementArr = []
		for (var key in value) {
			var data = {}
			data.key = key
			if (keyCheckFunc !== undefined) {
				var r = keyCheckFunc(key, {})
				if (r.t === JsonDealTypes.Skip) {
					continue 
				}
			}
			var curVal = value[key]
			if (curVal === undefined || curVal === null) {
				curVal = "null"
				continue
			}
			if (keyCheckFunc !== undefined) {
				var r = keyCheckFunc(key, curVal)
				if (r.t === JsonDealTypes.Skip)
					continue 
				else {
					data.value = r.v
				}
			}
			else
				data.value = value[key]
			var type = getType(value[key])
			if (type === ARRAYTYPE
				|| type === HASHTYPE) {
				ret.isAllElement = false
				ret.notElementArr[ret.notElementArr.length] = data
			}
			else {
				if (elementMark && key.slice(0, 1) === elementMark)
					ret.elementArr[ret.elementArr.length] = data
				else
					ret.notElementArr[ret.notElementArr.length] = data		
			}
		}
		return ret
	}

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

	var getSpace = function (intent) {
		var ret = '';
	    for (var i = 0; i < intent; i++) {
	    	ret += space;
	    };
	    return ret;
	}

	var getElementStr = function (value, key) {
		return key+"="+quote1(value)
	}

	var toXMLStr = function (input, key, intent) {
		key = key ? key : "root"
		if (keyCheckFunc !== undefined) {
			var ret = keyCheckFunc(key, input)
			if (ret.t === JsonDealTypes.Skip)
				return ""
			else
				input = ret.v
		}
		var output = '';
		intent = intent ? intent : 0;
		if (intent > maxLevel) {
			output += getSpace(intent) + "<"+key+">" + "MAX LEVEL" + "</" + key + ">\n"
			return output
		}
		var typeInput = getType(input);
		if (typeInput == HASHTYPE) {
			output += getSpace(intent);
			var checkResult = checkAllElements(input)
			if (checkResult.isAllElement) {
				var arr = []
				arr[arr.length] = "<" + key
				for (inputKey in input) {
					arr[arr.length] = getElementStr(input[inputKey], inputKey)
				}
				arr[arr.length] = "/>"
				output = output + ((arr.length == 2) ? arr.join("") : arr.join(" ")) + "\n"
			}
			else {
				var elementStrArr = []
				var temp = "<"+key
				for (var i = 0; i < checkResult.elementArr.length; i++) {
					var data = checkResult.elementArr[i]
					elementStrArr[elementStrArr.length] = getElementStr(data.value, data.key)
				}
				elementStrArr[elementStrArr.length] = ">\n"
				output += temp
				output += elementStrArr.join(" ")
				for (var i = 0; i < checkResult.notElementArr.length; i++) {
					var data = checkResult.notElementArr[i]
					output += toXMLStr(data.value, data.key, intent+1)
				}
				output += getSpace(intent) + "</" + key + ">" + "\n"
			}
		}
		else if (typeInput == ARRAYTYPE) {
			var arr = []
		    for (var i = 0; i < input.length; i++) {
		    	var value = input[i];
		    	arr[i] = toXMLStr(value, key, intent);
		    }
		    output = arr.join('')
		}
		else if (typeInput == NUMTYPE 
				|| typeInput === STRINGTYPE) {
			output += getSpace(intent) + "<"+key+">" + input + "</" + key + ">\n"
		}
		else if (typeInput == BOOLTYPE) {
			var value;
			if (input)
				value = "true";
			else
				value = "false";
				output += getSpace(intent) + "<"+key+">" + value + "</" + key + ">\n"
		}
		return output;
	}

	XML.stringify = function (input, f, ml) {
		keyCheckFunc = f ? f : undefined
		maxLevel = ml ? ml : 99
		var xmlStr = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"
		xmlStr = xmlStr + toXMLStr(input, false, 0);
		return xmlStr;
	}
}())
