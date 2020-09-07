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

function getSpiceLevel(spiciness) {
	let spices = ["Wimpy","Cruisin'","Red Chile","Habanero","Ghost"];
	return spices.indexOf(spiciness) + 1; // Yes, this is 0 if non-existent
}

module.exports = {
	findById,
	sendResponse,
	getSpiceLevel
};
