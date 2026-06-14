import Redis from "ioredis";

let redis: Redis | null = null;

if (process.env.REDIS_URL) {
  try {
    redis = new Redis(process.env.REDIS_URL);
  } catch (error) {
    console.warn("Failed to initialize Redis client:", error);
  }
} else {
  console.warn("REDIS_URL not configured. Running without Redis caching.");
}

export async function setCache(key: string, value: string, ttlSeconds = 86400): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(key, value, "EX", ttlSeconds);
  } catch (err) {
    console.error(`Redis setCache failed for key ${key}:`, err);
  }
}

export async function getCache(key: string): Promise<string | null> {
  if (!redis) return null;
  try {
    return await redis.get(key);
  } catch (err) {
    console.error(`Redis getCache failed for key ${key}:`, err);
    return null;
  }
}

export async function evictCache(key: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(key);
  } catch (err) {
    console.error(`Redis evictCache failed for key ${key}:`, err);
  }
}

export async function evictUserDomainsCache(userId: string): Promise<void> {
  await evictCache(`user:${userId}:domains`);
}

export async function evictUserGoalsCache(userId: string): Promise<void> {
  await evictCache(`user:${userId}:goals`);
  await evictCache(`user:${userId}:analytics`);
}
