import RedisClient from "../../../utils/redis_client";
import { QuizSchema } from "../../../schemas";
import { nanoid } from "nanoid";

export default function handler(req, res) {
    switch (req.method) {
        case "GET":
            return getQuizzes(req, res);
        case "POST":
            return createQuiz(req, res);
    }
}

async function getQuizzes(req, res) {
    const redis = new RedisClient();
    const client = await redis.initClient();
    try {
        const quizRepo = client.fetchRepository(QuizSchema);

        await quizRepo.createIndex();

        let quizzes = await quizRepo.search()
            .where('quizType')
            .equals('public')
            .return.all();

        

        return res.status(200).json(quizzes);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: "An error was encountered",
        });
    } finally {
        await redis.disconnectClient();
    }
}

async function createQuiz(req, res) {
    console.log(req.body);

    const redis = new RedisClient();
    const client = await redis.initClient();

    try {
        const quizRepo = client.fetchRepository(QuizSchema);
        const {
            title,
            duration,
            description,
            authorId,
            quizType,
            scheduledFor,
        } = req.body;

        const newQuiz = quizRepo.createEntity({
            title: title,
            quizCode: nanoid(8),
            duration: parseInt(duration),
            description: description,
            authorId: authorId,
            quizTaken: [],
            usersEnrolled: [],
            createdAt: Date.now(),
            quizType: quizType,
            scheduledFor: scheduledFor,
        });

        await quizRepo.save(newQuiz);

        return res.status(200).json({
            message: "Quiz Created Successfully",
            quizId: newQuiz.entityId,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: `An error was encountered`,
        });
    } finally {
        await redis.disconnectClient();
    }
}
