// Config.jsfl
(function () {
	// body...
	var configPath = fl.configURI + "Commands/Flash2Json/Config.json";
	if (FLfile.exists(configPath)) {
		CONFIG = JSON.parse(FLfile.read(configPath));
	}
	else
	{
		CONFIG = {
		    "flaFolder": "file:///D|/code/cocos/flash/test/res/flashRes",
		    "globalFlaFolder": "file:///D|/code/cocos/flash/test/res/flashRes",
		    "scriptFolder": "file:///D|/code/cocos/flash/test/src/app/flashScript",
		    "ExportFname": "_EPT",
		    "UnexportFname": "_UEPT",
		    "exportSheet":true,
		    "sheetConfig": {
		        "format": "RGBA8888",
		        "layoutFormat": "cocos2D v3",
		        "maxSheetHeight": 2048,
		        "maxSheetWidth": 2048,
		        "algorithm": "maxRects",
		        "autoSize": true,
		        "allowTrimming": false,
		        "allowRotate": false,
		        "stackDuplicateFrames": true,
		        "borderPadding": 0,
		        "shapePadding": 1
		    },
		    "UITypes": {
		        "Img": "Image",
		        "Anm": "Anim",
		        "Txt": "Text",
		        "LK": "Link",
		        "Nod": "Node",
		        "Musc": "Music"
		    },
		    "AnmSubTp" : {
		        "Gra": "Graphic",
		        "Spt": "FSprite",
		        "Mov": "Movieclip",
		        "Btn": "Button"
		    },
		    "splite": true,
		    "exportFileType": "lua",
		    "exportScript": true,
		    "showEaSe": true
		};
		FLfile.write(configPath, JSON.stringify(CONFIG, null, 4));
	}
}())
