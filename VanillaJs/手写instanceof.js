function myInstanceof(obj, ctr) {
	let proto = Object.getPrototypeOf(obj);
	let prototype = ctr.prototype;
	while (true) {
		if (!proto) return false;
		if (proto === prototype) return true;
		proto = Object.getPrototypeOf(proto);
	}
}

