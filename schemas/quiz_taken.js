import { Entity, Schema } from "redis-om";

class QuizTaken extends Entity {}

const quizTakenSchema = new Schema(
    QuizTaken,
    {
        userId: { type: "string" },
        userName: { type: "string" }, // name of the user taking the quiz
        score: { type: "number" },
        responses: { type: "string[]" },
        quizId: { type: "string" },
        attemptId: { type: "string" },
        quizTitle: { type: "string" },
    },
    {
        prefix: "quiza:redis-om-node:quizTaken",
    }
);

export default quizTakenSchema;
