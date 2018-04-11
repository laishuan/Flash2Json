// TimeLineLooper.jsfl

if (typeof TimeLineLooper !== "object") {
    TimeLineLooper = {};
}

(function () {
	var layerFunc, frameFunc, elementFunc, layerEFunc
	var onStartFunc, onEndFunc
	TimeLineLooper.layerF = function (f) {
		layerFunc = f
	}
	TimeLineLooper.layerEF = function (f) {
		layerEFunc = f
	}
	TimeLineLooper.frameF = function (f) {
		frameFunc = f
	}
	TimeLineLooper.elementF = function (f) {
		elementFunc = f
	}
	TimeLineLooper.startF = function (f) {
		onStartFunc = f
	}
	TimeLineLooper.endF = function (f) {
		onEndFunc = f
	}
	TimeLineLooper.clear = function () {
		layerFunc = undefined
		frameFunc = undefined
		elementFunc = undefined
		onStartFunc = undefined
		onEndFunc = undefined
		layerEFunc = undefined
	}
	TimeLineLooper.trave = function (timeline) {
		var onStartStatus

		if (onStartFunc !== undefined) {
			onStartStatus = onStartFunc(timeline)
		}
		print("1")
		if (onStartStatus === undefined
			|| onStartStatus) {
			print("2")
			var layers = timeline.layers;
			for (var j = 0; j < layers.length; j++) {
				var layer = layers[j];
				var layerFuncStatus
				if (layerFunc !== undefined) {
					layerFuncStatus = layerFunc(layer, timeline)
				}
				if (layerFuncStatus == undefined 
					|| layerFuncStatus) {
					print("3")
					var frames = layer.frames;
					if (frames.length > 0) {
						for (var k = 0; k < frames.length; k++) {
							var frame = frames[k];
							if (frame.startFrame === k) {
								print("4")
								var frameFuncStatus
								if (frameFunc !== undefined) {
									frameFuncStatus = frameFunc(frame, layer, timeline)
								}
								if (frameFuncStatus == undefined 
									|| frameFuncStatus) {
									print("5")
									var elements = frame.elements;
									for (var i = 0; i < elements.length; i++) {
										var element = elements[i]
										var elementFuncStatus
										if (elementFunc !== undefined) {
											print("6")
											elementFuncStatus = elementFunc(element, frame, layer, timeline)
										}
										// if (elementFuncStatus == undefined 
										// 	|| elementFuncStatus) {
										// }
									}
								}
							}
						}
					}
				}
				if (layerEFunc)
					layerEFunc(layer)
			}
		}
		if (onEndFunc !== undefined) {
			onEndFunc(timeline)
		}
	}
}())