
class StopWatch {

    constructor() {

        this._watch = [0, 0, 0, 0];
        this._domElement = document.querySelector(".stopWatch");
        this._isRunning = false;
        this._interval = null;
        this._lastRun = null;
    }

    start() {

            this._isRunning = true;
            this._domElement.innerHTML = "00:00.00";
            this._interval = setInterval(() => runStopWatch.call(this), 10);
    }

    getLastRun() {

        return this._lastRun;
    }

    zerofy() {

        this._domElement.innerHTML = "00:00.00";
    }

    reset() {

        this._lastRun = this._domElement.innerHTML;
        clearInterval(this._interval);
        this._interval = null;
        this._watch = [0, 0, 0, 0];
        this._isRunning = false;

    }
}

// private --!

function runStopWatch() {

    let currentTime =
        _addLeadingZero.call(this, this._watch[0]) + ":" +
         _addLeadingZero.call(this, this._watch[1]) + "." +
          _addLeadingZero.call(this, this._watch[2]);

    this._domElement.innerHTML = currentTime;

    this._watch[3]++;
    this._watch[0] = Math.floor((this._watch[3]/100)/60);
    this._watch[1] = Math.floor((this._watch[3]/100) - (this._watch[0] * 60));
    this._watch[2] = Math.floor(this._watch[3] - (this._watch[1] * 100) - (this._watch[0] * 6000));
}

function _addLeadingZero(time) {

    if (time <= 9) {
        time = "0" + time;
    }
    return time;
}
