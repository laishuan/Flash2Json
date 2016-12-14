
if (typeof INFO !== "object") {
    INFO = {};
}

(function  (argument) {
	fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/init.jsfl');
	INFO.dump = function  (argument) {
		fl.outputPanel.clear();
		var doc = fl.getDocumentDOM();
		var library = doc.library;

		var selItems = library.getSelectedItems();

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
		if (selItems.length == 0) {
			print(JSON.stringify(doc.getTimeline(), ref, 4));
		}
		else {
			print(JSON.stringify(selItems, ref, 4))
		}
	}
}())

