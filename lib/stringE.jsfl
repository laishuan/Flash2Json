// stringE.jsfl

// (function () {
	String.prototype.path = function () {
		var index = this.lastIndexOf('\\');
		index = (index == -1 ? this.lastIndexOf('/') : index);
		return (index != -1 ? this.slice(0, index+1) : -1);
	}

	String.prototype.firstName = function () {
		var indexS = this.lastIndexOf('\\');
		indexS = (indexS == -1 ? this.lastIndexOf('/') : indexS);
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
// })()