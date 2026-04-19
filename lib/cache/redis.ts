import Redis from "ioredis";

/**
 * Redis client singleton.
 * Uses REDIS_URL from environment variables.
 */
const redisUrl = process.env.REDIS_URL;

if (!redisUrl && process.env.NODE_ENV === "production") {
  throw new Error("REDIS_URL is not defined in production");
}

const redis = new Redis(redisUrl || "redis://localhost:6379", {
  maxRetriesPerRequest: 3,
});

redis.on("error", (err) => {
  console.error("Redis Connection Error:", err);
});

export default redis;

/**
 * Cache Helpers
 */

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    if (data) {
      console.log(`[Cache] HIT: ${key}`);
      return JSON.parse(data) as T;
    }
  } catch (error) {
    console.error(`[Cache] GET Error for ${key}:`, error);
  }
  console.log(`[Cache] MISS: ${key}`);
  return null;
}

export async function setCachedData(key: string, data: any, ttlSeconds: number = 300): Promise<void> {
  try {
    const serializedData = JSON.stringify(data);
    await redis.set(key, serializedData, "EX", ttlSeconds);
    console.log(`[Cache] SET: ${key} (TTL: ${ttlSeconds}s)`);
  } catch (error) {
    console.error(`[Cache] SET Error for ${key}:`, error);
  }
}

export async function invalidateCache(key: string | string[]): Promise<void> {
  try {
    const keys = Array.isArray(key) ? key : [key];
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[Cache] INVALIDATE: ${keys.join(", ")}`);
    }
  } catch (error) {
    console.error(`[Cache] INVALIDATE Error:`, error);
  }
}
