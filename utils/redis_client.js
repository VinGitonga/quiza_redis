import { Client } from "redis-om"


class RedisClient {
    constructor(){
        this.client = new Client()
    }

    async initClient(){
        await this.client.open(process.env.REDIS_URL)
        return this.client
    }

    async disconnectClient(){
        await this.client.close()
    }
}



export default RedisClient