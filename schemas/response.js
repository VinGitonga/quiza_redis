import { Entity, Schema } from "redis-om"

class Response extends Entity { }


const responseSchema = new Schema(Response, {
    description: { type: "string" },
    selected: { type: "string" },
    quizId: { type: "string" },
    questionId: {type: "string"},
    correctAnswer: { type: "string" },
    options: { type: "string[]" },
    attemptId: {type:"string"},
}, {
    prefix: 'quiza:redis-om-node:response'
});

export default responseSchema
