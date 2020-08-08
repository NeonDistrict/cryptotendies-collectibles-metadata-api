const path = require('path');
const fs   = require('fs');

const sets    = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/sets.json'), 'utf8'));
const classes = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/classes.json'), 'utf8'));
const boxes   = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/boxes.json'), 'utf8'));
const cards   = JSON.parse(fs.readFileSync(path.join(__dirname, '/../data/cards.json'), 'utf8'));

function convert() {
	let data = [];

	for (let set of sets) {
		let datum = {
			"CLASS_IDS" : [],
			"TOKEN_COUNTS" : [],
			"BOXES" : []
		};

		let classIds = [];
		for (let box of boxes) {
			datum.CLASS_IDS = [...datum.CLASS_IDS, ...box.classIds].unique();
			datum.BOXES.push({
				"NUM_CARDS" : box.numCards,
				"CLASS_IDS" : box.classIds,
				"CLASS_PROBABILITIES" : box.classProbabilities,
				"GUARANTEED_CLASS_IDS" : box.guaranteedClassIds
			});
		}

		/**
		 * MAJOR ASSUMPTION!!
		 * Assumes, right now, that classes are all clustered locally,
		 * with no intermingling between objects of different classes
		 **/
		for (let card of cards) {
			let index = datum.CLASS_IDS.indexOf(card.class);

			if (!datum.TOKEN_COUNTS[index]) {
				datum.TOKEN_COUNTS[index] = 0;
			}

			datum.TOKEN_COUNTS[index]++;
		}

		data.push(datum);
	}

	console.log(JSON.stringify(data));
}

Array.prototype.unique = function() {
	var a = this.concat();
	for(var i=0; i<a.length; ++i) {
		for(var j=i+1; j<a.length; ++j) {
			if(a[i] === a[j]) a.splice(j--, 1);
		}
	}

	return a;
};

convert();
