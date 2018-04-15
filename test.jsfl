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
print(typeof(undefined))
// fl.openDocument(pathURI)

var pathURI = doc.pathURI
print(pathURI)
var sysPath = FLfile.uriToPlatformPath(pathURI.path())
print(sysPath)
print(FLfile.platformPathToURI(sysPath))
print("场景 1".indexOf("场景"))
print("asdfasdf123123/.啊//./".isChinese())

	var transFuncHash = {
		// [CONFIG.UITypes.Img]: 1,
		// [CONFIG.UITypes.ImgTree]: transUIImgTree,
		// [CONFIG.UITypes.Anm]: transUIAnm,
		// [CONFIG.UITypes.Txt]: transUITxt,
		// [CONFIG.UITypes.LK]: transUILK,
		// [CONFIG.UITypes.Nod]: transUINod,
		// [CONFIG.UITypes.Musc]: transUIMusc,
		// [CONFIG.UITypes.UnKnow]: transUIUnKnow
	}

	transFuncHash[CONFIG.UITypes.Img] = 1