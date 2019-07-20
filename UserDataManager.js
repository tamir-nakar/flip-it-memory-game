
class UserDataManager {

    constructor() {

        this._storage = window.localStorage;
    }

    setScore(score) {

        this._storage.setItem('score', score);
    }

    getScore() {

        return this._storage.getItem('score'); // num or null

    }
}

// private --!
