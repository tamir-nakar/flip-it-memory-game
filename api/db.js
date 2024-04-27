import { Redis } from "@upstash/redis";
const { SCOREBOARD_REDIS_KEY, GAME_ID_ALLOCATION_REDIS_KEY } = process.env;
export let redis;
if (SCOREBOARD_REDIS_KEY && GAME_ID_ALLOCATION_REDIS_KEY) {
  redis = Redis.fromEnv();
}
export async function getScoreboardAsync() {
  return await redis.get(SCOREBOARD_REDIS_KEY);
}

export async function getGameDetails() {
  return await redis.get(GAME_ID_ALLOCATION_REDIS_KEY);
}

export async function addNewRecordToScoreboard(record) {
  const scoreboard = await getScoreboardAsync();
  scoreboard.push(record);
  scoreboard.sort((a, b) => a.score - b.score); // need to sort lowest (best) to highest score
  scoreboard.length = 10;
  await redis.set(SCOREBOARD_REDIS_KEY, JSON.stringify(scoreboard));
}

export async function addNewGameIdToAllocationTableAsync(gameID) {
  const gameDetails = await getGameDetails();
  gameDetails[gameID] = {
    generation_ts: Date.now(),
    isUsed: false,
  };
  await redis.set(
    process.env.GAME_ID_ALLOCATION_REDIS_KEY,
    JSON.stringify(gameDetails)
  );
}

export async function isAliveAsync() {
  try {
    const res = await redis.ping();
    return res === "PONG";
  } catch (e) {
    return false;
  }
}
