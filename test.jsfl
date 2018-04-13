// test.jsfl

fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/init.jsfl');
var str = "_key"
var arr = [1,2,3,5,4]
fl.outputPanel.clear();
var doc = fl.getDocumentDOM();
var ref = function  (key, value) {
	var ret = {};
	// print("key:" + key)
	if (key === "libraryItem") {
		ret.v = value.name;
		ret.t = JsonDealTypes.Deal;
		return ret;
	}
	else if (key === "layer") {
		ret.v = value.name;
		ret.t = JsonDealTypes.Deal;
		return ret;
	}
	else if (value.elementType === "shape") {
		ret.v = value;
		ret.t = JsonDealTypes.Deal;
		// var data = []
		// for (var i = 0; i < value.numCubicSegments; i++) {
		// 	data[data.length] = value.getCubicSegmentPoints(i)
		// };
		// ret.v = data
		return ret;
	}
	else if (key === "brightness" 
			|| key === "tintColor" 
			|| key === "tintPercent"
			|| key === "tintPercent"
			|| key === "actionScript"
			|| key === "packagePaths"
			|| key === "lineType"
			|| key === "listIndex"
			|| key === "webfontsManager"
			/*|| value.elementType == "shape"*/) {	
		ret.t = JsonDealTypes.Skip;
		return ret;
	}
	else if (key === "frames") {
		ret.v = value
		ret.t = JsonDealTypes.Deal
		return ret
	}
	else {
		ret.v = value;
		ret.t = JsonDealTypes.Deal;
		return ret
	}
}
print(XML.stringify(fl.getDocumentDOM(), ref, 5))
// FLfile.runCommandLine("echo hello,world > ./a.txt\n")