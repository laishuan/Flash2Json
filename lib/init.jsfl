fl.outputPanel.clear();
fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/stringE.jsfl');
fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/json2.jsfl');
fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/Config.jsfl');

print = fl.trace;
doc = fl.getDocumentDOM();
library = doc.library;