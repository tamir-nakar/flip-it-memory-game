class Deck {

  constructor(numPairs) {

    this._numPairs = numPairs || 9;
    this._cardList = document.querySelectorAll('.card');
    this._revealedCard = null; // the (possibly) revealed card in the board
    this.shuffle();
  }

  get getNumPairs() { return this._numPairs; }

  get getCardList() { return this._cardList; }

  get getRevealedCard() { return this._revealedCard; }

  set setRevealedCard(card) { this._revealedCard = card; }

  flipBackAllCards() {

    this._cardList.forEach(card => this.flipCard(card, !SHOW));
  }
  isMatch(card1, card2) {

    return card1.getAttribute('id') === card2.getAttribute('id');
  }

  isActiveCard(card) {

    return card.getAttribute('active') === 'true';
  }

  makeCardActive(card) {

      card.setAttribute('active', true);
  }

  makeCardInactive(card) {

      card.setAttribute('active', false);
  }

  flipCard(card, show, revealedCard) {

    const index = card.getAttribute('index');

    _flipByIndex.call(this, index, show, revealedCard); // private functions should be called like this.
  }

  shuffle() {

    const randArr = [];

    this._cardList.forEach(card => {

      let stop = false;
      while(!stop) {

        let rand = Math.floor(Math.random() * this._numPairs + 1);

        if(!randArr[rand]) {

          randArr[rand] = 1;
          stop = true;
          card.setAttribute('id', rand);
        }

        else if(randArr[rand] === 1) {

          randArr[rand]++;
          stop = true;
          card.setAttribute('id', rand);
        }
      }
    })
  }
}

// private
function _flipByIndex(index, show, revealedCard) {

  const chosenCard = this._cardList[index];
  const cardId = chosenCard.getAttribute('id');
  const newImg = show? `./images/${cardId}.png` : `./images/cover.png`;

  chosenCard.setAttribute('src', newImg);
  if(!show){

    chosenCard.setAttribute('active', true);
  }

  if(revealedCard) {

    this._revealedCard = null;
  }
}
