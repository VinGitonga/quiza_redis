import { QuizSchema } from "../../../schemas";
import RedisClient from "../../../utils/redis_client";
import { getSession } from "next-auth/react";

export default async function handler(req, res){
    switch(req.method){
        case "GET":
            return myAuthoredQuizzes(req, res);
    }
}

async function myAuthoredQuizzes(req, res){
    const redis = new RedisClient()
    const client = await redis.initClient();

    const session = await getSession({req})
    const userId = session?.user?.id;

    try {
        const quizRepo = await client.fetchRepository(QuizSchema)
        await quizRepo.createIndex()

        const quizzes = await quizRepo.search()
            .where('authorId')
            .equals(userId)
            .return.all()

        return res.status(200).json(quizzes)

    } catch (err) {
        console.log(err)
        return res.status(400).json({
            message:`An error was encountured`
        })
    } finally {
        await redis.disconnectClient();
    }
}