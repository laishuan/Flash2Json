// flash2json.jsfl

fl.outputPanel.clear();
fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/init.jsfl');

var ExportFname = "export";
var UnexportFname = "unexport";
var AutoNamePrefix = "auto";
var FlashName = doc.path.fileName();

var UITypes = {
	"Img": "Image",
	"Anm": "Anim",
	"Nod": "Node",
	"Txt": "Text",
	"LK" : "Link"
};

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
		ret.path = FlashName + "image/";
	}
	else if (itemType === UITypes.Anm) {
		ret.timeline = item.timeline;
		ret.frameCount = item.frameCount;
		ret.layerCount = item.layerCount;
	}
	else if (itemType === UITypes.Nod) {
		
	}
	else if (itemType === UITypes.LK) {
		ret.flashName = item.name.fileName();
		ret.itemName = item.name;
	}
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
var keyArr = [
			"",
			"library",
			"name",
			"tp",
			"path",
			"timeline",
			"layers", 
			"frameCount",
			"layerCount",
			"libraryItem",
			"layerType",
			"frameCount",
			"visible",
			"frames",
			"elements",
			"isEmpty",
			"hPixels",
			"vPixels",
			"x",
			"y",
			"scaleX",
			"scaleY",
			"skewX",
			"skewY",
			"transformationPoint",
			"startFrame",
			"duration",
			"tweenType",
			"depth"
			];

var keyInArr = function  (key, arr) {
	for (var i = 0; i < keyArr.length; i++) {
		if (key === arr[i])
			return true;
	};
	return false;
}
var ref = function (key, value) {
	var ret = {};

	if (key === "libraryItem") {
		ret.v = originNameHash.getNewNameByOrigin(value.name);
		ret.t = JsonDealTypes.Deal;
	}
	else if (key === "layer") {
		ret.v = value.name;
		ret.t = JsonDealTypes.Deal;
	}
	else if (key === "brightness" 
			|| key === "tintColor" 
			|| key === "tintPercent"
			|| key === "tintPercent"
			|| key === "actionScript"
			|| key === "packagePaths"
			|| value.elementType == "shape") {	
		ret.t = JsonDealTypes.Skip;
	}
	else if (is(key) === "number") {
		if (value.elements !== undefined) {
			if (value.startFrame === key) {
				ret.t = JsonDealTypes.Deal;
				ret.v = value;
			}
			else
				ret.t = JsonDealTypes.Skip;
		}
		else
		{
				ret.t = JsonDealTypes.Deal;
				ret.v = value;
		}
	}
	else if (keyInArr(key, keyArr)) {
		ret.v = value;
		ret.t = JsonDealTypes.Deal;
	}
	else {
		ret.t = JsonDealTypes.Skip;
	}
	return ret;
}
var jsonStr = JSON.stringify(exportData, ref, 4);
if (!FLfile.exists(CONFIG.globalFlaFolder))
	FLfile.createFolder(CONFIG.globalFlaFolder);
FLfile.write(CONFIG.globalFlaFolder + '/' + FlashName + ".json", jsonStr);
FLfile.write(CONFIG.globalFlaFolder + '/' + FlashName + "NameMap.json", JSON.stringify(originNameHash.origin2New, null, 4));