import { Client } from "redis-om"


class RedisClient {
    constructor(){
        this.client = new Client()
    }

    async initClient(){
        await this.client.open('redis://localhost:6379')
        return this.client
    }

    async disconnectClient(){
        await this.client.close()
    }
}



export default RedisClient