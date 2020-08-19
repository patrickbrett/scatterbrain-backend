const categories = require('./categories.json');

module.exports = class ScattegoriesHelper {
	categoryLists;

	constructor() {
		this.categoryLists = categories
	}

	getRandomLetter() {
		// excludes: Q, U, V, X, Y, Z
		// in the most inelegant way possible :)
		let str = 'Q';
		while (['Q', 'U', 'V', 'X', 'Y', 'Z'].includes(str)) {
			str = String.fromCharCode(this.getRandomInt(65, 90));
		}
		return str;
	}

	getRandomCategoryList() {
		return this.categoryLists[this.getRandomInt(0, this.categoryLists.length - 1)];
	}

	getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	generateLetterString(length) {
		let str = '';
		for (let i = 0; i < length; i++) {
			str += this.getRandomLetter();
		}
		return str;
	}

	generateGameCode() {
		return this.generateLetterString(4);
	}

	generatePlayerCode() {
		return this.generateLetterString(8);
	}

	generateHostCode() {
		return this.generateLetterString(8);
	}
};
