// stringE.jsfl

(function () {
	String.prototype.path = function () {
		var index = this.lastIndexOf('\\');
		index = (index == -1 ? this.lastIndexOf('/') : index);
		return (index != -1 ? this.slice(0, index+1) : -1);
	}

	String.prototype.lkItemName = function () {
		var index = this.indexOf('\\');
		index = (index == -1 ? this.indexOf('/') : index);
		return (index != -1 ? this.slice(index+1) : -1);
	}

	String.prototype.firstName = function () {
		var indexS = this.indexOf('\\');
		indexS = (indexS == -1 ? this.indexOf('/') : indexS);
		if (indexS !== -1) {
			return this.slice(0, indexS);
		}
		return this.valueOf();
	}

	String.prototype.lastName = function () {
		var indexS = this.lastIndexOf('\\');
		indexS = (indexS == -1 ? this.lastIndexOf('/') : indexS);
		if (indexS !== -1) {
			return this.slice(indexS+1);
		}
		return this.valueOf();
	}

	String.prototype.fileName = function () {
		var indexS = this.lastIndexOf('\\');
		indexS = (indexS == -1 ? this.lastIndexOf('/') : indexS);
		var indexE = this.lastIndexOf('.');
		if (indexE != -1) {
			var ret = this.slice(indexS+1, indexE);
			var index = ret.indexOf(".");
			if (index === -1) 
				return ret;
			else
				return ret.slice(index + 1);
		}
		else
			return -1;
	}

	String.prototype.endsWith = function(end) {
		if(end == '') return true;
		else if(end == null || end.length > this.length) return false;
	    else return this.indexOf(end, this.length - end.length) !== -1;
	}

	String.prototype.tounicode = function ()
	{
	   if(this == '') return this;
	   var str =''; 
	   for(var i=0;i<this.length;i++)
	   {
	      str+="\\u"+parseInt(this[i].charCodeAt(0),10).toString(16);
	   }
	   return str;
	}

	String.prototype.isChinese = function () {
	　　var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
	　　if(reg.test(this)){
			return true
		}
		return false
	}
}())