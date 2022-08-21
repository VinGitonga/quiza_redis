import { QuizTakenSchema } from "../../../../schemas";
import RedisClient from "../../../../utils/redis_client";
import { getSession } from "next-auth/react";

export default async function handler(req, res){
    switch (req.method){
        case "GET":
            return getMyQuizSubmissions(req, res);
    }
}

async function getMyQuizSubmissions(req, res){
    const session = await getSession({ req });
    const userId = session?.user?.id;

    const redis = new RedisClient()
    const client = await redis.initClient();

    
    try {
        const quizTakenRepo = client.fetchRepository(QuizTakenSchema)
        await quizTakenRepo.createIndex();

        const quizzes = await quizTakenRepo.search()
            .where('userId')
            .equals(userId)
            .return.all()

        return res.status(200).json(quizzes)
        
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            message:'An error was encountered'
        })
    } finally {
        await redis.disconnectClient();
    }
}