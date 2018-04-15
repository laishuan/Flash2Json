// test.jsfl

fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/init.jsfl');
fl.outputPanel.clear();
fl.runScript(fl.configURI + 'Commands/Flash2Json/lib/init.jsfl');
// fl.createDocument();
// var doc = fl.getDocumentDOM();
// var pathURI = doc.pathURI
// var library = doc.library;
// var selItems = library.getSelectedItems();
// var newDoc = fl.createDocument("timeline");
// for (var i = 0; i < selItems.length; i++) {
// 	var item = selItems[i]
// 	newDoc.addItem({x:0,y:0}, item)
// }
// fl.openDocument(pathURI)

var doc = fl.getDocumentDOM();
// var pathURI = doc.pathURI
// fl.saveDocument(doc)
// var filePath = pathURI.path()
// var fileName = doc.name.fileName()
// FLfile.remove(newFileURI)
// var newFileURI = filePath + ".EXPORT." + fileName + ".fla"
// var isOK = FLfile.copy(pathURI, newFileURI)
// print("copy :" + isOK)
// doc = fl.openDocument(newFileURI)
// //export
doc.addDataToDocument("size", "string", "aaa")
// fl.openDocument(pathURI)