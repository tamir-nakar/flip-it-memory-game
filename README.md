# Flip it!
### A memory card game with cusomizable cards

![preview_gif](./documentation/preview_gif.gif)
<p>Flip it is a client-server project made completely using Vanilla.js. The Client is a pure SPA (single page application) making an AJAX calls to the server to read, validate and write scores into the scoreboard. </p>
<p>In Flip-it you can choose between 2 kinds of decs, Marvel and South-Park, and you can also customize your own deck by dragging png or jpg images at the "customized" panel.</p>
<p>You play against the clock. Your goal is to finish revealing all the cards at the shortest time possible. Revealing a mis-match, will cost you 2 seconds of delay, where picking the correct pair, will let you continue instantly. You can always try to get better and beat you own records (stores in local-storage), and if you're good enough maybe even qualify to the global scoreboard table and gain an eternal glory buy putting your name there!</p>

### Main features:

* Choose your desired deck of card or customize your own
* Local and global record breaking system
* Service-check and error handling - your game will flow as usual even when the server is down (offline mode). When trying to present the scoreboard a proper message will showup saying the server is down.
* Score validation - every game has a unique gameId, signed end-to-end, malicious users will find it hard to manipulate the system and enter the scoreboard by cheating.

> example of 'server down' alert when trying to present scoreboard
![server_is_down_example](./documentation/server_is_down.jpg)
## Installation
<br>
first, run:

```cmd
npm install
```

then run server by : 
```cmd
npm start
```

then go to `localhost:3000`
<br><br>

> Note: if you're using vsCode you can use my `launch.json` file by running: `Run server and Open Memory Game 🟢` command.

## Configuration (env-variables)

* The server is using Redis in-memory db (hosted by Upstash) to handle scoreboard. DB credentials should be supplied as follows below, if not provided, the game will start in 'offline-mode' and won't allow setting new records or present the scoreboard.

    * `UPSTASH_REDIS_REST_TOKEN` - credentials
    * `UPSTASH_REDIS_REST_URL` - credentials
    * `SCOREBOARD_REDIS_KEY` - redis entry to store scoreboard results
    * `GAME_ID_ALLOCATION_REDIS_KEY` - redis entry to save gameIds
    
* Additional configurations:
    * `VALIDATION_GRACE` - defaults = 3 seconds. needed to validate user submitted scores, the smaller the grace is - the stricter the validation is.


# Enjoy!
