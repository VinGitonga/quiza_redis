import { Entity, Schema } from "redis-om"

class Quiz extends Entity {
    addUserParticipated(userId) {
        this.usersParticipated.push(userId)
    }

    addUserEnrolled(userId) {
        this.usersEnrolled.push(userId)
    }

    removeUserEnrolled(userId){
        this.usersEnrolled = this.usersEnrolled.filter(item => item !== userId)
    }

    updateDetails(description, title, duration){
        this.description = description
        this.title = title
        this.duration = duration
    }
};

const quizSchema = new Schema(Quiz, {
    title: { type: 'string' },
    quizCode: { type: 'string' },
    duration: { type: 'number' },
    description: { type: 'string' },
    authorId: { type: 'string' },
    quizTaken: { type: 'string[]' }, // array of quizTake ids who took the quiz, quizTaken has quizId, UserId, score, responses
    usersEnrolled: { type: 'string[]' }, // ensure to initiate as empty array []
    createdAt: { type: 'date' }
}, {
    prefix: 'quiza:redis-om-node:quiz'
});

export default quizSchema