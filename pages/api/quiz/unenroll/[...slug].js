import RedisClient from "../../../../utils/redis_client";
import { UserSchema, QuizSchema } from "../../../../schemas";

export default async function handler(req, res) {
    switch (req.method) {
        case "PATCH":
            return unenroll(req, res);
    }
}

async function unenroll(req, res) {
    const redis = new RedisClient()
    const client = await redis.initClient();

    const { slug } = req.query

    const quizId = slug[0]
    const userId = slug[1]

    try {
        const quizRepo = client.fetchRepository(QuizSchema)
        const userRepo = client.fetchRepository(UserSchema)

        // fetch the quiz and user
        const quiz = await quizRepo.fetch(quizId)
        const user = await userRepo.fetch(userId);

        // Remove from quiz and user models
        quiz.removeUserEnrolled(userId)
        user.removeQuizEnrolled(quizId)

        await quizRepo.save(quiz)
        await userRepo.save(user)

        return res.status(200).json({
            message: 'User successfully unenrolled from quiz'
        })

    } catch (err) {
        console.log(err)
        return res.status(400).json({
            message: 'An error was encountured'
        });
    } finally {
        await redis.disconnectClient()
    }
}