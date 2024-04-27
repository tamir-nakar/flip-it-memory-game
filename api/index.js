import { Redis } from "@upstash/redis";

import express from "express";
import * as db from "./db.js";
const app = express();
const port = process.env.PORT || 3000;
//const redis = Redis.fromEnv();
const redis = db.redis
app.use(express.json());
app.use(express.static("public"));

app.get("/scoreboard", async (req, res) => {
  // returns scoreboard record list
  try {
    const scoreboard = await db.getScoreboardAsync();
    if (scoreboard) {
      res.json(scoreboard);
    } else {
      // Handle case where there is no scoreboard data
      res.status(404).json({ success: false, message: "Scoreboard not found" });
    }
  } catch (error) {
    // Handle any errors that occur during the fetch
    res.status(500).json({
      success: false,
      message: "Error fetching scoreboard",
      error: error.message,
    });
  }
});

app.get("/gameId", async (req, res) => {
  // generates game-id
  try {
    const gameId = _generateFiveDigitCode();
    await db.addNewGameIdToAllocationTableAsync(gameId);
    res.status(200).json({ success: true, gameId });
  } catch (error) {
    // Handle any errors that occur during the fetch
    res.status(500).json({
      success: false,
      message: "Error getting gameId",
      error: error.message,
    });
  }
  _cleanAllocationDBAsync(); // clean allocations in background
});

app.post("/scoreboard", async (req, res) => {
  // set a new score to DB (if valid)
  try {
    const gameId = req.body.gameId;
    const gameDetails = await db.getGameDetails();
    if (gameDetails?.[gameId]?.isValid) {
      await db.addNewRecordToScoreboard(req.body);
      gameDetails[gameId].isUsed = true;
      await redis.set(
        process.env.GAME_ID_ALLOCATION_REDIS_KEY,
        JSON.stringify(gameDetails)
      );
    } else {
      res.status(401).json({
        success: false,
        message: "Score validation failed by the server",
      });
    }
  } catch (error) {
    // Handle any errors that occur during the fetch
    res.status(500).json({
      success: false,
      message: "Scoreboard not found",
      error: error.message,
    });
  }
});

app.get("/serviceCheck", async (req, res) => {
  const isDbAlive = await db.isAliveAsync();
  try {
    if (isDbAlive) {
      res.status(200).send();
    } else {
      res.status(500).send();
    }
  } catch (e) {
    res.status(500).send();
  }
});
app.get("/validate", async (req, res) => {
  // validate score before submit
  let result;
  try {
    const currentTs = Date.now();
    const { gameId, score } = req.query;
    const gameDetails = await db.getGameDetails();
    if (
      !gameId ||
      !score ||
      !gameDetails?.[gameId]?.generation_ts ||
      gameDetails?.[gameId]?.isUsed === true ||
      gameDetails?.[gameId]?.isUsed === undefined ||
      !_isValidTsInterval(
        score,
        currentTs,
        gameDetails?.[gameId]?.generation_ts
      )
    ) {
      result = false;
    } else {
      gameDetails[gameId].isValid = true;
      result = true;
      await redis.set(
        process.env.GAME_ID_ALLOCATION_REDIS_KEY,
        JSON.stringify(gameDetails)
      );
    }
    res.status(200).json({ isValid: result });
  } catch (error) {
    // Handle any errors that occur during the fetch
    res.status(500).json({
      success: false,
      message: "Server error: Can't validate",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

async function _cleanAllocationDBAsync() {
  const gameDetails = await redis.get(process.env.GAME_ID_ALLOCATION_REDIS_KEY);
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  const newData = {};
  const currentTs = Date.now();
  for (let gd in gameDetails) {
    // we delete any record that exist for at least 24 hours or already used
    if (
      currentTs - gameDetails[gd].generation_ts < oneDayInMilliseconds ||
      gameDetails[gd].isUsed === "true"
    )
      newData[gd] = gameDetails[gd];
  }
  await redis.set(
    process.env.GAME_ID_ALLOCATION_REDIS_KEY,
    JSON.stringify(newData)
  );
}

function _isValidTsInterval(score, currentTs, generation_ts) {
  // we convert back the score to time and check against the interval between generation_ts and currentTs
  const absScore = _convertToAbsoluteScore(score);
  const validation_grace = process.env.VALIDATION_GRACE || 3000; // 3 seconds
  const interval = currentTs - generation_ts - validation_grace;
  const bestMinScoreAllowed = convertIntervalToScore(interval); // user score cant be below it (or else he's trying to cheat)
  return absScore > bestMinScoreAllowed;
}

function convertIntervalToScore(interval) {
  let seconds = Math.floor(interval / 1000); // Convert milliseconds to seconds
  let minutes = Math.floor(seconds / 60); // Convert seconds to minutes
  seconds = seconds % 60; // Remaining seconds after extracting minutes
  let hundredths = Math.floor((interval % 1000) / 10); // Extract hundredths of a second

  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toString().padStart(2, "0");
  hundredths = hundredths.toString().padStart(2, "0");

  const temp = `${minutes}:${seconds}.${hundredths}`;
  return _convertToAbsoluteScore(temp);
}

function _convertToAbsoluteScore(score) {
  return Number(score.replace(":", "").replace(".", "")); // 00:04.06 -> 000406 -> 406
}

function _generateFiveDigitCode() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
