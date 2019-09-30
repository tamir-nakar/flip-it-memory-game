class Deck {

  constructor(numPairs) {

    this._numPairs = numPairs || 9;
    this._cardList = document.querySelectorAll('.card');
    this._revealedCard = null; // the (possibly) revealed card in the board
    this._deckName = DECK_1;
    this._customizedCards = [];
    for(let a in [1,2,3,4,5,6]) {this.shuffle()};
  }

  get getNumPairs() { return this._numPairs; }

  get getCardList() { return this._cardList; }

  get getRevealedCard() { return this._revealedCard; }

  set setRevealedCard(card) { this._revealedCard = card; }

  set setDeckName(deckName) {this._deckName = deckName;}

  blinkAPair(card1, card2, time) {

        setTimeout(()=> _startBlinking.call(this, card1, card2), 500);
        setTimeout(()=>_stopBlinking.call(this, card1, card2), time);
  }

  clearRevealedCard() {

    this._revealedCard = null;
  }

  changeDeck(deckName) {

   if(this._deckName !== deckName) {
        //this func should be moved to DeckCustomizer
        this._deckName = deckName;
        this._cardList.forEach(card => { // - refactor


            const newImgBack = `./images/${this._deckName}/cover.png`;
            const newImgFront = `./images/${this._deckName}/${card.id}.png`;

            const back = card.querySelector('.card-back');
            const front = card.querySelector('.card-front');
            back.setAttribute('src', newImgBack);
            front.setAttribute('src', newImgFront);

        })
   }
  }

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

    this._cardList.forEach(card => { // after we messed out the id's of the card, we match apropirate img to each id

      if([DECK_1, DECK_2].includes(this._deckName)) {

          const newImg = `./images/${this._deckName}/${card.id}.png`;
          const front = card.querySelector('.card-front');
          front.setAttribute('src', newImg);
      }else { // customized

        const newImg = imagesArr[card.id - 1].src;
        const front = card.querySelector('.card-front');
        front.setAttribute('src', newImg);
      }
    });
  }

  generateCards() {

    let id = 1;

    for(i=0; i<numPairs; i++) {

      _generateCard.call(this, idx, id); // idx: 0, id: 1
      _generateCard.call(this, idx + 1, id); // idx: 1, id: 1
      id ++;

    }
  }

  hideAPair(card1, card2, time = 0) {

      setTimeout(() => card1.style.visibility = 'hidden', time)
      setTimeout(() => card2.style.visibility = 'hidden', time)
  }

  unhideAllCards() {
    // the timeout is nessecery so we can be sure that hideAPair func couldnt be ivnvoked AFTER this func
    setTimeout( () =>this._cardList.forEach( card => card.style.visibility = 'visible'), 1050)
  }
}

// private
function _flipByIndex(index, show, revealedCard) {

  const chosenCard = this._cardList[index];
  const cardId = chosenCard.getAttribute('id');

  chosenCard.querySelector('input').checked = show;
  if(!show){

    chosenCard.setAttribute('active', true);
  }

  if(revealedCard) {

    this._revealedCard = null;
  }
}

function _stopBlinking(card1, card2) {

    card1.querySelector(".card-front").classList.remove("fastBlinking");
    card2.querySelector(".card-front").classList.remove("fastBlinking");
    card1.querySelector(".card-back").classList.remove("fastBlinking");
    card2.querySelector(".card-back").classList.remove("fastBlinking");
}

function _startBlinking(card1, card2) {

    card1.querySelector(".card-front").classList.add("fastBlinking");
    card2.querySelector(".card-front").classList.add("fastBlinking");
    card1.querySelector(".card-back").classList.add("fastBlinking");
    card2.querySelector(".card-back").classList.add("fastBlinking");
}
