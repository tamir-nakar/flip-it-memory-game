
class ScoreBoard {

    constructor(cacheTtlMin) {

        this._cacheTtlMin = _minToMsec.call(this, cacheTtlMin) || _minToMsec.call(this, 1);
        this._requestUrl = 'https://savant-server.herokuapp.com/db/scoreboards/memory';
        this._cachedResutls = null;
        this._lastReqTimestamp = null;
        this._scoreBoardTableElem = document.querySelector("#scoreBoardTable");
        this._scoreBoardDivElem = document.querySelector("#scoreBoard");
        this._submitBtnElem = document.querySelector("#scoreBoardSubmitBtn");
        this._msgAreaElem = document.querySelector("#scoreBoardMsgArea");
    }

    async validateAndSubmitAsync(score) {
        // called when user pressed 'submit' on table.
        const name = document.querySelector("#nameInput").value;
        const invalidNameMsg = [];

        if(_isValidName.call(this, name, invalidNameMsg)) {

            this._msgAreaElem.innerHTML = '';
            const dataToSubmit = _prepareDataToSubmit.call(this, name, score);
            console.log(`the data we try to submit is : ${dataToSubmit}`);
            try {

                _submitDataAsync.call(this, dataToSubmit);
            } catch(e) {

            }
            _displayOrHideTable.call(this, !SHOW);
        } else { // name is invalid

            this._msgAreaElem.innerHTML = invalidNameMsg[0];
        }
    }

    async drawAsync(score = null) { // called when userChoose to showTable or when a game is over

        let index = null;
        let isScoreAddedToTable = false;
        const scoresArr = await _getTopScoresAsync.call(this);

        _cleanTable.call(this);
        if(scoresArr) {

            console.log(`ScoreBoard: the scores: ${JSON.stringify(scoresArr)}`)
            if(score === null) { // just present table (probably user chose showScoreboard)

                this._msgAreaElem.innerHTML = '';
                _draw.call(this, scoresArr);
            } else { // There is a score to (maybe) insert the table

                if(scoresArr &&
                    (scoresArr.length === 0 ||
                    _getAbsoluteValue.call(this, scoresArr[scoresArr.length - 1].Score) > _getAbsoluteValue.call(this, score)) ||
                    scoresArr.length < SCOREBOARD_LENGTH
                )
                      {
                         // if qualified to enter the table
                         index = _getIndexInTable.call(this, score, scoresArr);
                         _draw.call(this, scoresArr, index, score)// present table with textArea
                         console.log(`you are in number: ${index}`);
                         isScoreAddedToTable = true; // qualified to the table
                     }
            }
        } // else present no results for now please try in a moment
        return isScoreAddedToTable;
    }

    hide(){

        _displayOrHideTable.call(this, !SHOW);
    }
}


// private --!

async function _submitDataAsync(dataToSubmit) {

    fetch(this._requestUrl, {
  method: 'POST',
  body: JSON.stringify(dataToSubmit),
  headers:{
    'Content-Type': 'application/json'
  }
})
}

function _isValidName(name, invalidNameOutputArr) {

    const invalidChars = /[|!|@|#|^|\&|\*|\(|\)|_|=|\{|\}|\[|\]|\\|:|;|“|‘|<|>|,|\?|\/|`]/;
    isValid = true;

    if(!name || name === '') {

        invalidNameOutputArr.push('Name section must not remain empty');
        isValid = false;
    } else if(name.match(invalidChars)) {
        invalidNameOutputArr.push('Name section contains invalid characters');
        isValid = false;
    }

    return isValid;
}

function _prepareDataToSubmit(name, score) {

    const date = _getCurrentDate.call(this);
    const formattedScore = `00:${score}`; //db saves also houres

    return [name, formattedScore, date];
}

function _cleanTable() {

    this._scoreBoardTableElem.querySelectorAll('tr.secondaryRow')
    .forEach(node => node.remove());

    this._scoreBoardTableElem.querySelectorAll('#nameInput')
    .forEach(node => node.remove());
}

function _draw(results, idxForNewEnery = null, newEntry = null) {
    // idxForNewEntry is optional - in case we are about to add new score to table
    let tableIndex = 1;
    let isNewEntry = idxForNewEnery !== null;

    if(results && results.length > 0) {

        let isNewEntryAdded = false;

        results.forEach((result) => {

            if(isNewEntry && tableIndex === idxForNewEnery + 1) { // handle new entry to table

                _addNewRowToBoard.call(this, tableIndex, newEntry, NEW_ENTRY)
                isNewEntryAdded = true;
                if(tableIndex < SCOREBOARD_LENGTH) {

                    _addNewRowToBoard.call(this, tableIndex + 1, result, !NEW_ENTRY);
                    tableIndex++;
                }
            } else { // handle old result

                _addNewRowToBoard.call(this, tableIndex, result, !NEW_ENTRY);
            }

            tableIndex++;
        })
        if(isNewEntry && tableIndex <= SCOREBOARD_LENGTH && !isNewEntryAdded) {
        // table is not full yet -> add to end of table.

        _addNewRowToBoard.call(this, tableIndex, newEntry, NEW_ENTRY)
        isNewEntry = true;
        }
    }else { //empty table

        if(idxForNewEnery !== null) {

            _addNewRowToBoard.call(this, tableIndex, newEntry, NEW_ENTRY)
        }
    }

    _displayOrHideTable.call(this, SHOW, isNewEntry);
}

function _addNewRowToBoard(index, result, isNewEntry) {

    const newRow = document.createElement("tr");
    newRow.classList.add("secondaryRow");
    newRow.innerHTML=`
    <td align="center" style="width:1%"><ul class="list-group"><li class='list-group-item list-group-item-secondary'>${index}</li></ul></td>
    <td align="center"><ul class="list-group"><li class='list-group-item list-group-item-secondary' id='nameSection'>${isNewEntry? '' : result.Name}</li></ul></td>
    <td align="center"><ul class="list-group"><li class='list-group-item list-group-item-secondary'>${isNewEntry? _formatScore.call(this, result) : _formatScore.call(this, result.Score)}</li></ul></td>
    <td align="center"><ul class="list-group"><li class='list-group-item list-group-item-secondary'>${isNewEntry?  _getCurrentDate.call(this) : result.Date}</li></ul></td>`

    if(isNewEntry) {
        newRow.querySelector('#nameSection').innerHTML=`<input type = "text" id = 'nameInput' class='blinking' placeholder='Enter Your Name' style="display:block;width:100%;height:95%;border:0;background:transparent;text-align:center">`;
        newRow.querySelectorAll('li').forEach(el => el.className = 'list-group-item list-group-item-warning');
    }

    this._scoreBoardTableElem.appendChild(newRow);
}

function _displayOrHideTable(display, isSubmitOption = false) {

    let submitElem = this._submitBtnElem.style;
    let elem = this._scoreBoardDivElem.style;
    display? elem.display = "block" : elem.display = "none";
    isSubmitOption? submitElem.display = "block" : submitElem.display = "none";
}

async function _getTopScoresAsync()  {

    let results;

    try{
        if(_isResultsFromCache.call(this)) {
            results = this._cachedResutls;
            console.log('cached results');
        } else {
            const response = await fetch(this._requestUrl);
            results = await response.json();
            this._cachedResutls = results;
            this._lastReqTimestamp = Date.now();
            console.log('fresh results');
        }

    } catch(e) {
        results = null;
        console.error(`Fetch Failed: ${e.message}`);
    }
    return results;
};

function _isResultsFromCache() {
    // request to the server only if this is the first time or
    // last fetch occured long enough.

    return ( this._lastReqTimestamp &&
        !(Date.now() - ( this._lastReqTimestamp + this._cacheTtlMin ) > 0) )
}

function _minToMsec(mins) {

    return mins? mins * 60 * 1000 : null;
}

function _getAbsoluteValue(time) {

    console.log(`going to replace and split: ${JSON.stringify(time)}`);
    const splitted = time.replace('.',':').split(':');
    const last = splitted.length - 1;
    return parseInt(splitted[last - 2]) * 10000 + parseInt(splitted[last - 1]) * 100 + parseInt(splitted[last]);
}

function _formatScore(time) {

    const splitted = time.replace('.',':').split(':');
    const last = splitted.length - 1;

    return `${splitted[last - 2]}:${splitted[last - 1]}.${splitted[last]}`;
}

function _getIndexInTable(scoreToAdd, scores) {

    const scoresLength = scores.length;
    let resIndex = scoresLength; // resIndex is zeroBased.
    console.log(`@_getIndexInTable: the scores are: ${JSON.stringify(scores)}`);
    scoreToAdd = _getAbsoluteValue.call(this, scoreToAdd);
    //const idx = scores.reduce((acc, currentScore) => _getAbsoluteValue.call(this, currentScore.Score) > scoreToAdd? acc ++ : acc++, 0);
    //scores.find((currentScore, index) => _getAbsoluteValue.call(this, currentScore.Score) > scoreToAdd)
    for(let i = 0; i < scoresLength; i++){

    if(_getAbsoluteValue.call(this, scores[i].Score) > scoreToAdd) {

        resIndex = i;
        break;
    }
    }
    return resIndex;
}

function _getCurrentDate() {

    const date = new Date();
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

}
