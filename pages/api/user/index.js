import { UserSchema } from "../../../schemas"
import { Client } from "redis-om"


export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            return getUsers(req, res);
        case 'POST':
            return createUser(req, res);
    }
}

async function createUser(req, res) {
    console.log(req.body)
    const client = new Client();
    await client.open('redis://localhost:6379')

    try {
        const userRepo = client.fetchRepository(UserSchema)
        const { name, email, isAdmin, password } = req.body
        const newUser = userRepo.createEntity({
            name: name,
            email: email,
            isAdmin: isAdmin,
            createdAt: Date.now(),
            quizzesEnrolled: [],
            quizzesTaken: [],
        })

        newUser.setPassword(password)

        await userRepo.save(newUser);

        return res.status(200).json(newUser.toJSON())

    } catch (err) {
        console.log(err)
        return res.status(400).json({
            message: `An error was encountered`
        })
    } finally {
        await client.close()
    }
}


async function getUsers(req, res) {
    const client = new Client()
    await client.open('redis://localhost:6379')

    try {
        const userRepo = client.fetchRepository(UserSchema);

        await userRepo.createIndex()

        const users = await userRepo.search().return.all();

        return res.status(200).json(users)
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            message: `An error was encountered`
        })
    } finally {
        await client.close()
    }
}