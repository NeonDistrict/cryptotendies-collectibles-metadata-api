const path = require('path');
const fs   = require('fs');
const util = require('./utils/common.js');

const sets      = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/sets.json'), 'utf8'));
const classes   = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/classes.json'), 'utf8'));
const boxes     = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/boxes.json'), 'utf8'));
const cards     = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cards.json'), 'utf8'));
const contracts = JSON.parse(fs.readFileSync(path.join(__dirname, '/../config/contracts.json'), 'utf8'));

const INVERSE_BASIS_POINTS = 10000;

function getBoxes(req, res) {
	let parsed = [];
	for (let box of boxes) {
		let parsedBox = Object.assign({}, box);

		let set = util.findById(sets, box.set);

		parsedBox.setName = set.name;
		parsedBox.setId = set.id;
		parsedBox.classes = box.classIds.map((classId) => {
			let _class = util.findById(classes, classId);
			return _class.name;
		});
		parsedBox.guaranteedClasses = box.guaranteedClassIds.map((classId) => {
			let _class = util.findById(classes, classId);
			return _class.name;
		});
		parsedBox.probabilities = box.classProbabilities.map((_prob) => _prob / INVERSE_BASIS_POINTS);

		delete parsedBox.set;
		delete parsedBox.classIds;
		delete parsedBox.guaranteedClassIds;
		delete parsedBox.classProbabilities;

		parsed.push(parsedBox);
	}

	return util.sendResponse(res, parsed);
}

function getCards(req, res) {
	let parsed = [];
	for (let card of cards) {
		let parsedCard = Object.assign({}, card);

		let set = util.findById(sets, card.set);
		let _class = util.findById(classes, card.class);

		parsedCard.setName = set.name;
		parsedCard.setId = set.id;
		parsedCard.class = _class.name;
		parsedCard.image = "https://i.imgur.com/" + parsedCard.image;

		parsed.push(parsedCard);
	}

	return util.sendResponse(res, parsed);
}

function getContracts(req, res) {
	return util.sendResponse(res, contracts);
}

module.exports = {
	getBoxes,
	getCards,
	getContracts
};
