const DEFAULT_EXPIRATION = 3600;

async function setRedisCache(req, key, value, ex = DEFAULT_EXPIRATION) {
  try {
    const { redisClient } = req;
    if (!redisClient) return null;
    await redisClient.set(key, JSON.stringify(value), "EX", ex);
  } catch (error) {
    console.log("redis set error", error.message);
  }
}

async function getFromRedisCache(req, key) {
  const { redisClient } = req;
  if (!redisClient) return null;
  const data = await redisClient.get(key);
  if (data && data !== null) return JSON.parse(data);
  return null;
}

module.exports = { setRedisCache, getFromRedisCache };
