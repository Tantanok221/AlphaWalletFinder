import { createClient} from 'npm:redis';


export async function initRedis() {
    const client = createClient();
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
    return client;
  }


