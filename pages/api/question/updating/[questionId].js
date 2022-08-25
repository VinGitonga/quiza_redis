import RedisClient from "../../../../utils/redis_client";
import { QuestionSchema } from "../../../../schemas";

export default async function handler (req, res) {
    switch (req.method) {
        case "PUT":
            return updateQuestion(req, res);
        case "DELETE":
            return removeQuestion(req, res);
    }
}

async function updateQuestion(req, res) {
    const { questionId } = req.query;
    const { description, options, correctAnswer } = req.body;

    const redis = new RedisClient();
    const client = await redis.initClient();

    try {
        const questionRepo = client.fetchRepository(QuestionSchema);
        const question = await questionRepo.fetch(questionId); // retrieve the question

        question.description = description;
        question.options = options;
        question.correctAnswer = correctAnswer;

        await questionRepo.save(question); // save changes

        return res.status(200).json({
            messaga: "Question updated successfully",
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

async function removeQuestion(req, res) {
    const { questionId } = req.query;

    const redis = new RedisClient();
    const client = await redis.initClient();

    try {
        const questionRepo = client.fetchRepository(QuestionSchema);

        // Now remove the question using questionID
        await questionRepo.remove(questionId);

        return res.status(200).json({
            message: "Question removed successfully",
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: "An error was encountered",
        });
    }
}
