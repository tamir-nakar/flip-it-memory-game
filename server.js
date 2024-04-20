import express from "express";
import cors from "cors";
import { Redis } from "@upstash/redis";

const app = express();
const port = process.env.PORT || 3000;

const redis = Redis.fromEnv();
app.use(cors());

// app.use(cors({
//   origin: "https://flip-it-memory-game.vercel.app",
//   methods: ["GET", "POST"],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

app.use(express.static("public"));
app.use(express.json());

app.get("/scoreboard", async (req, res) => {
  try {
    console.log(process.env.SCOREBOARD_REDIS_KEY)
    const scoreboard = await redis.get(process.env.SCOREBOARD_REDIS_KEY);
    if (scoreboard) {
      res.json(scoreboard);
    } else {
      // Handle case where there is no scoreboard data
      res.status(404).json({ success: false, message: "Scoreboard not found" });
    }
  } catch (error) {
    // Handle any errors that occur during the fetch
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching scoreboard",
        error: error.message,
      });
  }
});

app.post("/scoreboard", async (req, res) => {
  try {
    const scoreboard = await redis.get(process.env.SCOREBOARD_REDIS_KEY);
    if (scoreboard) {
      scoreboard.push(req.body);
      await redis.set(
        process.env.SCOREBOARD_REDIS_KEY,
        JSON.stringify(scoreboard)
      );
    } else {
      // Handle case where there is no scoreboard data
      res.status(404).json({ success: false, message: "Scoreboard not found" });
    }
  } catch (error) {
    // Handle any errors that occur during the fetch
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching scoreboard",
        error: error.message,
      });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
