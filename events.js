
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

document.querySelector('#menu-newGame').addEventListener('click', (e) => {e.preventDefault(); MENU_BTN.click(); gameManager.resetGame(RESET_FROM_MENU)});
document.querySelector('#menu-scoreBoard').addEventListener('click', (e) => {e.preventDefault(); MENU_BTN.click(); gameManager.showScoreBoardAsync()});
document.querySelector('#menu-about').addEventListener('click', (e) => {e.preventDefault(); MENU_BTN.click(); gameManager.showAboutPage()});
document.querySelector('#menu-deckSettings').addEventListener('click', (e) => {e.preventDefault(); MENU_BTN.click(); gameManager.showDeckSettings()});
document.querySelector('#cusomizeButton').addEventListener('click', (e) => {e.preventDefault(); gameManager.showCreateDeck()});
document.querySelector('#southparkButton').addEventListener('click', (e) => {e.preventDefault(); gameManager.changeDeck(DECK_1)});
document.querySelector('#marvelButton').addEventListener('click', (e) => {e.preventDefault(); gameManager.changeDeck(DECK_2)});
document.querySelector('#scoreBoardCloseBtn').addEventListener('click', (e) => {e.preventDefault(); gameManager.hideScoreBoard()});
document.querySelector('#deckSettingsCloseBtn').addEventListener('click', (e) => {e.preventDefault(); gameManager.hideDeckSettings()});
document.querySelector('#aboutCloseBtn').addEventListener('click', (e) => {e.preventDefault(); gameManager.hideAboutPage()});
document.querySelector('#createDeckCloseBtn').addEventListener('click', (e) => {e.preventDefault(); gameManager.hideCreateDeck()});
document.querySelector('#scoreBoardSubmitBtn').addEventListener('click', (e) => {e.preventDefault(); gameManager.OnSubmitClickedAsync()});
document.querySelector('#customizeConfirmBtn').addEventListener('click', (e) => {e.preventDefault(); resetCards(); gameManager.setDeckName(DECK_CUSTOMIZED)});
document.querySelector('#customizeClearBtn').addEventListener('click', (e) => {e.preventDefault(); clearImageHolders(); });
