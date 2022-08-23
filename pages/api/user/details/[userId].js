import RedisClient from "../../../../utils/redis_client";
import { UserSchema } from "../../../../schemas";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return getUserDetail(req, res);
    }
}

async function getUserDetail(req, res) {
    const redis = new RedisClient();
    const client = await redis.initClient();
    const { userId } = req.query;

    const userRepo = client.fetchRepository(UserSchema);

    try {
        const user = await userRepo.fetch(userId);
        // Return the fetched user
        return res.status(200).json({
            id: user.entityId,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: "An error was encountered",
        });
    } finally {
        await redis.disconnectClient();
    }
}
