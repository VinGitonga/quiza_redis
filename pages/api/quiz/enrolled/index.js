import { QuizSchema } from "../../../../schemas";
import RedisClient from "../../../../utils/redis_client";
import { getSession } from "next-auth/react"


export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return getEnrolledQuizzes(req, res);
    }
}

async function getEnrolledQuizzes(req, res) {
    const session = await getSession({ req })

    const redis = new RedisClient()
    const client = await redis.initClient();

    const quizRepo = client.fetchRepository(QuizSchema)

    await quizRepo.createIndex()

    try {
        const quizzes = await quizRepo.search()
            .where('usersEnrolled')
            .contain(session.user.id)
            .return.all()

        return res.status(200).json(quizzes)
    } catch (err) {
        return res.status(400).json({
            message:'An error was encountered'
        })
    } finally {
        await redis.disconnectClient();
    }
}