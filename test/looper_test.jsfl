// TimeLineLooperTest.jsfl
fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/init.jsfl');
fl.outputPanel.clear();

var doc = fl.getDocumentDOM();
var library = doc.library;
var items = library.items;
var selItems = library.getSelectedItems();
var data = {}
var allElementName = []
data.elementAfter = function (level, item, layer, frame, element) {
	if (element.elementType === "instance") {
		var item = element.libraryItem
		if (item.itemType == "movie clip" 
			|| item.itemType == 'graphic' 
			|| item.itemType == 'button') {
			allElementName[allElementName.length] = item.name
		}
	}
}

data.level = 5
TimeLineLooper.trave(doc.getTimeline(), data)

print(allElementName.join("."))