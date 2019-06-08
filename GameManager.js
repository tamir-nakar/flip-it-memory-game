class GameManager {

  constructor (numPairs) {

    this._deck = new Deck(numPairs);
    this._scoreBoard = new ScoreBoard();
    this._remainingPairs = numPairs || 9;
    this._freezeGame = false;
  }

  handleCardReveal(card) {

    if(this._deck.isActiveCard(card)) {

      //setTimeout(this._deck.flipCard(card, SHOW),0);
      this._deck.flipCard(card, SHOW);

      if(this._deck.getRevealedCard) { // this is the second of the pair
        if(this._deck.isMatch(this._deck.getRevealedCard, card)) { // match

          console.log('-MATCH-');
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
          console.log('-NO MATCH-');
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
    setTimeout(()=>{for(let a in [1,2,3]) {this._deck.shuffle()}},250);
    this._remainingPairs = this._deck.getNumPairs;
  }

  async showScoreBoardAsync () {
      alert(JSON.stringify(await this._scoreBoard.getScoresAsync()));
  }

  getCardList() {

    return this._deck.getCardList;
  }
}
