import RedisClient from "../../../../utils/redis_client";
import { QuizTakenSchema, ResponseSchema } from "../../../../schemas";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return getResponses(req, res);
    }
}

async function getResponses(req, res) {
    const redis = new RedisClient();
    const client = await redis.initClient();

    const { attemptId } = req.query;

    const quizTakenRepo = client.fetchRepository(QuizTakenSchema);
    const respRepo = client.fetchRepository(ResponseSchema);

    await quizTakenRepo.createIndex();
    await respRepo.createIndex();

    try {
        let quizTaken = await quizTakenRepo
            .search()
            .where("attemptId")
            .equals(attemptId)
            .return.first();

        quizTaken = quizTaken.toJSON();

        let attemptInfo = new Object();
        attemptInfo.score = quizTaken.score;
        attemptInfo.userId = quizTaken.userId;
        attemptInfo.quizId = quizTaken.quizId;
        attemptInfo.attemptId = quizTaken.attemptId;
        attemptInfo.quizTitle = quizTaken.quizTitle;

        let responses = await respRepo
            .search()
            .where("attemptId")
            .equals(attemptId)
            .return.all();

        responses = responses.map((item) => item.toJSON());
        attemptInfo.responses = responses;

        console.log(attemptInfo)

        return res.status(200).json(attemptInfo);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: "An error was encountered",
        });
    } finally {
        await redis.disconnectClient();
    }
}
