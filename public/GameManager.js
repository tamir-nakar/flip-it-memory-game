class GameManager {

	constructor(numPairs) {

		this._deck = new Deck(numPairs, isServiceUp);
		this._scoreBoard = new ScoreBoard();
		this._stopWatch = new StopWatch();
		this._remainingPairs = numPairs || 9;
		this._freezeGame = false;
		this._isGameStarted = false;
		this._matchSignal = document.querySelector('#matchSignal');
		this._gameId
		this._isServiceUp = isServiceUp
		if(!isServiceUp){
			console.log('%cService is down, working in offline mode (no scoreboard)', 'background: #b70000; color: white; padding: 2px;');
		}else{
			console.log('%cService is up', 'background: #80ff80; color: #000; padding: 2px;');

		}
	}

	loadBestScore() {

		this._scoreBoard.handleLocalScore();
	}

	handleCardReveal(card) {

		if (!this._isGameStarted) {
			//starting a new game

			_getGameIdFromServerAsync.call(this)
			this._stopWatch.start();
			this._isGameStarted = true;
		}

		if (this._deck.isActiveCard(card)) {

			//setTimeout(this._deck.flipCard(card, SHOW),0);
			this._deck.flipCard(card, SHOW);

			if (this._deck.getRevealedCard) { // this is the second of the pair
				if (this._deck.isMatch(this._deck.getRevealedCard, card)) { // match

					this._deck.makeCardInactive(this._deck.getRevealedCard);
					this._deck.makeCardInactive(card);
					this._remainingPairs--;
					setTimeout(() => _showMatchSignal.call(this), 200);
					this._deck.hideAPair(this._deck.getRevealedCard, card, 1000);
					this._deck.setRevealedCard = null;
					this.checkIfWin();

				} else { // no match

					this._freezeGame = true;
					this._deck.blinkAPair(card, this._deck.getRevealedCard, 1500);
					setTimeout(() => { this._deck.flipCard(card, !SHOW) }, 1500);
					setTimeout(() => {

						this._deck.flipCard(this._deck.getRevealedCard, !SHOW, REVEALD_CARD);
						this._freezeGame = false
					}, 1600);
				}
			} else {
				// this is the first card revealed of the pair
				this._deck.setRevealedCard = card;
				this._deck.getRevealedCard.setAttribute('active', false);
			}
		}
	}

	checkIfWin() {

		if (this._remainingPairs === 0) {

			setTimeout(() => { alert('Congratulations, YOU WIN!') }, 200);
			setTimeout(() => { this.resetGame() }, 300);
		}
	}

	hideAllMenus() {
		_hideAllMenus.call(this);
	}

	async resetGame(isInvokedFromMenu = null) {

		//this._gameId = await _getGameIdFromServer.call(this)
		this._isGameStarted = false;
		this._stopWatch.reset();
		this._deck.unhideAllCards();
		if (!isInvokedFromMenu) { // game Ended
			debugger
			let score = this._stopWatch.getLastRun(); // must be invoked after stopWatch.reset()
			await _validateScoreAsync.call(this, score)
			this._scoreBoard.handleLocalScore(score);
			if(this._isServiceUp){
				await this._scoreBoard.drawAsync(score);
			}
		}
		//this._stopWatch.zerofy();
		this._deck.clearRevealedCard();
		this._deck.flipBackAllCards();
		setTimeout(() => {

			for (let a in [1, 2, 3]) {
				this._deck.shuffle()
			}
		}, 250);
		this._remainingPairs = this._deck.getNumPairs;
	}

	async OnSubmitClickedAsync() {

		const score = this._stopWatch.getLastRun();
		this._scoreBoard.validateAndSubmitAsync(score, this._gameId);
	}

	async showScoreBoardAsync(score = null) {

		_hideAllMenus.call(this);
		if(this._isServiceUp){
			await this._scoreBoard.drawAsync(score);
		}else{
			this.showServerDownPage()
		}
	}

	showDeckSettings() {

		UserDataManager.isMobile()
			? document.querySelector('#customizeButonTd').style.display = 'none'
			: document.querySelector('#customizeButonTd').style.display = 'block'
		_hideAllMenus.call(this);
		document.querySelector('#deckSettings').style.display = 'block';
	}

	showAboutPage() {

		_hideAllMenus.call(this);
		document.querySelector('#about').style.display = 'block';
	}

	showServerDownPage() {

		_hideAllMenus.call(this);
		document.querySelector('#server_down').style.display = 'block';
	}

	async showCreateDeck() {

		let customizedImages = null;

		_hideAllMenus.call(this);
		if (customizedImages = UserDataManager.getCustomizedDeck()) {

			fillImageHolders(customizedImages);
		}
		document.querySelector('#customize').style.display = 'block';
	}

	hideScoreBoard() {

		this._scoreBoard.hide();
	}

	hideServerDownPage() {

		document.querySelector('#server_down').style.display = 'none';
	}

	hideAboutPage() {

		document.querySelector('#about').style.display = 'none';
	}

	hideDeckSettings() {

		document.querySelector('#deckSettings').style.display = 'none';
	}

	hideCreateDeck() {

		document.querySelector('#customize').style.display = 'none';
		this.showDeckSettings();
	}

	setDeckName(deckName) {
		this._deck.setDeckName = deckName;
		gameManager.resetGame(RESET_FROM_MENU)
	}

	changeDeck(deckName) {

		this._deck.changeDeck(deckName);
		this.resetGame(RESET_FROM_MENU);
		_hideAllMenus.call(this);

	}

	getCardList() {

		return this._deck.getCardList();
	}

	loadScoreboardInBackgroundAsync() {
		if(isServiceUp){
			this._scoreBoard.fetchScoresInBackgroundAsync();
		}
	}
}

// private --!

async function _getGameIdFromServerAsync(){

	if(!this._isServiceUp){
		return
	}
	let gameId = null;
	try{
		let response = await fetch('/gameId', {
			method: "GET",
			headers: {
			  "Content-Type": "application/json",
			},
		  });
		  response = await response.json()
		  gameId = response?.gameId
	}catch(e){
		
	}
	this._gameId = gameId
}

async function _validateScoreAsync(score){
	if(!this._isServiceUp){
		return
	}
	try{
		await fetch(`/validate?score=${score}&gameId=${this._gameId}`, {
			method: "GET",
			headers: {
			  "Content-Type": "application/json",
			},
		  });
	}catch(e){
		
	}
}

function _showMatchSignal() {

	this._matchSignal.style.display = 'block';
	setTimeout(() => this._matchSignal.style.display = 'none', 750);
}

function _hideAllMenus() {

	document.querySelector('#customize').style.display = 'none';
	document.querySelector('#deckSettings').style.display = 'none';
	document.querySelector('#about').style.display = 'none';
	document.querySelector('#server_down').style.display = 'none';

	this._scoreBoard.hide();
}
