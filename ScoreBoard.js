
class ScoreBoard {

    constructor(cacheTtlMin,) {

        this._cacheTtlMin = _minToMsec.call(this, cacheTtlMin) || _minToMsec.call(this, 1);
        this._requestUrl = 'https://savant-server.herokuapp.com/db/scoreboards/memory';
        this._cachedResutls = null;
        this._lastReqTimestamp = null;
    }

    getScoresAsync = async () => await getTopScoresAsync.call(this);

}

// private --!

async function getTopScoresAsync()  {

    let results;

    try{
        if(_isResultsFromCache.call(this)) {
            results = this._cachedResutls;
            alert('not fresh');
        } else {
            const response = await fetch(this._requestUrl);
            results = await response.json();
            this._cachedResutls = results;
            this._lastReqTimestamp = Date.now();
            alert('fresh - fetching...');
        }

    } catch(e) {
        results = null;
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
