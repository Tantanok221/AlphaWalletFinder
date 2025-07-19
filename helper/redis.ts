import { createClient} from 'npm:redis';

let redisClient: ReturnType<typeof createClient> | null = null;

export async function initRedis(): Promise<ReturnType<typeof createClient>> {
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  const client = createClient();
  
  client.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  client.on('connect', () => {
    console.log('Connected to Redis');
  });

  client.on('disconnect', () => {
    console.log('Disconnected from Redis');
  });

  try {
    await client.connect();
    redisClient = client;
    return client;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }
}

export async function getRedisClient(): Promise<ReturnType<typeof createClient>> {
  if (!redisClient || !redisClient.isOpen) {
    return await initRedis();
  }
  return redisClient;
}

export async function closeRedis(): Promise<void> {
  if (redisClient && redisClient.isOpen) {
    await redisClient.disconnect();
    redisClient = null;
  }
}
