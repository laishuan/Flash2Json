fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/init.jsfl');

var selItems = library.getSelectedItems();

if (selItems.length == 0) {
	print("没有选任何东西")
}
else {
	var ref = function  (key, value) {
		if (key === "libraryItem")
			return value.name;
		else if (key == "layer")
			return value.name;
		else if (key === "brightness" 
				|| key === "tintColor" 
				|| key === "tintPercent"
				|| key === "tintPercent"
				|| key === "actionScript")
			return 'null';
		else
			return value;
	}
	print(JSON.stringify(selItems, ref, 4))
}