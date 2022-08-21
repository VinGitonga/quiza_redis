import RedisClient from "../../../../utils/redis_client";
import { QuizSchema, UserSchema } from "../../../../schemas";

export default function handler(req, res) {
    switch (req.method) {
        case "PATCH":
            return enrollUserToQuiz(req, res)
    }
}

async function enrollUserToQuiz(req, res) {
    const { slug } = req.query;
    const redis = new RedisClient()
    const client = await redis.initClient();

    let quizId = slug[0];
    let userId = slug[1];

    const quizRepo = client.fetchRepository(QuizSchema)
    const userRepo = client.fetchRepository(UserSchema)

    let quiz = await quizRepo.fetch(quizId);
    let user = await userRepo.fetch(userId);

    try {
         // Confirm if user already enrolled
         if (quiz.usersEnrolled.includes(userId)){
            return res.status(409).json({
                error: `User already enrolled`
            })
        }

        // if user not enrolled, add user to enrolled list
        quiz.addUserEnrolled(userId)
        user.addQuizEnrolled(quizId)

        // save the changes made
        await quizRepo.save(quiz)
        await userRepo.save(user)

        return res.status(200).json({
            message: 'User enrolled successfully'
        })

    } catch (err) {
        console.log(err)
        return res.status(400).json({
            error: 'An error was encountered'
        })
    } finally {
        await redis.disconnectClient()
    }
}