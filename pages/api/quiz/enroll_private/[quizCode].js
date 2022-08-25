import RedisClient from "../../../../utils/redis_client";
import { QuizSchema, UserSchema } from "../../../../schemas";
import { getSession } from "next-auth/react";

export default function handler(req, res) {
    switch (req.method) {
        case "PATCH":
            return enrollUserToQuiz(req, res);
    }
}

async function enrollUserToQuiz(req, res) {
    const { quizCode } = req.query;
    const session = await getSession({ req });
    const redis = new RedisClient();
    const client = await redis.initClient();

    let userId = session?.user?.id;

    const quizRepo = client.fetchRepository(QuizSchema);
    const userRepo = client.fetchRepository(UserSchema);

    await quizRepo.createIndex();

    // let quiz = await quizRepo.fetch(quizId);
    let user = await userRepo.fetch(userId);

    try {
        // Confirm if user already enrolled
        
        let quiz = await quizRepo
        .search()
        .where("quizCode")
        .equals(quizCode)
        .return.first();

        // validate the code
        if (!quiz){
            return res.status(404).json({
                error:"Invalid Quiz Code"
            })
        }

        // Confirm if user already enrolled
        
        if (quiz.usersEnrolled.includes(userId)) {
            return res.status(409).json({
                error: `${user.name} you're already enrolled`,
            });
        }

        let quizId = quiz.entityId
        // if user not enrolled, add user to enrolled list
        quiz.addUserEnrolled(userId);
        user.addQuizEnrolled(quizId);

        // save the changes made
        await quizRepo.save(quiz);
        await userRepo.save(user);

        return res.status(200).json({
            message: `${user.name} you have been successfully enrolled to the quiz`,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: err
        });
    } finally {
        await redis.disconnectClient();
    }
}
