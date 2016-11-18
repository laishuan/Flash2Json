fl.outputPanel.clear();
fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/init.jsfl');

var selItems = library.getSelectedItems();

if (selItems.length == 0) {
	print("没有选任何东西")
}
else {
	var ref = function  (key, value) {
		var ret = {};

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
		else if (key === "brightness" 
				|| key === "tintColor" 
				|| key === "tintPercent"
				|| key === "tintPercent"
				|| key === "actionScript"
				|| key === "packagePaths"
				|| value.elementType == "shape") {	
			ret.t = JsonDealTypes.Skip;
			return ret;
		}
		else {
			ret.v = value;
			ret.t = JsonDealTypes.Deal;
			return ret;
		}
	}
	print(JSON.stringify(selItems, ref, 4))
}