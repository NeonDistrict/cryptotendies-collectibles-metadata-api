const path = require('path');
const fs   = require('fs');

const sets    = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/sets.json'), 'utf8'));
const classes = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/classes.json'), 'utf8'));
const boxes   = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/boxes.json'), 'utf8'));
const cards   = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cards.json'), 'utf8'));

function getCard(req, res) {
	if (!req.params.id) {
		return sendResponse(res, "Missing :ID parameter");
	}

	let card = findById(cards, parseInt(req.params.id, 10));

	if (!card) {
		return sendResponse(res, "Invalid :ID parameter");
	}

	let set = findById(sets, card.set);
	let _class = findById(classes, card.class);

	let payload = formatOpenSeaMetadata(
		card.name || "CryptoTendie #" + String(card.id),
		card.desc,
		"https://i.imgur.com/" + card.image,
		[
			{
				"display_type": "number",
				"trait_type": "Generation",
				"value": card.set
			},
			{
				"trait_type": "Collection",
				"value": set.name
			},
			{
				"trait_type": "Rarity",
				"value": _class.name
			}
		]
	);

	return sendResponse(
		res,
		payload
	);
}

function getBox(req, res) {
	if (!req.params.id) {
		return sendResponse(res, "Missing :ID parameter");
	}

	let box = findById(boxes, parseInt(req.params.id, 10));

	if (!box) {
		return sendResponse(res, "Invalid :ID parameter");
	}

	let set = findById(sets, box.set);

	let payload = formatOpenSeaMetadata(
		box.name,
		box.desc,
		box.image,
		[
			{
				"display_type": "number",
				"trait_type": "Generation",
				"value": box.set
			},
			{
				"display_type": "number",
				"trait_type": "# Cards",
				"value": box.numCards
			},
			{
				"trait_type": "Collection",
				"value": set.name
			}
		]
	);

	return sendResponse(
		res,
		payload
	);
}

function formatOpenSeaMetadata(name, desc, image, attributes) {
	return {
		"name": name,
		"description": desc || "CryptoTendies are delicious, you should collect them all.",
		"image": image,
		"external_url": "https://tendies.dev",
		"attributes": attributes
	};
}

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
	getCard,
	getBox
};
