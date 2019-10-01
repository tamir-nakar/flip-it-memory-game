// Static class

const deviceParser = new UAParser(navigator.userAgent);

class UserDataManager {

    static setScore(score) {

        window.localStorage.setItem('score', score);
    }

    static getScore() {

        return window.localStorage.getItem('score'); // num or null

    }

    static setCustomizedDeck(imgArr) {

        if(Array.isArray(imgArr) && imgArr.length === 10) {

            debugger;
            const res = imgArr.map(img => img.src);
            window.localStorage.setItem('customized_deck', JSON.stringify(res));
        }
    }

    static getCustomizedDeck() {

        const imgArr = JSON.parse(window.localStorage.getItem('customized_deck'));

        if(imgArr && Array.isArray(imgArr) && imgArr.length === 10) {

            return imgArr;
        } else {

            return null;
        }
    }

    static isMobile() {

        return Boolean(deviceParser.getDevice() && deviceParser.getDevice().type);
    }
}
