import { Client } from "redis-om";
import { createClient } from "redis";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    switch (req.method) {
        case "PATCH":
            return reset(req, res);
    }
}

async function reset(req, res) {
    const redis = createClient(process.env.REDIS_URL);
    await redis.connect();
    const session = await getSession({ req });

    const client = await new Client().use(redis);

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
