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
		    "flaFolder": "file:///D|/Flash2Json/Res/",
		    "globalFlaFolder": "file:///D|/Flash2Json/Res/GlabolFla",
		    "ExportFname": "export",
		    "UnexportFname": "unexport",
		    "sheetMaxH": 2048,
		    "sheetMaxW": 2048,
		    "sheetBorder":2,
		    "UITypes": {
				"Img": "Image",
				"Anm": "Anim",
				"Nod": "Node",
				"Txt": "Text",
				"LK" : "Link"
		    }
		};
		FLfile.write(configPath, JSON.stringify(CONFIG, null, 4));
	}
}())
