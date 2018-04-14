
fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/init.jsfl');

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
		var outputStr = ""
		doc.exitEditMode();
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
				if (value.length > 0) {
					var newArr = []
					var bzArr = {}
					ret.v = newArr
					for (var i = 0; i < value.length; i++) {
						var oneFrameData = value[i]
						if (oneFrameData.startFrame === i) {
							newArr[newArr.length] = oneFrameData
							bzArr[i] = oneFrameData.getCustomEase("all")
						}
					};
					if (CONFIG.showEaSe) {
						newArr[newArr.length] = bzArr
					}
				}
				else {
					ret.v = value
				}
				ret.t = JsonDealTypes.Deal
				return ret
			}
			else {
				ret.v = value;
				ret.t = JsonDealTypes.Deal;
				return ret;
			}
		}
		if (selItems.length == 0) {
			outputStr = JSON.stringify(doc.timelines, ref, 4)
		}
		else {
			outputStr =JSON.stringify(selItems, ref, 4)
		}
		print(outputStr)
		FLfile.write(fl.configURI+"SceneOrItemInfo.json", outputStr)
		// FLfile.write(fl.configURI+"FlashAllInfo.json", JSON.stringify(fl, ref, 4))
	}
}())

