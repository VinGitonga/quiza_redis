import { Entity, Schema } from "redis-om"

class Question extends Entity { }

const questionSchema = new Schema(Question, {
    quizId: { type: 'string' },
    description: { type: 'string' },
    options: { type: 'string[]' },
    correctAnswer: { type: 'string' },
}, {
    prefix: 'quiza:redis-om-node:question'
})

export default questionSchema