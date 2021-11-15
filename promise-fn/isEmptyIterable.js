function isEmptyIterable(iterable) {
	for (const _ of iterable) {
		return false;
	}

	return true;
}

export default isEmptyIterable;
