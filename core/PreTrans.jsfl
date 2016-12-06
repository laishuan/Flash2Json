fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/stringE.jsfl');
fl.outputPanel.clear();
// fl.trace("start");
var doc = fl.getDocumentDOM();
var library = doc.library;
var items = library.items;

var locAllLayer = function (timeline) {
	timeline.setLayerProperty('locked', true, 'all');
}

var tranOneTimeLine = function (timeline, itemName) {
	fl.trace("tranOneTimeLine:" + itemName)
	var layers = timeline.layers;
	locAllLayer(timeline);
	for (var j = 0; j < layers.length; j++) {
		var layer = layers[j];
		fl.trace("check layer:" + layer.name)
		layer.locked = false;
		var frames = layer.frames;
		if (frames.length > 0) {
			for (var k = 0; k < frames.length; k++) {
				var frame = frames[k];
				if (frame.startFrame == k) {
					fl.trace("index " + (k+1) + " is key frame")
					var elements = frame.elements;
					var isHadShape = false;
					for (var l = 0; l < elements.length; l++) {
						var oneE = elements[l];
						if (oneE.elementType === "shape") {
							fl.trace("had shape")
							isHadShape = true;
							break
						}
					};
					if (isHadShape) {					
						if (elements.length > 1) {
							fl.trace("CATCH: symbal:" + itemName + " layer:" + layer.name + " frameIndex:" + k);
							fl.trace("Try to trance ...")
							timeline.setSelectedFrames(k, k, true);
							doc.selectAll();
							fl.trace("Try trans to movie clip")
							var newMc = doc.convertToSymbol("graphic", "", "center");
							if (!newMc)
								fl.trace("error: can not trans to symbol")
							else {
								fl.trace("trans success:" + newMc.name)
								library.selectItem(newMc.name);
								library.editItem();
								// fl.trace("1")
								var frame = newMc.timeline.layers[0].frames[0];
								// fl.trace("2")
								newMc.timeline.setSelectedFrames(0, 0, true);
								// fl.trace("3")
								doc.selectAll();
								// fl.trace("4")
								fl.trace("distributeToLayers")
								doc.distributeToLayers();
								tranOneTimeLine2(newMc.timeline, newMc.name);
								// return tranOneTimeLine(timeline, itemName)
							}
						}
						else {
							// fl.trace("trans the just one to bitmap")
							// timeline.setSelectedFrames(k, k, true);
							// doc.selectAll();
							// doc.convertToSymbol("graphic", "", "center");
						}

					}
				}
			};
		}
		layer.locked = true;
	};
	timeline.setLayerProperty('locked', false, 'all');
	fl.trace("===========================>")
}

var tranOneTimeLine3 = function (timeline, itemName) {
	fl.trace("tranOneTimeLine:" + itemName)
	var layers = timeline.layers;
	locAllLayer(timeline);
	for (var j = 0; j < layers.length; j++) {
		var layer = layers[j];
		fl.trace("check layer:" + layer.name)
		layer.locked = false;
		var frames = layer.frames;
		if (frames.length > 0) {
			for (var k = 0; k < frames.length; k++) {
				var frame = frames[k];
				if (frame.startFrame == k) {
					fl.trace("index " + (k+1) + " is key frame")
					var elements = frame.elements;
					var isHadShape = false;
					for (var l = 0; l < elements.length; l++) {
						var oneE = elements[l];
						if (oneE.elementType === "shape") {
							fl.trace("had shape")
							isHadShape = true;
							break
						}
					};
					if (isHadShape) {					
						if (elements.length > 1) {
							fl.trace("CATCH: symbal:" + itemName + " layer:" + layer.name + " frameIndex:" + k);
							fl.trace("Try to trance ...")
							timeline.setSelectedFrames(k, k, true);
							doc.selectAll();
							fl.trace("Try trans to movie clip")
							var newMc = doc.convertToSymbol("graphic", "", "center");
							if (!newMc)
								fl.trace("error: can not trans to symbol")
							else {
								fl.trace("trans success:" + newMc.name)
								library.selectItem(newMc.name);
								library.editItem();
								// fl.trace("1")
								var frame = newMc.timeline.layers[0].frames[0];
								// fl.trace("2")
								newMc.timeline.setSelectedFrames(0, 0, true);
								// fl.trace("3")
								doc.selectAll();
								// fl.trace("4")
								fl.trace("distributeToLayers")
								doc.distributeToLayers();
								tranOneTimeLine2(newMc.timeline, newMc.name);
								// return tranOneTimeLine(timeline, itemName)
							}
						}
						else {
							fl.trace("trans the just one to bitmap")
							timeline.setSelectedFrames(k, k, true);
							doc.selectAll();
							doc.convertSelectionToBitmap()
						}

					}
				}
			};
		}
		layer.locked = true;
	};
	timeline.setLayerProperty('locked', false, 'all');
	fl.trace("===========================>")
}

var tranOneTimeLine2 = function (timeline, itemName) {
	fl.trace("\ttranOneTimeLine2:" + itemName)
	locAllLayer(timeline);
	var layers = timeline.layers;
	for (var j = 0; j < layers.length; j++) {
		var layer = layers[j];
		fl.trace("\tcheck layer:" + layer.name)
		layer.locked = false;
		var frames = layer.frames;
		if (frames.length > 0) {
			for (var k = 0; k < frames.length; k++) {
				var frame = frames[k];
				if (frame.startFrame === k) {
					fl.trace("\tindex " + (k+1) + " is key frame")
					var elements = frame.elements;
					fl.trace("\telements len:" + elements.length)
					if (elements.length === 1) {
						var element = elements[0];
						fl.trace("\t" + element.elementType)
						if (element.elementType === "shape") {
							fl.trace("\tCatch:" + itemName + " Try trans to bitmap")
							timeline.setSelectedFrames(k, k, true);
							doc.selectAll();
							doc.convertSelectionToBitmap()
						}
					} 
				}
			};
		}
		layer.locked = true;
	};
	timeline.setLayerProperty('locked', false, 'all');
}

var transAllShap = function (func) {
	doc.exitEditMode();
	var allItems = []

	// for (var i = 0; i < items.length; i++) {
	// 	var item = items[i];
	// 	allItems[allItems.length] = item;
	// };
	func(doc.getTimeline(), "__scene");

	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		// fl.trace("item name:" + item.name);
		if (item.itemType == "movie clip" || item.itemType == 'graphic' || item.itemType == 'button') {
			// fl.trace("item name:" + item.name + "is symbal");
			if (!item.name.firstName().endsWith(".fla")) {
				library.selectItem(item.name);
				library.editItem();
				func(item.timeline, item.name)
			}
		}
	};
}

transAllShap(tranOneTimeLine);

transAllShap(tranOneTimeLine3);


