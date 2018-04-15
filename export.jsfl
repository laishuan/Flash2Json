// export.jsfl

fl.runScript(fl.configURI + 'Commands/Flash2Json/core/flash2json.jsfl');
var doc = fl.getDocumentDOM();
var pathURI = doc.pathURI
fl.saveDocument(doc)


fl.runScript(fl.configURI + 'Commands/Flash2Json/core/PreTrans.jsfl');
PreTrans.trans()
Flash2Json.export()

doc.revert()
