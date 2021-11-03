Function.prototype.bind2 = function (context) {
	if (typeof this !== 'function') {
		throw new Error(
			'Function.prototype.bind - what is trying to be bound is not callable'
		);
	}

	let self = this;
	let args = Array.prototype.slice.call(arguments, 1);

	let fNOP = function () {};

	let fBound = function () {
		let bindArgs = Array.prototype.slice.call(arguments);
		return self.apply(
			this instanceof fNOP ? this : context,
			args.concat(bindArgs)
		);
	};

	fNOP.prototype = this.prototype;
	fBound.prototype = new fNOP();
	return fBound;
};
