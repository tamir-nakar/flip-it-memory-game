class GameManager {

  constructor (numPairs) {

    this._deck = new Deck(numPairs);
    this._remainingPairs = numPairs || 9;
    this._freezeGame = false;
  }

  handleCardReveal(card) {

    if(this._deck.isActiveCard(card)) {

      if(this._deck.getRevealedCard) { // this is the second of the pair

        if(this._deck.isMatch(this._deck.getRevealedCard, card)) { // match

          this._deck.makeCardInactive(this._deck.getRevealedCard);
          this._deck.makeCardInactive(card);
          this._deck.setRevealedCard = null;
          this._remainingPairs--;
          this.checkIfWin();
        }

        else { // no match

          this._freezeGame = true;
          setTimeout(()=>{this._deck.flipCard(card, !SHOW)},500);
          setTimeout(()=>{this._deck.flipCard(this._deck.getRevealedCard,!SHOW, REVEALD_CARD); this._freezeGame = false},500);
          console.log('no match');
        }
      }

      else {
         // this is the first card reveald of the pair
        this._deck.setRevealedCard = card;
        this._deck.getRevealedCard.setAttribute('active', false);
      }
    }
  }

  checkIfWin() {

    if(this._remainingPairs === 0) {

      setTimeout(()=>{alert('YOU WIN!')}, 200);
      setTimeout(()=>{this.resetGame()},300);
    }
  }

  resetGame() {

    this._deck.flipBackAllCards();
    this._deck.shuffle();
    this._remainingPairs = this._deck.getNumPairs;
  }

  getCardList() {
    
    return this._deck.getCardList;
  }
}
