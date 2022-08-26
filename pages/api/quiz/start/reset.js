import RedisClient from "../../../../utils/redis_client"
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    switch (req.method) {
        case "PATCH":
            return reset(req, res);
    }
}

async function reset(req, res) {
    const redis = new RedisClient()
    const session = await getSession({ req });

    const client = await redis.initClient();

    try {
        await client.execute(["DEL", (await session).user.id.toString()]); // the quizData already saved in redis
        return res.status(200).json({
            message: "Quiz reset successfully",
        });
    } catch (err) {
        console.log(err);
        return res.status(200).json({
            error: "An error has been encountered",
        });
    } finally {
        await client.close();
    }
}
