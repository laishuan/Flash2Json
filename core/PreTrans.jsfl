if (typeof PreTrans !== "object") {
    PreTrans = {};
}
(function (argument) {
	fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/init.jsfl');
	var doc, library, items;
	var allMaskItem = {}
	var locAllLayer = function (timeline) {
		timeline.setLayerProperty('locked', true, 'all');
	}

	var tranOneTimeLine = function (timeline, itemName) {
		var layers = timeline.layers;
		locAllLayer(timeline);
		for (var j = 0; j < layers.length; j++) {
			var layer = layers[j];
			// fl.trace("check layer:" + layer.name)
			layer.locked = false;
			var frames = layer.frames;
			if (frames.length > 0) {
				for (var k = 0; k < frames.length; k++) {
					var frame = frames[k];
					if (frame.startFrame == k) {
						var elements = frame.elements;
						var isHadShape = false;
						for (var l = 0; l < elements.length; l++) {
							var oneE = elements[l];
							if (oneE.elementType === "shape") {
								isHadShape = true;
								break
							}
						};
						if (isHadShape) {					
							fl.trace("CATCH: symbal:" + itemName + " layer:" + layer.name + " frameIndex:" + k);
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
								var frame = newMc.timeline.layers[0].frames[0];
								newMc.timeline.setSelectedFrames(0, 0, true);
								doc.selectAll();
								fl.trace("distributeToLayers")
								doc.distributeToLayers();
								tranOneTimeLine2(newMc.timeline, newMc.name);
								if (itemName === "__scene")
									doc.exitEditMode();
								else {
									library.selectItem(itemName);
									library.editItem();
								}
								timeline.setSelectedFrames(k, k, true);
								doc.selectAll();
								doc.breakApart()
								doc.library.deleteItem(newMc.name)
							}
						}
					}
				};
			}
			layer.locked = true;
		};
		timeline.setLayerProperty('locked', false, 'all');
		doc.exitEditMode();
		fl.trace("===========================>" + itemName + " end")
	}

	var tranOneTimeLine2 = function (timeline, itemName) {
		fl.trace("----deal new item:" + itemName)
		locAllLayer(timeline);
		var layers = timeline.layers;
		var layersNeedDelete = []
		for (var j = 0; j < layers.length; j++) {
			var layer = layers[j];
			fl.trace("--------check layer:" + layer.name)
			layer.locked = false;
			var frames = layer.frames;
			var allFrameIsEmpty = true
			if (frames.length > 0) {
				for (var k = 0; k < frames.length; k++) {
					var frame = frames[k];
					if (!frame.isEmpty) {
						allFrameIsEmpty = false
					}
					if (frame.startFrame === k) {
						fl.trace("------------index " + (k+1) + " is key frame")
						var elements = frame.elements;
						fl.trace("------------elements len:" + elements.length)
						if (elements.length === 1) {
							var element = elements[0];
							fl.trace("----------------" + element.elementType)
							if (element.elementType === "shape") {
								fl.trace("----------------Catch:" + itemName + " Try trans to bitmap")
								timeline.setSelectedFrames(k, k, true);
								doc.selectAll();
								doc.convertSelectionToBitmap()
							}
						} 
					}
				};
			}
			if (allFrameIsEmpty) {
				layersNeedDelete[layersNeedDelete.length] = j
			}
			layer.locked = true;
		};
		timeline.setLayerProperty('locked', false, 'all');
		for (var i = layersNeedDelete.length - 1; i >= 0; i--) {
			timeline.deleteLayer(layersNeedDelete[i])
		}
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

	PreTrans.trans = function (exportDoc) {
		fl.outputPanel.clear();
		if (exportDoc !== undefined) 
			doc = exportDoc
		else 
			doc = fl.getDocumentDOM();

		library = doc.library;
		items = library.items;
		transAllShap(tranOneTimeLine);
		// transAllShap(tranOneTimeLine3);
	}
}())


