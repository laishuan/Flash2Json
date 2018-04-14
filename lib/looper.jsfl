// TimeLineLooper.jsfl

if (typeof TimeLineLooper !== "object") {
	TimeLineLooper = {}
}

(function () {
	var space = "    "
	var indexArr = ["layers", "frames", "elements"] 
	var keyArrS = ["layers", "frames", "elements"]
	var keyArr = ["layer", "frame", "element"]
	var suffixBF = "Befor"
	var suffixAF = "After"
	var debug = function (argument) {
		// print(argument)
	}

	var Looper = function () {
		this.callBackHash = []
		this.curIndex = 0
		this.curLevel = 0
		this.curStatus = []
		this.statusQueen = []
		this.recursiveLevel
	}

	Looper.prototype.init = function (data) {
		var arr = [keyArr, keyArrS]
		for (var j = 0; j < arr.length; j++) {
			var curArr = arr[j]
			for (var i = 0; i < curArr.length; i++) {
				var key = curArr[i]
				var keyBF = key + suffixBF
				var keyAF = key + suffixAF
				this.callBackHash[keyBF] = data[keyBF]
				this.callBackHash[keyAF] = data[keyAF]
			}
		}

		this.recursiveLevel = data.level ? data.level : 99
	}


	Looper.prototype.getSpace = function (intent) {
		var ret = '';
		intent = this.curLevel*indexArr.length + intent
	    for (var i = 0; i < intent; i++) {
	    	ret += space;
	    };
	    return ret;
	}

	Looper.prototype.pushCurLevel = function () {
		this.curIndex = 0
		this.statusQueen.push(this.curStatus)
		this.curStatus = []
		this.curLevel = this.curLevel + 1
	}

	Looper.prototype.popCurLevel = function () {
		if (this.curLevel > 0) {
			this.curStatus = this.statusQueen.pop()
			this.curIndex = indexArr.length-1
			this.curLevel = this.curLevel - 1
		}
	}

	Looper.prototype.dealCallBack = function (sufix, arr, enterLoop) {
		sufix = sufix ? sufix : ""
		var key = arr[this.curIndex]
		key = key + sufix
		var f = this.callBackHash[key]
		if (f && is(f) == "function") {
			var arg1 = this.curStatus[0]
			var arg2 = this.curStatus[1]
			var arg3 = this.curStatus[2]
			var arg4 = this.curStatus[3]

			var ret = f(this.curLevel, arg1, arg2, arg3, arg4)
			// debug(this.getSpace(this.curIndex) + "deal call " + key + " curIndex:" + this.curIndex + " curLevel:" + this.curLevel + " result:" + ret)
			return ret
		}
		// else
			// debug(this.getSpace(this.curIndex) + "cant not find call " + key + " curIndex:" + this.curIndex + " curLevel:" + this.curLevel)
		return true
	}

	Looper.prototype.loopByKey = function (obj) {
		var key = indexArr[this.curIndex]
		var arr = obj[key]

		if (key == "frames") {
			arr = []
			for (var i = 0; i < obj[key].length; i++) {
				var frame = obj[key][i]
				if (frame.startFrame === i)
					arr[arr.length] = frame
			}
		}
		debug(this.getSpace(this.curIndex) + "walk:" + key + " curIndex:" + this.curIndex + " arr length:" + arr.length)

		if (is(arr) !== "array" || arr.length === 0) {
			return 
		}
		var isOK
		isOK = this.dealCallBack(suffixBF, keyArrS)
		if (isOK) {		
			for (var i = 0; i < arr.length; i++) {
				var subObj = arr[i]
				this.curStatus[this.curIndex+1] = subObj
				isOK = this.dealCallBack(suffixBF, keyArr, true)
				if (isOK) {
					if (this.curIndex+1 >= indexArr.length) {
						debug(this.getSpace(this.curIndex) + "curLevel:" + this.curLevel + " recursiveLevel:" + this.recursiveLevel)
						if (this.curLevel+1 < this.recursiveLevel) {
							if (subObj.elementType === "instance") {
								var item = subObj.libraryItem
								if (item.itemType == "movie clip" 
									|| item.itemType == 'graphic' 
									|| item.itemType == 'button') {
									debug(this.getSpace(this.curIndex) + "find a item:" + item.name + "start recursive it")
									this.pushCurLevel()
									this.start(item.timeline)
									this.popCurLevel()

								}
							}
						}
					}
					else {
						this.curIndex = this.curIndex + 1
						this.loopByKey(subObj)
						this.curIndex = this.curIndex - 1
					}
					this.dealCallBack(suffixAF, keyArr, true)
				}
			}
		}
		this.dealCallBack(suffixAF, keyArrS)
	}
	Looper.prototype.start = function (timeline) {
		debug(this.getSpace(this.curIndex) + "start with timeline:" + timeline.name)
		this.curStatus[this.curStatus.length] = timeline
		this.loopByKey(timeline)
	}

	TimeLineLooper.trave = function (timeline, data) {
		var looper = new Looper()
		looper.init(data)
		looper.start(timeline)
	}
}())