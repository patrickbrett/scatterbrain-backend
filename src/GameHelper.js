module.exports = class ScattegoriesHelper {
  categoryLists;

  constructor() {
    this.categoryLists = [
      {
        name: "List 1",
        categories: [
          "Words relating to sport",
          "Cooking shows",
          "Hot drinks",
          "European capital cities",
          "Political leaders",
          "Words relating to Christmas",
          "Types of punctuation",
          "Units of measurement",
          "Musical instruments",
          "Metals"
        ]
      },
      {
        name: "List 2",
        categories: [
          "Internal organs",
          "Chemicals",
          "Nintendo games",
          "Women's clothing",
          "Household appliances",
          "Things that are made of glass",
          "Rappers",
          "Famous book characters",
          "Asian countries",
          "Boys' names"
        ]
      },
      {
        name: "List 3",
        categories: [
          "Medical equipment",
          "Reality TV shows",
          "Words relating to tennis",
          "Beer brands",
          "Types of cheese",
          "Words that begin with 'mis'",
          "Australian cities",
          "Nursery rhymes",
          "Insects",
          "Things you would find in a park"
        ]
      },
      {
        name: "List 4",
        categories: [
          "Words relating to religion",
          "Car brands",
          "Countries",
          "Things that are flat",
          "Periodic table elements",
          "Things that go fast",
          "Classical composers",
          "Animals",
          "Hobbies",
          "Words with double letters"
        ]
      },
    ]
  }

  getRandomLetter() {
    return String.fromCharCode(this.getRandomInt(65, 90));
  }

  getRandomCategoryList() {
    return this.categoryLists[this.getRandomInt(0, this.categoryLists.length - 1)];
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  generateLetterString(length) {
    let str = '';
    for (let i=0; i<length; i++) {
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
}