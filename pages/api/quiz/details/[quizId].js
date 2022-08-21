import RedisClient from "../../../../utils/redis_client";
import { QuizSchema } from "../../../../schemas";

export default function handler(req, res) {
    switch (req.method) {
        case "GET":
            return getQuizDetails(req, res);
    }
}

async function getQuizDetails(req, res) {
    const { quizId } = req.query

    const redis = new RedisClient()
    const client = await redis.initClient();

    try {
        const quizRepo = client.fetchRepository(QuizSchema)
        const quiz = await quizRepo.fetch(quizId);

        return res.status(200).json({
            id: quiz.entityId,
            title: quiz.title,
            description: quiz.description,
            quizCode: quiz.quizCode,
            duration: quiz.duration,
            authorId: quiz.authorId,
        });

    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: 'An error was encountered'
        })
    } finally {
        await redis.disconnectClient()
    }
}