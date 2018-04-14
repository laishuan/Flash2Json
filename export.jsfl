// export.jsfl

fl.runScript(fl.configURI + 'Commands/Flash2Json/core/flash2json.jsfl');
var doc = fl.getDocumentDOM();
var pathURI = doc.pathURI
fl.saveDocument(doc)
var filePath = pathURI.path()
var fileName = doc.name.fileName()
var newFileURI = filePath + "导出文件." + fileName + ".fla"
FLfile.remove(newFileURI)
FLfile.copy(pathURI, newFileURI)
var newDoc = fl.openDocument(newFileURI)
fl.runScript(fl.configURI + 'Commands/Flash2Json/core/PreTrans.jsfl');
PreTrans.trans(newDoc)
Flash2Json.export(newDoc)

fl.closeDocument(newDoc, false)
FLfile.remove(newFileURI)