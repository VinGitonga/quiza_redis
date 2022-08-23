import RedisClient from "../../../../utils/redis_client";
import { QuestionSchema } from "../../../../schemas";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return getQuestions(req, res);
        case "POST":
            return createQuestion(req, res);
    }
}

async function createQuestion(req, res) {
    const { quizId } = req.query;
    const { description, options, correctAnswer } = req.body;

    const redis = new RedisClient();
    const client = await redis.initClient();

    try {
        const questionRepo = client.fetchRepository(QuestionSchema);
        const newQuestion = questionRepo.createEntity({
            quizId: quizId,
            description: description,
            options: options,
            correctAnswer: correctAnswer,
        });

        await questionRepo.save(newQuestion); // save the new question

        return res.status(200).json({
            message: "Question added successfully",
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: "An error was encountered",
        });
    } finally {
        await redis.disconnectClient();
    }
}

async function getQuestions(req, res) {
    const { quizId } = req.query;

    const redis = new RedisClient();
    const client = await redis.initClient();

    try {
        const questionRepo = client.fetchRepository(QuestionSchema);

        await questionRepo.createIndex(); // init the RedisSearch to allow querying

        const quizzes = await questionRepo
            .search()
            .where("quizId")
            .equals(quizId)
            .return.all();

        return res.status(200).json(quizzes);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: "An error was encountured",
        });
    } finally {
        await redis.disconnectClient();
    }
}
