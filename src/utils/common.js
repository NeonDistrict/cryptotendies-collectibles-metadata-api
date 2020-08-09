function findById(arrayOfObjects, id) {
	// Validation
	if (id <= 0 || arrayOfObjects.length < id) {
		return false;
	}

	// Short-circuit
	if (arrayOfObjects[id-1].id === id) {
		return arrayOfObjects[id-1];
	}

	// Fallback: iteration
	for (let obj of arrayOfObjects) {
		if (obj.id === id) {
			return obj;
		}
	}

	return false;
}

function sendResponse(res, payload) {
	if (typeof payload == 'string') {
		payload = { 'msg' : payload };
	}

	res.send(payload);
	return res.end();
}

module.exports = {
	findById,
	sendResponse
};
