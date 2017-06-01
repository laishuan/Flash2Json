// flash2json.jsfl
if (typeof Flash2Json !== "object") {
    Flash2Json = {};
}
(function () {
	fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/init.jsfl');

	var ExportFname = CONFIG.ExportFname;
	var UnexportFname = CONFIG.UnexportFname;
	var AutoNamePrefix = "auto";
	var UITypes = CONFIG.UITypes;
	var AnmSubTp = CONFIG.AnmSubTp;
	var defaultNodeName = "__DefaultNode";
	var defaultTextName = "__Text";
	var spliteFolder = "library"
	var exportScript = CONFIG.exportScript
	var doc = fl.getDocumentDOM();
	var library = doc.library;
	var FlashName = doc.path.fileName();
	var resFolderPath =  CONFIG.flaFolder + '/' + FlashName;
	var scriptFolderPath = CONFIG.scriptFolder + '/' + FlashName
	var folderPath = exportScript ? scriptFolderPath : resFolderPath
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
					// if (!isMcNode(libraryItem)) {
						// print("name:" + libraryItem.name + " is not node")
						return false
					// }
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
	var mcSptCache = {}
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

		var cacheValue = mcSptCache[item.name];
		if (cacheValue !== undefined) {
			return cacheValue;
		}
		else {
			var ret;
			if (item.timeline.frameCount === 1) {
				var timeline = item.timeline;
				for (var i = 0; i < timeline.layers.length; i++) {
					var oneLayer = timeline.layers[i];
					if (!isLayerSpt(oneLayer)) {
						// print("layer.name:" + oneLayer.name + " is not spt")
						ret = false;
						mcSptCache[item.name] = ret;
						return ret;
					}
				};
				ret = true;
				mcSptCache[item.name] = ret;
				return ret;
			}
			else {
				// print("more than 1 frame")
				ret = false;
				mcSptCache[item.name] = ret;
				return ret;
			}
		}
	}
	var cache = {};
	var checkItemType = function (item) {

		if (item.itemType === "folder")
			return -1;

		var cacheValue = cache[item.name];
		if (cacheValue !== undefined) {
			return cacheValue
		}
		else {
			var ret;
			// print("item.name:" + item.name + " type:" + item.itemType )
			if (item.name.firstName().endsWith(".fla")) {
				ret = UITypes.LK;
			}
			else if (isTypeAnim(item.itemType))	{
				if (isMcNode(item))
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
			else if (item.itemType === "sound")
				ret = UITypes.Musc;
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
			var path = CONFIG.flaFolder + "/" + flashName + "/" + flashName + "NameMap.json";
			if (!FLfile.exists(path))
				alert(flashName + ".fla need run export script");
			data.nameMap = JSON.parse(FLfile.read(path));
		// 	path = CONFIG.flaFolder + "/" + flashName + "/" + flashName + ".json";
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
	var getItemNewData = function (item, itemType, nameHash, FlashName, allImgArr, allMuscArr) {
		var ret = newDataCache[item.name];
		if (!ret) {	
			ret = {};
			ret.name = nameHash.getItemNewName(item);
			ret.tp = itemType;
			if (item.linkageClassName) 
				ret.script = item.linkageClassName
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
			else if (itemType === UITypes.Musc) {
				var suffix;
				if (item.name.lastName().endsWith(".mp3"))
					suffix = ".mp3"
				else if (item.name.lastName().endsWith(".wav"))
					suffix = ".wav"
				else
					alert("unsurport sound type of item:" + item.name);
				var exportPath = resFolderPath + '/' + ret.name + suffix;
				ret.path = FlashName + '/' + ret.name + suffix;
				var data = {};
				data.item = item;
				data.exportPath = exportPath;
				allMuscArr[allMuscArr.length] = data;
			}
			else if (itemType === UITypes.LK) {
				ret.flashName = item.name.firstName().fileName();
				var itemName = item.name.lkItemName();
				var otherFlaData = getOtherFlashData(ret.flashName);
				var newName = otherFlaData.nameMap[itemName];
				if (!newName)
					alert(item.name + ":" + itemName + " not in " + ret.flashName + ".fla, please check and run export script");
				ret.itemName = newName;
			}
			newDataCache[item.name] = ret;
		}
		return ret;
	}

	var transElement = function (element, nameHash, isScene, docHeight) {
		var ret = {};

		var attr = {};
		ret.attr = attr;
		attr.x = element.transformX;
		if (!isScene)
			attr.y = -element.transformY;
		else
			attr.y = -element.transformY + docHeight
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

		var childAttr = {};
		ret.childAttr = childAttr;
		childAttr.x = -element.transformationPoint.x;
		childAttr.y = element.transformationPoint.y;
		childAttr.bound = element.objectSpaceBounds;
		if (element.blendMode === "add")
			childAttr.blendMode = element.blendMode
		if (element.name !== "")
			childAttr.insName = element.name;
		if (element.elementType === "instance") {
			var tp = checkItemType(element.libraryItem);
			var itemName = nameHash.getItemNewName(element.libraryItem);
			childAttr.itemName = itemName;
			childAttr.tp = tp;
			if (tp === UITypes.Anm ) {
				if (element.instanceType === "symbol") {
					if (element.symbolType === "button") {
						childAttr.subTp = AnmSubTp.Btn;
					}
					else if (isMcSpt(element.libraryItem)) {
						childAttr.subTp = AnmSubTp.Spt;
					}
					else if (element.symbolType === "graphic") {
						childAttr.loop = element.loop;
						childAttr.firstFrame = element.firstFrame || 1;
						childAttr.subTp = AnmSubTp.Gra;
					}
					else if (element.symbolType === "movie clip") {
						childAttr.subTp = AnmSubTp.Mov;
					}
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
			childAttr.lineType = element.lineType;
			childAttr.letterSpacing = element.getTextAttr("letterSpacing");
			childAttr.lineSpacing = element.getTextAttr("lineSpacing");
			var offsetX = 0
			var offsetY = 0 //+ childAttr.size*0.25
			// if (childAttr.alignment === "left") {
			// 	// offsetX = -7
			// 	// offsetY = 4
			// }
			childAttr.width = element.width;
			childAttr.height = element.height;
			childAttr.x = childAttr.x - element.objectSpaceBounds.left + offsetX;
			childAttr.y = element.transformationPoint.y - element.objectSpaceBounds.top + offsetX;

		}
		else {
			childAttr.tp = UITypes.Nod;
			childAttr.itemName = defaultNodeName;
		}
		return ret;
	}

	var transTimeLine = function (timeline, nameHash, isScene, docHeight) {
		curTimeLine = timeline;
		var trasLayer = function (layer) {
			var ret = {};
			ret.layerType = layer.layerType;
			ret.visible = layer.visible;
			ret.frameCount = layer.frameCount;
			if (isScene) {
				var index = layer.name.indexOf("#");
				if (index === 0) {
					ret.align = parseFloat(layer.name.slice(index+1))
				} 
			}
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
			if (frame.motionTweenRotate !== "none" 
				&& frame.motionTweenRotate !== "auto" 
				&& frame.motionTweenRotateTimes !== 0) {
				ret.rotateType = frame.motionTweenRotate;
				ret.rotateTimes = frame.motionTweenRotateTimes;
			}
			ret.isEmpty = frame.isEmpty;
			ret.elements = [];
			for (var i = 0; i < frame.elements.length; i++) {
				var oneElement = frame.elements[i];
				ret.elements[ret.elements.length] = transElement(oneElement, nameHash, isScene, docHeight);
			};
			if (frame.soundLibraryItem) {
				ret.soundName = nameHash.getItemNewName(frame.soundLibraryItem);
				ret.soundLoopMode = frame.soundLoopMode;
				ret.soundSync = frame.soundSync;
				ret.soundLoop = frame.soundLoop;
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
				if (itemType === UITypes.Anm)
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

	Flash2Json.export = function (argument) {
		fl.outputPanel.clear();
		var templetContent = FLfile.read(fl.configURI + 'Commands/Flash2Json/templet_lua')
		var sheetExporter = new SpriteSheetExporter;
		sheetExporter.beginExport();
		var allImgArr = [];
		var allMuscArr = [];
		var allScriptArr = []
		allScriptArr[allScriptArr.length] = FlashName
		var originNameHash = new OriginNameHash();
		var exportData = {};

		var exportLibs = {};
		var scene = {};
		var fileInfo = {};
		var linkFiles = [];
		var musicFiles = [];

		var spliteFiles = {};
		exportData.library = exportLibs;
		exportData.fileInfo = fileInfo;
		exportData.scene = scene;
		exportData.linkFiles = linkFiles;
		exportData.musicFiles = musicFiles

		fileInfo.name = doc.name.fileName();
		fileInfo.width = doc.width;
		fileInfo.height = doc.height;
		fileInfo.frameRate = doc.frameRate;

		scene.timeline = transTimeLine(doc.timelines[0], originNameHash, true, doc.height);
		scene.tp = UITypes.Anm;
		scene.name = "scene";

		var length = library.items.length
		var linkFilesCache = {};
		for (var i = 0; i < length; i++) {
			var item = library.items[i];
			var itemType = checkItemType(item);
			if (itemType !== -1) {
				var newData = getItemNewData(item, itemType, originNameHash, FlashName, allImgArr, allMuscArr);
				if (newData.script) {
					allScriptArr[allScriptArr.length] = newData.script
				}
				if (newData.tp !== UITypes.Nod) {
					if (CONFIG.splite) {
						if (newData.tp === UITypes.Anm) {
							var path = spliteFolder + "/" + newData.name;
							if (CONFIG.exportFileType === "lua")
								exportLibs[newData.name] = spliteFolder + "." + newData.name;
							else
								exportLibs[newData.name] = path
							spliteFiles[path] = newData;
						}
						else
							exportLibs[newData.name] = newData;
					}
					else
						exportLibs[newData.name] = newData;
				}
				if (newData.tp === UITypes.LK) {
					if (!linkFilesCache[newData.flashName]) {
						linkFiles[linkFiles.length] = newData.flashName;
						linkFilesCache[newData.flashName] = true;
					}
				}
				if (newData.tp === UITypes.Musc) {
					musicFiles[musicFiles.length] = newData.path
				}
			}
		};

		exportLibs[defaultNodeName] = {
		    "name": defaultNodeName,
		    "tp": UITypes.Nod
		}

		exportLibs[defaultTextName] = {
		    "name": defaultTextName,
		    "tp": UITypes.Txt
		}

		if (!FLfile.exists(resFolderPath))
			FLfile.createFolder(resFolderPath);
		else {
			FLfile.remove(resFolderPath);
			FLfile.createFolder(resFolderPath);
		}

		print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>start write script file")
		if (exportScript && CONFIG.exportFileType === "lua") {
			if (!FLfile.exists(scriptFolderPath))
				FLfile.createFolder(scriptFolderPath);
			
			for (var i = 0; i < allScriptArr.length; i++) {
				var scriptName = allScriptArr[i]
				var scriptPath = scriptFolderPath + '/' + scriptName + ".lua"
				if (!FLfile.exists(scriptPath)) {
					var fileContent = templetContent.replace(/__CLASS_NAME/g, scriptName)
					FLfile.write(scriptPath, fileContent)
				}
				// else
				// 	print(">>" + scriptName + " exists")
			};
		
		}
		print(">>>>>>>>>>>>>>>>>>>>>>>>OK")
		if (CONFIG.splite) {
			var libPath
			// if (CONFIG.exportFileType === "lua") {
			// 	libPath = scriptFolderPath + "/" + spliteFolder
			// }
			// else {
				libPath = resFolderPath + "/" + spliteFolder
			// }
			if (!FLfile.exists(libPath))
				FLfile.createFolder(libPath);
		}

		if (CONFIG.exportFileType === "json") {
			var jsonFile = resFolderPath + "/" +  "FlashInfo" + ".json";
			print(">>>>>>>>>>>>>>>>>>>>>>>>start write json file:" + jsonFile);
			var jsonStr = JSON.stringify(exportData, null, 4);
			FLfile.write(jsonFile, jsonStr);
			if (CONFIG.splite) {
				for (var path in spliteFiles) {
					var jsonFile = resFolderPath + "/" + path + ".json";
					var data = spliteFiles[path];
					var jsonStr = JSON.stringify(data, null, 4);
					FLfile.write(jsonFile, jsonStr);
				}
			}
			print(">>>>>>>>>>>>>>>>>>>>>>>>OK");
		}

		if (CONFIG.exportFileType === "lua") {
			var luaFile = resFolderPath + "/" +  "FlashInfo" + ".lua";
			print(">>>>>>>>>>>>>>>>>>>>>>>>start write lua file:" + luaFile);
			var luaStr = LUA.stringify(exportData);
			FLfile.write(luaFile, luaStr);

			if (CONFIG.splite) {
				for (var path in spliteFiles) {
					var luaFile = resFolderPath + "/" + path + ".lua";
					var data = spliteFiles[path];
					var luaStr = LUA.stringify(data);
					FLfile.write(luaFile, luaStr);
				}
			}

			print(">>>>>>>>>>>>>>>>>>>>>>>>OK");
		}


		var nameMapFile = resFolderPath + "/" + FlashName + "NameMap.json";
		print(">>>>>>>>>>>>>>>>>>>>>>>>start write name map file:" + nameMapFile)
		FLfile.write(nameMapFile, JSON.stringify(originNameHash.origin2New, null, 4));
		print(">>>>>>>>>>>>>>>>>>>>>>>>OK");

		print(">>>>>>>>>>>>>>>>>>>>>>>>start export sound")
		for (var i = 0; i < allMuscArr.length; i++) {
			var data = allMuscArr[i];
			var soundFileURL = data.exportPath;
			var libItem = data.item;
			libItem.exportToFile(soundFileURL)
		};
		print(">>>>>>>>>>>>>>>>>>>>>>>>OK");

		print(">>>>>>>>>>>>>>>>>>>>>>>>start export sheet")
		for (var i = 0; i < allImgArr.length; i++) {
			var data = allImgArr[i];
			data.item.name = data.newName;
			sheetExporter.addBitmap(data.item);
		};
		var sheetPath = resFolderPath + '/' + FlashName + "image";
		var sheetConfig = CONFIG.sheetConfig;
		for (var k in sheetConfig) {
			sheetExporter[k] = sheetConfig[k];
		}

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
	}
}())
