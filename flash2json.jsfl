// flash2json.jsfl

fl.outputPanel.clear();
fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/init.jsfl');
var doc = fl.getDocumentDOM();
var library = doc.library;
var ExportFname = CONFIG.ExportFname;
var UnexportFname = CONFIG.UnexportFname;
var AutoNamePrefix = "auto";
var FlashName = doc.path.fileName();
var sheetExporter = new SpriteSheetExporter;
sheetExporter.beginExport();
var allImgArr = [];
var UITypes = CONFIG.UITypes;

var map = function (arr, fun) {
	for (var i = 0; i < arr.length; i++) {
		var v = arr[i];
		arr[i] = func(v);
	};
}

var filter = function (arr, fun) {
	var ret = [];
	for (var i = 0; i < arr.length; i++) {
		var v = arr[i];
		if (fun(v)) {
			ret[ret.length] = v;
		}
	};
	return ret;
}

var isMcNode = function (item) {
	 if (item.timeline.frameCount == 1
		&& item.timeline.layerCount === 1) {
	 	var frames = item.timeline.layers[0].frames;
	 	var frame = frames[0];
	 	if (frames.isEmpty) 
	 		return true;
	 	else {
	 		var elements = frame.elements;
	 		if (elements.length === 1) {
	 			var element = elements[0];
	 			if (element.elementType === "instance" 
	 				&& element.instanceType == "symbol"
	 				&& element.symbolType == "movie clip")
	 				return isMcNode(element.libraryItem);
	 		}
	 		else
	 			return false;
	 	}
	 }
}
var checkItemType = function (item) {
	var cache = {};
	var cacheValue = cache[item.name];
	if (cacheValue !== undefined) {
		return cacheValue
	}
	else {
		var ret;
		if (item.itemType === "movie clip")	{
			if (item.name.firstName().endsWith(".fla"))
			{
				ret = UITypes.LK;
			}
			else if (isMcNode(item))
				ret = UITypes.Nod;
			else
				ret = UITypes.Anm;
		}
		else if (item.itemType === "bitmap") {
			if (item.name.firstName() === UnexportFname)
				ret = UITypes.Nod;
			else
				ret = UITypes.Img;
		}
		else
			ret = -1;
		cache[item.name] = ret;
		return ret;
	}
}

var getItemNewData = function (item, itemType, nameHash) {
	var ret = {};
	ret.name = nameHash.getItemNewName(item);
	ret.tp = itemType;
	if (itemType === UITypes.Img) {
		var data = {};
		data.item = item;
		data.originName = item.name;
		data.newName = ret.name;
		allImgArr[allImgArr.length] = data;
	}
	else if (itemType === UITypes.Anm) {
		var timelineData = {};
		ret.timeline = transTimeLine(item.timeline, nameHash);
		ret.frameCount = item.frameCount;
		ret.layerCount = item.layerCount;
	}
	else if (itemType === UITypes.Nod) {
		
	}
	else if (itemType === UITypes.LK) {
		ret.flashName = item.name.firstName().fileName();
		ret.itemName = item.name.lastName();
	}
	return ret;
}

var transTimeLine = function (timeline, nameHash) {
	var curLayer;
	var curFrameIndex;

	var trasLayer = function (layer) {
		var ret = {};
		ret.layerType = layer.layerType;
		ret.visible = layer.visible;
		ret.frameCount = layer.frameCount;

		ret.frames = [];
		for (var i = 0; i < layer.frames.length; i++) {
			var oneFrame = layer.frames[i];
			if (oneFrame.startFrame == i) {
				curFrameIndex = i+1;
				ret.frames[ret.frames.length] = transFrame(oneFrame);
			}
		};

		return ret;
	}
	var transFrame = function (frame) {
		var ret = {};

		ret.name = frame.name;
		ret.startFrame = frame.startFrame;
		ret.duration = frame.duration;
		ret.tweenType = frame.tweenType;
		ret.tweenEasing = frame.tweenEasing;
		ret.labelType = frame.labelType;
		ret.isEmpty = frame.isEmpty;
		ret.elements = [];
		for (var i = 0; i < frame.elements.length; i++) {
			var oneElement = frame.elements[i];
			ret.elements[ret.elements.length] = transElement(oneElement);
		};
		return ret;

	}
	var transElement = function (element) {
		var ret = {};

		var attr = {};
		ret.attr = attr;
		attr.x = element.transformX;
		attr.y = -element.transformY;
		attr.scaleX = element.scaleX;
		attr.scaleY = element.scaleY;
		attr.skewX = element.skewX;
		attr.skewY = element.skewY;
		if (element.colorMode === "tint"
			|| element.colorMode == "advanced") {
			attr.colorAlphaPercent = element.colorAlphaPercent;
			attr.colorRedPercent = element.colorRedPercent;
			attr.colorGreenPercent = element.colorGreenPercent;
			attr.colorBluePercent = element.colorBluePercent;
			attr.colorAlphaAmount = element.colorAlphaAmount;
			attr.colorRedAmount = element.colorRedAmount;
			attr.colorGreenAmount = element.colorGreenAmount;
			attr.colorBlueAmount = element.colorBlueAmount;
		}
		attr.blendMode = element.blendMode;

		var childAttr = {};
		ret.childAttr = childAttr;
		childAttr.x = -element.transformationPoint.x;
		childAttr.y = element.transformationPoint.y;
		childAttr.insName = element.name;
		if (element.elementType === "instance") {
			var tp = checkItemType(element.libraryItem);
			if (tp === UITypes.Img
				|| tp === UITypes.Anm
				|| tp === UITypes.Nod
				|| tp === UITypes.LK ) {
				childAttr.itemName = nameHash.getItemNewName(element.libraryItem);
				childAttr.tp = tp
			}
			else {
				print("waring: unsurport elementType:" + element.elementType + " in timeline:" + timeline.name + " layer:" + curLayer + " frameIndex:" + curFrameIndex)
				childAttr.tp = UITypes.Nod;
			}
		}
		else {
			childAttr.tp = UITypes.Nod;
		}
		return ret;
	}

	var ret = {};
	ret.frameCount = timeline.frameCount;
	ret.layerCount = timeline.layerCount;
	ret.layers = [];
	for (var i = 0; i < timeline.layers.length; i++) {
		var oneLayer = timeline.layers[i];
		curLayer = oneLayer.name;
		ret.layers[ret.layers.length] = trasLayer(oneLayer);
	};


	return ret;
}

var OriginNameHash = function  () {
	this.origin2New = {};
	this.curIndexs ={};
	for (var key in UITypes) {
		this.curIndexs[UITypes[key]] = 0;
	}
}

OriginNameHash.prototype.getNewNameByOrigin = function (originName) {
	return this.origin2New[originName];
}

OriginNameHash.prototype.getNewNameByType = function (itemType) {
	var count = this.curIndexs[itemType] + 1;
	this.curIndexs[itemType] = count;
	var ret = itemType + "_" + count;
	if (itemType === UITypes.Img)
		ret = ret + ".png";
	return ret;
}

OriginNameHash.prototype.getItemNewName = function (item) {
	var name = item.name;
	var newName = this.origin2New[name];
	if (newName !== undefined) 
		return newName;
	else if (name.firstName() === ExportFname) {
		newName = name.lastName();
	}
	else {
		var itemType = checkItemType(item);
		if (itemType !== -1) {
			newName = this.getNewNameByType(itemType);
		}
		else
			newName = -1;
	}
	this.origin2New[name] = newName;
	return newName;
}

var originNameHash = new OriginNameHash();
var exportData = {};
var exportLibs = [];
exportData.library = exportLibs;
var length = library.items.length
for (var i = 0; i < length; i++) {
	var item = library.items[i];
	var itemType = checkItemType(item);
	if (itemType !== -1) {
		exportLibs[exportLibs.length] = getItemNewData(item, itemType, originNameHash);
	}
};


var folderPath =  CONFIG.globalFlaFolder + '/' + FlashName;
var jsonFile = folderPath + "/" +  FlashName + ".json";
print(">>>>>>>>>>>>>>>>>>>>>>>>start write json file:" + jsonFile);
var jsonStr = JSON.stringify(exportData, null, 4);
if (!FLfile.exists(folderPath))
	FLfile.createFolder(folderPath);
FLfile.write(jsonFile, jsonStr);
print(">>>>>>>>>>>>>>>>>>>>>>>>OK");

var nameMapFile = folderPath + "/" + FlashName + "NameMap.json";
print(">>>>>>>>>>>>>>>>>>>>>>>>start write name map file:" + nameMapFile)
FLfile.write(nameMapFile, JSON.stringify(originNameHash.origin2New, null, 4));
print(">>>>>>>>>>>>>>>>>>>>>>>>OK");

print(">>>>>>>>>>>>>>>>>>>>>>>>start export sheet")
for (var i = 0; i < allImgArr.length; i++) {
	var data = allImgArr[i];
	data.item.name = data.newName;
	sheetExporter.addBitmap(data.item);
};
var sheetPath = folderPath + '/' + FlashName + "image.png";
sheetExporter.algorithm  = "basic";
sheetExporter.allowTrimming  = true;
sheetExporter.autoSize  = true;
sheetExporter.borderPadding  = CONFIG.sheetBorder;
sheetExporter.stackDuplicateFrames = true;
sheetExporter.layoutFormat  = "cocos2D v3";
sheetExporter.maxSheetHeight  = CONFIG.sheetMaxH;
sheetExporter.maxSheetWidth  = CONFIG.sheetMaxW;

if (sheetExporter.sheetWidth > sheetExporter.maxSheetWidth
	|| sheetExporter.sheetHeight > sheetExporter.maxSheetHeight)
	print("error: sheet more than " + sheetExporter.maxSheetWidth + "*" + sheetExporter.maxSheetHeight);
else {
	var imageFormat = {};
	imageFormat.format = "png";
	imageFormat.bitDepth = 32;
	imageFormat.backgroundColor = "#00000000";
	sheetExporter.exportSpriteSheet(sheetPath, imageFormat);
}

for (var i = 0; i < allImgArr.length; i++) {
	var data = allImgArr[i];
	data.item.name = data.originName.lastName();
};
print(">>>>>>>>>>>>>>>>>>>>>>>>OK");