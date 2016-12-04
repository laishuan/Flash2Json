fl.outputPanel.clear();
// fl.trace("start");
var doc = fl.getDocumentDOM();
var library = doc.library;
var items = document.library.items;

var locAllLayer = function (timeline) {
	timeline.setLayerProperty('locked', true, 'all');
}

var tranOneTimeLine = function (timeline, itemName) {
	var layers = timeline.layers;
	for (var j = 0; j < layers.length; j++) {
		locAllLayer(timeline);
		var layer = layers[j];
		layer.locked = false;
		var frames = layer.frames;
		if (frames.length > 0) {
			for (var k = 0; k < frames.length; k++) {
				var frame = frames[k];
				if (frame.startFrame == k) {
					var elements = frame.elements;

					if (elements.length != 1 && elements.length > 0) {
						fl.trace("error: symbal:" + itemName + " layer:" + layer.name + " frameIndex:" + k + " wrong num elements!\n");
						// continue
					}

					for (var l = 0; l < elements.length; l++) {
						var element = elements[l];
						if (element.elementType === "shape") {
							timeline.setSelectedFrames(k, k, true);
							doc.selectAll();
							doc.convertSelectionToBitmap()
							break
						}
					}; 
				}
			};
		}
	};
}

var transAllShap = function () {
	doc.exitEditMode();
	tranOneTimeLine(doc.getTimeline(), "__scene");

	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		// fl.trace("item name:" + item.name);
		if (item.itemType == "movie clip" || item.itemType == 'graphic') {
			// fl.trace("item name:" + item.name + "is symbal");
			if (!item.name.firstName().endsWith(".fla")) {
				library.selectItem(item.name);
				library.editItem();
				tranOneTimeLine(item.timeline, item.name)
			}
		}
	};
}

transAllShap();


