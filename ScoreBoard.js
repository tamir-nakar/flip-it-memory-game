
class ScoreBoard {

    constructor(cacheTtlMin) {

        this._cacheTtlMin = _minToMsec.call(this, cacheTtlMin) || _minToMsec.call(this, 1);
        this._requestUrl = 'https://savant-server.herokuapp.com/db/scoreboards/memory';
        this._cachedResutls = null;
        this._lastReqTimestamp = null;
        this._scoreBoardTableElem = document.querySelector("#scoreBoardTable");
        this._scoreBoardDivElem = document.querySelector("#scoreBoard");
    }

    async drawAsync () {

        _cleanTable.call(this);
        const results = await _getTopScoresAsync.call(this);
        if(results) {
            _draw.call(this, results);

        } // else present no results for now please try in a moment
    }

    hide(){

        _displayOrHideTable.call(this, !SHOW);
    }

}


// private --!

function _cleanTable() {
    this._scoreBoardTableElem.querySelectorAll('tr.secondaryRow')
    .forEach(node => node.remove());
}
function _draw(results) {

    results.forEach((result, index) => {
        _addNewRowToBoard.call(this, index + 1, result);
        _displayOrHideTable.call(this, SHOW);
    })
}

function _addNewRowToBoard(index, result) {

    const newRow = document.createElement("tr");
    newRow.classList.add("secondaryRow");
    newRow.innerHTML=`
    <td align="center" style="width:1%"><ul class="list-group"><li class="list-group-item list-group-item-secondary">${index}</li></ul></td>
    <td align="center"><ul class="list-group"><li class="list-group-item list-group-item-secondary">${result.Name}</li></ul></td>
    <td align="center"><ul class="list-group"><li class="list-group-item list-group-item-secondary">${result.Score}</li></ul></td>
    <td align="center"><ul class="list-group"><li class="list-group-item list-group-item-secondary">${result.Date}</li></ul></td>`
    this._scoreBoardTableElem.appendChild(newRow);
}

function _displayOrHideTable(display) {

    let elem = this._scoreBoardDivElem.style;
    display? elem.display = "block" : elem.display = "none";
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
