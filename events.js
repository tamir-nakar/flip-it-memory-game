
gameManager._deck.getCardList.forEach((card, index) => card.addEventListener('click', () => {
  if(!gameManager._freezeGame) gameManager._deck.flipCard(card, SHOW);
}))

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
