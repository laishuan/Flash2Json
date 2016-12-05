// flash2json.jsfl

fl.outputPanel.clear();
fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/init.jsfl');
var doc = fl.getDocumentDOM();
var library = doc.library;
var ExportFname = CONFIG.ExportFname;
var UnexportFname = CONFIG.UnexportFname;
var AutoNamePrefix = "auto";
var FlashName = doc.path.fileName();
var folderPath =  CONFIG.globalFlaFolder + '/' + FlashName;
var sheetExporter = new SpriteSheetExporter;
sheetExporter.beginExport();
var allImgArr = [];
var UITypes = CONFIG.UITypes;
var defaultNodeName = "__DefaultNode";
var defaultTextName = "__Text";

var isTypeAnim = function  (itemType) {
	return (itemType === "movie clip" || itemType === "graphic" || itemType === "button")
}

var floatEqual = function  (f1, f2) {
	var absF = function (num) {
		return num > 0 ? num : -num;
	}
	if (absF(f1 -f2) < 0.001)
		return true;
	return false;
}
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
	var isElmentNode = function (element) {
		var libraryItem = element.libraryItem
		if (element.elementType === "instance") {
			// print("name:" + libraryItem.name + " is instance")
			if (element.instanceType == "symbol"
				&& (isTypeAnim(element.symbolType))) {
				// print("name:" + libraryItem.name + " is movie clip")
				if (!isMcNode(libraryItem)) {
					// print("name:" + libraryItem.name + " is not node")
					return false
				}
			}
			else if (element.instanceType === "bitmap") {
				if (libraryItem.name.firstName() !== UnexportFname) {
					return false
				}
			}
			else
				return false

		}
		else
			return false
		return true
	}
	var isFrameNode = function (frame) {
 		var elements = frame.elements;
 		for (var i = 0; i < elements.length; i++) {
 			var element = elements[i]
 			if (!isElmentNode(element))
 				return false
 		};
 		return true
	}

	var isLayerNode = function (layer) {
		var frame = layer.frames[0];
		return isFrameNode(frame)
	}

	if (item.timeline.frameCount === 1) {
		var timeline = item.timeline;
		for (var i = 0; i < timeline.layers.length; i++) {
			var oneLayer = timeline.layers[i];
			if (!isLayerNode(oneLayer))
				return false
		};
		return true
	}
	else
		return false
}

var isMcSpt = function (item) {
	var isElmentSpt = function (element) {
		var libraryItem = element.libraryItem
		if (element.elementType === "instance") {
			// print("name:" + libraryItem.name + " is instance")
			if (element.instanceType == "symbol"
				&& (isTypeAnim(element.symbolType))) {
				// print("name:" + libraryItem.name + " is movie clip")
				if (!isMcSpt(libraryItem)) {
					// print("name:" + libraryItem.name + " is not Spt")
					return false
				}
				else
				{
					// print("name:" + libraryItem.name + " is Spt")
					return true
				}
			}
			else {
				// print("name:" + libraryItem.name + " is Spt")
				return true
			}
		}
		else
			return true
	}
	var isFrameSpt = function (frame) {
 		var elements = frame.elements;
 		for (var i = 0; i < elements.length; i++) {
 			var element = elements[i]
 			if (!isElmentSpt(element)) {
 				// print("element.index:" + i + " is not spt")
 				return false
 			}
 		};
 		return true
	}

	var isLayerSpt = function (layer) {
		var frame = layer.frames[0];
		return isFrameSpt(frame)
	}

	if (item.timeline.frameCount === 1) {
		var timeline = item.timeline;
		for (var i = 0; i < timeline.layers.length; i++) {
			var oneLayer = timeline.layers[i];
			if (!isLayerSpt(oneLayer)) {
				// print("layer.name:" + oneLayer.name + " is not spt")
				return false
			}
		};
		return true
	}
	else {
		// print("more than 1 frame")
		return false
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
		// print("item.name:" + item.name + " type:" + item.itemType )
		if (isTypeAnim(item.itemType))	{
			if (item.name.firstName().endsWith(".fla"))
			{
				ret = UITypes.LK;
			}
			else if (isMcNode(item))
				ret = UITypes.Nod;
			else if (isMcSpt(item))
				ret = UITypes.Spt
			else
				ret = UITypes.Anm;
		}
		else if (item.itemType === "bitmap") {
			if (item.name.firstName() === UnexportFname)
				ret = UITypes.Nod;
			else if (item.name.firstName().endsWith(".fla"))
			{
				ret = UITypes.LK;
			}
			else
				ret = UITypes.Img;
		}
		else
			ret = -1;
		cache[item.name] = ret;
		return ret;
	}
}

var otherFlashData = {};
var getOtherFlashData = function (flashName) {
	var data = otherFlashData[flashName];
	if (!data) {
		data = {};
		var path = CONFIG.globalFlaFolder + "/" + flashName + "/" + flashName + "NameMap.json";
		if (!FLfile.exists(path))
			alert(flashName + ".fla need run export script");
		data.nameMap = JSON.parse(FLfile.read(path));
	// 	path = CONFIG.globalFlaFolder + "/" + flashName + "/" + flashName + ".json";
	// 	if (!FLfile.exists(path))
	// 		alert(flashName + ".fla need run export script");
	// 	data.json = JSON.parse(FLfile.read(path));
	}
	return data;
}

var newDataCache = {};
var curTimeLine;
var curLayer;
var curFrameIndex;
var getItemNewData = function (item, itemType, nameHash) {
	var ret = newDataCache[item.name];
	if (!ret) {	
		ret = {};
		ret.name = nameHash.getItemNewName(item);
		ret.tp = itemType;
		if (itemType === UITypes.Img) {
			var data = {};
			ret.path = ret.name + '_' + FlashName + ".png";
			data.item = item;
			data.originName = item.name;
			data.newName = ret.path;
			allImgArr[allImgArr.length] = data;
		}
		else if (itemType === UITypes.Anm) {
			ret.timeline = transTimeLine(item.timeline, nameHash, false);
		}
		else if (itemType === UITypes.Spt) {
			// var timeline = item.timeline
			// curTimeLine = timeline;
			// curFrameIndex = 1;
			// var retElements = [];
			// ret.element = retElements;
			// for (var i = timeline.layers.length-1; i >= 0; i--) {
			// 	var oneLayer = timeline.layers[i];
			// 	curLayer = oneLayer;
			// 	var frame = oneLayer.frames[0]
			// 	var elements = frame.elements;
			// 	for (var j = 0; j < elements.length; j++) {
			// 		var element = elements[j]
			// 		var aftTrans = transElement(element, nameHash, false);
			// 		var insName = aftTrans.childAttr.insName
			// 		if (!insName || insName.length === 0) {
			// 			if (frame.name && frame.length > 0) {
			// 				aftTrans.childAttr.insName = frame.name + "__" + (j+1)
			// 			}
			// 		}
			// 		aftTrans.layerType = oneLayer.layerType;
			// 		retElements[retElements.length] = aftTrans
			// 	};
			// };
			ret.timeline = transTimeLine(item.timeline, nameHash, false);
		}
		else if (itemType === UITypes.Nod) {
			
		}
		else if (itemType === UITypes.LK) {
			ret.flashName = item.name.firstName().fileName();
			var itemName = item.name.lkItemName();
			var otherFlaData = getOtherFlashData(ret.flashName);
			var newName = otherFlaData.nameMap[itemName];
			if (!newName)
				alert(itemName + " not in " + ret.flashName + ".fla, please check and run export script");
			ret.itemName = newName;
		}
		newDataCache[item.name] = ret;
	}
	return ret;
}

var transElement = function (element, nameHash, isScene) {
	var ret = {};

	var attr = {};
	ret.attr = attr;
	attr.x = element.transformX;
	if (!isScene)
		attr.y = -element.transformY;
	else
		attr.y = -element.transformY + doc.height
	if (!floatEqual(element.scaleX, 1))
		attr.scaleX = element.scaleX;
	if (!floatEqual(element.scaleY, 1))
		attr.scaleY = element.scaleY;
	if (!floatEqual(element.skewX, 0))
		attr.skewX = element.skewX;
	if (!floatEqual(element.skewY, 0))
		attr.skewY = element.skewY;
	if (element.colorMode === "alpha")
		attr.alpha = element.colorAlphaPercent/100*255;

	if (element.colorMode === "tint"
		|| element.colorMode == "advanced") {
		attr.rp = element.colorRedPercent;
		attr.gp = element.colorGreenPercent;
		attr.bp = element.colorBluePercent;
		if (attr.rp < 0) {
			attr.rp = 0
		}
		if (attr.gp < 0) {
			attr.gp = 0
		}
		if (attr.bp < 0) {
			attr.bp = 0
		}
		attr.aa = element.colorAlphaAmount;
		attr.ra = element.colorRedAmount;
		attr.ga = element.colorGreenAmount;
		attr.ba = element.colorBlueAmount;
	}
	attr.blendMode = element.blendMode;

	var childAttr = {};
	ret.childAttr = childAttr;
	childAttr.x = -element.transformationPoint.x;
	childAttr.y = element.transformationPoint.y;
	if (element.name !== "")
		childAttr.insName = element.name;
	if (element.elementType === "instance") {
		var tp = checkItemType(element.libraryItem);
		var itemName = nameHash.getItemNewName(element.libraryItem);
		childAttr.itemName = itemName;
		childAttr.tp = tp;
		if (tp === UITypes.Anm ) {
			if (element.loop) {
				childAttr.loop = element.loop;
				childAttr.firstFrame = element.firstFrame || 1;
			}
		}
		else if (tp === UITypes.Img) {
		}
		else if (tp === UITypes.LK) {
		}
		else if (tp === UITypes.Nod) {
			childAttr.tp = UITypes.Nod;
			childAttr.itemName = defaultNodeName;
		}
		else if (tp === UITypes.Spt) {

		}
		else {
			print("waring: unsurport elementType:" + element.elementType + " in timeline:" + curTimeLine.name + " layer:" + curLayer + " frameIndex:" + curFrameIndex)
			childAttr.tp = UITypes.Nod;
			childAttr.itemName = defaultNodeName;
		}
	}
	else if (element.elementType === "text" ) {
		childAttr.tp = UITypes.Txt;
		childAttr.itemName = defaultTextName;
		childAttr.txt = element.getTextString();
		// childAttr.txt = childAttr.txt.tounicode()
		childAttr.size = element.getTextAttr("size");
		childAttr.face = element.getTextAttr("face");
		var fillColor = element.getTextAttr("fillColor");
		childAttr.r = "0x" + fillColor.slice(1,3);
		childAttr.g = "0x" + fillColor.slice(3,5);
		childAttr.b = "0x" + fillColor.slice(5,7);
		childAttr.alignment = element.getTextAttr("alignment");
		childAttr.width = element.objectSpaceBounds.right;
		childAttr.height = element.objectSpaceBounds.bottom;
	}
	else {
		childAttr.tp = UITypes.Nod;
		childAttr.itemName = defaultNodeName;
	}
	return ret;
}

var transTimeLine = function (timeline, nameHash, isScene) {
	curTimeLine = timeline;
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
		if (frame.name !== "")
			ret.name = frame.name;
		ret.startFrame = frame.startFrame;
		ret.duration = frame.duration;
		if (frame.tweenType !== "none")
			ret.tweenType = frame.tweenType;
		if (frame.tweenEasing !== 0)
			ret.tweenEasing = frame.tweenEasing;
		if (frame.labelType !== "none")
			ret.labelType = frame.labelType;
		ret.isEmpty = frame.isEmpty;
		ret.elements = [];
		for (var i = 0; i < frame.elements.length; i++) {
			var oneElement = frame.elements[i];
			ret.elements[ret.elements.length] = transElement(oneElement, nameHash, isScene);
		};
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
	// if (itemType === UITypes.Img)
	// 	ret = ret + '_' + FlashName + ".png";
	return ret;
}

OriginNameHash.prototype.getItemNewName = function (item) {
	var name = item.name;
	var newName = this.origin2New[name];
	if (newName !== undefined) 
		return newName;
	else {
		var itemType = checkItemType(item);
		if (name.firstName() === ExportFname) {
			if (itemType === UITypes.Anm
				|| itemType === UITypes.Spt)
				newName = name.lastName();
			else
				newName =  this.getNewNameByType(itemType);
		}
		else {
			if (itemType !== -1) {
				newName = this.getNewNameByType(itemType);
			}
			else
				newName = -1;
		}
	}
	this.origin2New[name] = newName;
	return newName;
}

var originNameHash = new OriginNameHash();
var exportData = {};

var exportLibs = {};
var scene = {};
var fileInfo = {};
var linkFiles = [];

exportData.library = exportLibs;
exportData.fileInfo = fileInfo;
exportData.scene = scene;
exportData.linkFiles = linkFiles;

fileInfo.name = doc.name.fileName();
fileInfo.width = doc.width;
fileInfo.height = doc.height;
fileInfo.frameRate = doc.frameRate;

scene.timeline = transTimeLine(doc.timelines[0], originNameHash, true);
scene.tp = UITypes.Anm;
scene.name = "scene";

var length = library.items.length
var linkFilesCache = {};
for (var i = 0; i < length; i++) {
	var item = library.items[i];
	var itemType = checkItemType(item);
	if (itemType !== -1) {
		var newData = getItemNewData(item, itemType, originNameHash);
		if (newData.tp !== UITypes.Nod)
			exportLibs[newData.name] = newData;
		if (newData.tp === UITypes.LK) {
			if (!linkFilesCache[newData.flashName]) {
				linkFiles[linkFiles.length] = newData.flashName;
				linkFilesCache[newData.flashName] = true;
			}
		}
	}
};

exportLibs[defaultNodeName] = {
    "name": defaultNodeName,
    "tp": UITypes.Nod
}

exportLibs[defaultTextName] = {
    "name": defaultNodeName,
    "tp": UITypes.Txt
}

var jsonFile = folderPath + "/" +  FlashName + ".json";
print(">>>>>>>>>>>>>>>>>>>>>>>>start write json file:" + jsonFile);
var jsonStr = JSON.stringify(exportData, null, 4);
if (!FLfile.exists(folderPath))
	FLfile.createFolder(folderPath);
FLfile.write(jsonFile, jsonStr);
print(">>>>>>>>>>>>>>>>>>>>>>>>OK");

var luaFile = folderPath + "/" +  FlashName + ".lua";
print(">>>>>>>>>>>>>>>>>>>>>>>>start write lua file:" + luaFile);
var luaStr = LUA.stringify(exportData);
if (!FLfile.exists(folderPath))
	FLfile.createFolder(folderPath);
FLfile.write(luaFile, luaStr);
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
var sheetPath = folderPath + '/' + FlashName + "image";
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