import { Entity, Schema } from "redis-om";
import crypto from "crypto";

class User extends Entity {
    setPassword(password) {
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password, this.salt);
        return this.hashed_password;
    }

    makeSalt() {
        return Math.round(new Date().valueOf() * Math.random());
    }

    encryptPassword(password, salt) {
        if (!password) return "";
        try {
            return crypto
                .createHmac("sha1", salt)
                .update(password)
                .digest("hex");
        } catch (err) {
            return "";
        }
    }

    authenticate(plainText) {
        return (
            this.encryptPassword(plainText, this.salt) === this.hashed_password
        );
    }

    addQuizEnrolled(quizId) {
        this.quizzesEnrolled.push(quizId);
    }

    addQuizTaken(quizTakenId) {
        this.quizzesTaken.push(quizTakenId);
    }

    removeQuizEnrolled(quizId) {
        this.quizzesEnrolled = this.quizzesEnrolled.filter(
            (item) => item !== quizId
        );
    }
}

const userSchema = new Schema(
    User,
    {
        name: { type: "string" },
        email: { type: "string", normalized: "false" },
        hashed_password: { type: "string" },
        salt: { type: "string" },
        isAdmin: { type: "boolean" },
        createdAt: { type: "date", sortable: "true" },
        quizzesEnrolled: { type: "string[]" }, // ensure to initiate it as empty ie []
        quizzesTaken: { type: "string[]" }, // ensure to initiate it as empty ie []
    },
    {
        prefix: "quiza:redis-om-node:user",
    }
);

export default userSchema;
