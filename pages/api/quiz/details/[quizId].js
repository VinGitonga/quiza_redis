import RedisClient from "../../../../utils/redis_client";
import { QuizSchema } from "../../../../schemas";
import { getSession } from "next-auth/react";

export default function handler(req, res) {
    switch (req.method) {
        case "GET":
            return getQuizDetails(req, res);
        case "PUT":
            return updateDetails(req, res);
        case "DELETE":
            return removeQuiz(req, res);
    }
}

async function getQuizDetails(req, res) {
    const { quizId } = req.query;

    const redis = new RedisClient();
    const client = await redis.initClient();

    try {
        const quizRepo = client.fetchRepository(QuizSchema);
        const quiz = await quizRepo.fetch(quizId);

        return res.status(200).json({
            id: quiz.entityId,
            title: quiz.title,
            description: quiz.description,
            quizCode: quiz.quizCode,
            duration: quiz.duration,
            authorId: quiz.authorId,
            scheduledFor: quiz?.scheduledFor,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: "An error was encountered",
        });
    } finally {
        await redis.disconnectClient();
    }
}

async function updateDetails(req, res) {
    const { quizId } = req.query;

    const redis = new RedisClient();
    const client = await redis.initClient();
    const session = await getSession({ req });
    const userId = session?.user?.id;

    const { title, description, duration } = req.body;

    try {
        const quizRepo = client.fetchRepository(QuizSchema);
        const quiz = await quizRepo.fetch(quizId);

        // Confirm the user removing is the author
        if (quiz.authorId !== userId) {
            return res.status(403).json({
                message: "You are not authorized to remove the quiz",
            });
        }

        // Make changes
        quiz.updateDetails(description, title, duration);

        // Save changes
        await quizRepo.save(quiz);

        return res.status(200).json({
            message: "Quiz Details updated successfully",
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: "An error was encountered",
        });
    } finally {
        await redis.disconnectClient();
    }
}

async function removeQuiz(req, res) {
    const { quizId } = req.query;
    const session = await getSession({ req });
    const userId = session?.user?.id;

    const redis = new RedisClient();
    const client = await redis.initClient();

    try {
        const quizRepo = client.fetchRepository(QuizSchema);
        const quiz = await quizRepo.fetch(quizId);
        // Confirm the user removing is the author
        if (quiz.authorId !== userId) {
            return res.status(403).json({
                message: "You are not authorized to remove the quiz",
            });
        }

        // Now remove the quiz
        await quizRepo.remove(quizId);

        return res.status(200).json({
            message: "Quiz removed successfully",
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: "An error was encountered",
        });
    } finally {
        await redis.disconnectClient();
    }
}
