// Config.jsfl

var configPath = fl.configURI + "Commands/Flash2Json/Config.json";
if (FLfile.exists(configPath)) {
	CONFIG = JSON.parse(FLfile.read(configPath));
}
else
{
	CONFIG = {};
	CONFIG.flaFolder = "file:///D|/Flash2Json/Res/";
	CONFIG.globalFlaFolder = CONFIG.flaFolder + "GlabolFla";
	FLfile.write(configPath, JSON.stringify(CONFIG, ref, 4));
}
