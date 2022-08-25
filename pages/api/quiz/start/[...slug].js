import { Client } from "redis-om";
import { createClient } from "redis";
import {
    UserSchema,
    QuizSchema,
    QuestionSchema,
    ResponseSchema,
    QuizTakenSchema,
    AttemptSchema,
} from "../../../../schemas";

export default async function handler(req, res) {
    switch (req.method) {
        case "PATCH":
            return startQuiz(req, res);
        case "POST":
            return markQuiz(req, res);
    }
}

async function startQuiz(req, res) {
    const { slug } = req.query;

    const quizId = slug[0];
    const userId = slug[1];

    const redis = createClient(process.env.REDIS_URL);
    await redis.connect();

    const client = await new Client().use(redis);

    const quizRepo = client.fetchRepository(QuizSchema);
    const userRepo = client.fetchRepository(UserSchema);
    const questionRepo = client.fetchRepository(QuestionSchema);

    await userRepo.createIndex();
    await questionRepo.createIndex();

    try {
        const user = await userRepo.fetch(userId);
        const quiz = await quizRepo.fetch(quizId);

        const questions = await questionRepo
            .search()
            .where("quizId")
            .equals(quizId)
            .return.all();

        // Confirm if user already enrolled
        if (!user.quizzesEnrolled.includes(quizId)) {
            return res.status(409).json({
                error: "You are not enrolled to the quiz",
            });
        }

        // Confirm if the quiz has started 
        if (new Date(quiz.scheduledFor) >= Date.now()){
            return res.status(400).json({
                error:'Quiz has not started yet!'
            })
        }

        /**
         * Save the questions in redis cache database
         */

        const quizData = {
            questions: questions,
            duration: quiz.duration,
        };

        // save the questions on redis and userId as the key

        await redis.set(userId, JSON.stringify(quizData), "EX", 3600);

        /**
         * Get the questions and return them to frontend without the correct answer
         *
         */


        return res.status(200).json({
            message: `Quiz started for ${user.name}`
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: err,
        });
    } finally {
        await redis.disconnect();
    }
}

async function markQuiz(req, res) {
    const { slug } = req.query;

    const quizId = slug[0];
    const userId = slug[1];

    const redis = createClient(process.env.REDIS_URL);
    await redis.connect();

    const client = await new Client().use(redis);

    const quizRepo = client.fetchRepository(QuizSchema);
    const userRepo = client.fetchRepository(UserSchema);
    const respRepo = client.fetchRepository(ResponseSchema);
    const quizTakenRepo = client.fetchRepository(QuizTakenSchema);
    const attemptRepo = client.fetchRepository(AttemptSchema);

    const user = await userRepo.fetch(userId); // fetch user
    const quiz = await quizRepo.fetch(quizId); // fetch the quiz

    // create new attempt
    const newAttempt = attemptRepo.createEntity({
        quizId: quizId,
        userId: userId,
    });

    let attemptId = await attemptRepo.save(newAttempt);

    await respRepo.createIndex();

    const { questions } = req.body;

    let score = 0;

    // retrieve questions from redis
    let quizData = await client.execute(["GET", userId]);

    quizData = JSON.parse(quizData);
    let { questions: storedQuestions } = quizData;

    if (storedQuestions) {
        storedQuestions.forEach(async (item, i) => {
            if (questions[i].selectedOption === item.correctAnswer) {
                score += 1;
            }

            let newResp = respRepo.createEntity({
                description: item.description,
                selected: questions[i].selectedOption,
                questionId: item.entityId,
                quizId: quizId,
                correctAnswer: item.correctAnswer,
                options: item.options,
                attemptId: attemptId,
            });

            await respRepo.save(newResp);
            
        });

        const responses = await respRepo
            .search()
            .where("attemptId")
            .equals(attemptId)
            .return.all();

        let responsesId = responses.map((item) => item.entityId);

        const newQuizTaken = quizTakenRepo.createEntity({
            userId: userId,
            score: score,
            quizId: quizId,
            attemptId: attemptId,
            responses: responsesId,
            quizTitle: quiz.title,
            userName: user.name,
        });

        await quizTakenRepo.save(newQuizTaken);
        // push the quizTaken id to quiz schema
        quiz.addQuizTaken(newQuizTaken.entityId)
        user.addQuizTaken(newQuizTaken.entityId);

        // save changes made on quiz and user
        await quizRepo.save(quiz);
        await userRepo.save(user);

        // Remove the quizData cache
        await client.execute(['DEL', userId])

        return res.status(200).json({
            attemptId: attemptId,
        });
    } else {
        return res.status(400).json({
            error: "An error was encountered",
        });
    }
}

