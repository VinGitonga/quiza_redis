import RedisClient from "../../../../utils/redis_client"
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return getCachedQuiz(req, res);
    }
}

async function getCachedQuiz(req, res) {
    const session = await getSession({ req }); //using the current user session to get the userId(entityId)
    const redis = new RedisClient()
    const client = await redis.initClient();

    // Now retrieve the questions from redis cache
    let quizData = await client.execute(["GET", (await session).user.id]);
    // Convert the questions to JSON
    quizData = JSON.parse(quizData);
    // log the questions
    console.log(quizData);

    return res.status(200).json(quizData);
}
