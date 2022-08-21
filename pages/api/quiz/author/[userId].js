import { QuizSchema } from "../../../../schemas";
import RedisClient from "../../../../utils/redis_client";


export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return getQuizzesByAuthor(req, res);
    }
}

async function getQuizzesByAuthor(req, res) {
    const { userId } = req.query;

    const redis = new RedisClient()
    const client = await redis.initClient();

    const quizRepo = client.fetchRepository(QuizSchema)

    await quizRepo.createIndex()

    try {
        const quizzes = await quizRepo.search()
            .where('authorId')
            .equals(userId)
            .return.all()

        return res.status(200).json(quizzes)
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            message: 'An error was encountered'
        })
    } finally {
        await redis.disconnectClient()
    }
}