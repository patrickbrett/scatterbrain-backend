module.exports = class ScattegoriesHelper {
	categoryLists;

	constructor() {
		this.categoryLists = [
			{
				name: 'List 1',
				categories: [
					'Words relating to sport',
					'Cooking shows',
					'Hot drinks',
					'European capital cities',
					'Political leaders',
					'Words relating to Christmas',
					'Types of punctuation',
					'Units of measurement',
					'Musical instruments',
					'Metals',
				],
			},
			{
				name: 'List 2',
				categories: [
					'Internal organs',
					'Chemicals',
					'Nintendo games',
					"Women's clothing",
					'Household appliances',
					'Things that are made of glass',
					'Rappers',
					'Famous book characters',
					'Asian countries',
					"Boys' names",
				],
			},
			{
				name: 'List 3',
				categories: [
					'Medical equipment',
					'Reality TV shows',
					'Words relating to tennis',
					'Beer brands',
					'Types of cheese',
					'Fruits',
					'Australian cities',
					'Nursery rhymes',
					'Insects',
					'Things you find in a park',
				],
			},
			{
				name: 'List 4',
				categories: [
					'Words relating to religion',
					'Car brands',
					'Countries',
					'Things that are flat',
					'Periodic table elements',
					'Things that go fast',
					'Classical composers',
					'Animals',
					'Hobbies',
					'Words with double letters',
				],
			},
			{
				name: 'List 5',
				categories: [
					'US states',
					'Toys',
					'Things that are sharp',
					'Australian bands',
					'Apple products',
					'Interjections',
					'Foreign-language movies',
					'2010s pop songs',
					'Things you find in soup',
					'Vegetables',
				],
			},
			{
				name: 'List 6',
				categories: [
					'Nationalities',
					'Adverbs',
					"Things that don't move",
					'Rock bands',
					'Colours',
					'Things found in a kitchen',
					'Pizza toppings',
					'Things you take camping',
					'US presidents',
					'Famous DJs',
				],
			},
			{
				name: 'List 7',
				categories: [
					'Foreign words used in English',
					'Words relating to construction',
					'Things you find in a car',
					'Things that are spicy',
					'Six letter words',
					'Gifts',
					'Villains',
					'Breakfast foods',
					'Tools',
					'Things you do at work',
				],
			},
			{
				name: 'List 8',
				categories: [
					'Things that are cold',
					'School subjects',
					'Things that are sticky',
					'Alcoholic drinks',
					'Excuses for being late',
					'Ice cream flavours',
					'Crimes',
					"Words ending in 'ing'",
					'Things to do at a party',
					'Things that can get you fired',
				],
			},
			{
				name: 'List 9',
				categories: [
					'Famous duos and trios',
					'Reasons to make a phone call',
					'Board games',
					'Things that make you smile',
					'Reptiles or amphibians',
					'Cartoon characters',
					'Tourist attractions',
					'Things that are square',
					'Video games',
					'Things that have wheels',
				],
			},
			{
				name: 'List 10',
				categories: [
					'Animal noises',
					'Occupations',
					'Household chores',
					'Insects',
					'Titles people can have',
					'Flowers',
					'Historic events',
					'Types of weather',
					'Reasons to call the police',
					'Authors',
				],
			},
		];
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
