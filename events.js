
// flip when clicked
gameManager._deck.getCardList.forEach((card, index) => card.addEventListener('click', () => {
  if(!gameManager._freezeGame) gameManager.handleCardReveal(card);
}))

// mouseenter
gameManager._deck.getCardList.forEach((card, index) => card.addEventListener('mouseenter', () => {
  if(card.getAttribute('active') === 'true') {
    card.classList.toggle('hovered');
  }
}))

// mouseout
gameManager._deck.getCardList.forEach((card, index) => card.addEventListener('mouseout', () => {
  if(card.getAttribute('active') === 'true') {
    card.classList.toggle('hovered');
  }
}))

document.querySelector('#menu-newGame').addEventListener('click', (e) => {e.preventDefault(); MENU_BTN.click(); gameManager.resetGame()});
document.querySelector('#menu-scoreBoard').addEventListener('click', (e) => {e.preventDefault(); MENU_BTN.click(); gameManager.showScoreBoardAsync()});
document.querySelector('#scoreBoardCloseBtn').addEventListener('click', (e) => {e.preventDefault(); gameManager.hideScoreBoard()});
