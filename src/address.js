const path  = require('path');
const fs    = require('fs');
const axios = require('axios');
const util  = require('./utils/common.js');

const sets      = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/sets.json'), 'utf8'));
const classes   = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/classes.json'), 'utf8'));
const boxes     = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/boxes.json'), 'utf8'));
const cards     = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cards.json'), 'utf8'));
const contracts = JSON.parse(fs.readFileSync(path.join(__dirname, '/../config/contracts.json'), 'utf8'));

const networkNames = {
	'1' : 'eth',
	'4' : 'rinkeby'
};
const networkIds = Object.keys(networkNames);

const apiEndpoint = process.env.API_ENDPOINT;

async function getAddress(req, res) {
	if (
		!req.params.network ||
		networkIds.indexOf(req.params.network) === -1
	) {
		return util.sendResponse(res, "Missing :network parameter");
	}

	if (
		!req.params.address ||
		!req.params.address.match(/^0x[a-fA-F0-9]{40}$/)
	) {
		return util.sendResponse(res, "Missing :address parameter");
	}

	let network = networkNames[req.params.network];
	let address = req.params.address;

	try {

		// Prep the URL
		let apiUrl = apiEndpoint.replace('{networkName}', network).replace('{address}', address);

		// Get the boxes
		let contractBox = contracts['tendiesBox'][req.params.network];
		let responseBox = await axios.get(apiUrl.replace('{contract}', contractBox), {timeout: 2500});

		let boxes = [];
		if (
			responseBox.data.hasOwnProperty('data') &&
			responseBox.data.data.hasOwnProperty('tokens') &&
			responseBox.data.data.tokens.length
		) {
			boxes = responseBox.data.data.tokens;
		}

		let contractCard = contracts['tendiesCard'][req.params.network];
		let responseCard = await axios.get(apiUrl.replace('{contract}', contractCard), {timeout: 2500});

		let cards = [];
		if (
			responseCard.data.hasOwnProperty('data') &&
			responseCard.data.data.hasOwnProperty('tokens') &&
			responseCard.data.data.tokens.length
		) {
			cards = responseCard.data.data.tokens;
		}

		return util.sendResponse(
			res,
			{
				'boxes' : boxes,
				'cards' : cards
			}
		);
	} catch (ex) {
		console.error(ex);
		return util.sendResponse(
			res,
			{'error' : 'Could not retrieve address.'}
		);
	}

	return util.sendResponse(
		res,
		{'error' : 'Unknown path'}
	);
}


module.exports = {
	getAddress
};
