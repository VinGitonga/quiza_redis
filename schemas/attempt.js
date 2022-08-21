import { Entity, Schema } from "redis-om"

class Attempt extends Entity { }

const attemptSchema = new Schema(Attempt, {
    quizId: { type: 'string' },
    userId: { type: 'string' },
}, {
    prefix: 'quiz:redis-om-node:attempt'
});

export default attemptSchema;