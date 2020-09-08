const path = require('path');
const fs   = require('fs');
const util = require('./utils/common.js');

const sets    = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/sets.json'), 'utf8'));
const classes = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/classes.json'), 'utf8'));
const boxes   = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/boxes.json'), 'utf8'));
const cards   = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cards.json'), 'utf8'));

function getCard(req, res) {
	if (!req.params.id) {
		return util.sendResponse(res, "Missing :ID parameter");
	}

	let card = util.findById(cards, parseInt(req.params.id, 10));

	if (!card) {
		return util.sendResponse(res, "Invalid :ID parameter");
	}

	let set = util.findById(sets, card.set);
	let _class = util.findById(classes, card.class);

	let payload = formatOpenSeaMetadata(
		card.name || "CryptoTendie #" + String(card.id),
		card.desc || "A CryptoTendies Collectible Card, the Official Collectible Card Game of the Tendies Ultraverse.",
		"https://cryptotendies.s3.amazonaws.com/" + card.image,
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
			},
			{
				"trait_type": "Flavor",
				"value": card.flavor
			},
			{
				"trait_type": "Seasoning",
				"value": card.seasoning
			},
			{
				"trait_type": "Spiciness",
				"value": card.spiciness
			},
			{
				"trait_type": "Spice Level",
				"value": util.getSpiceLevel(card.spiciness)
			}
		]
	);

	return util.sendResponse(
		res,
		payload
	);
}

function getBox(req, res) {
	if (!req.params.id) {
		return util.sendResponse(res, "Missing :ID parameter");
	}

	let box = util.findById(boxes, parseInt(req.params.id, 10));

	if (!box) {
		return util.sendResponse(res, "Invalid :ID parameter");
	}

	let set = util.findById(sets, box.set);

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

	return util.sendResponse(
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

module.exports = {
	getCard,
	getBox
};
