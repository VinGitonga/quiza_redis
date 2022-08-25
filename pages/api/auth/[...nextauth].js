import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Client } from "redis-om"
import { UserSchema } from "../../../schemas"

export default NextAuth({
    session: {
        jwt: true
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                const client = new Client();
                // await client.open('redis://localhost:6379')
                console.log(process.env.REDIS_URL)
                await client.open(process.env.REDIS_URL)
                try {
            
                    const userRepo = client.fetchRepository(UserSchema);
    
                    await userRepo.createIndex();
    
                    const user = await userRepo.search()
                        .where('email')
                        .equals(credentials.email)
                        .return.first()
    
                    if (!user) {
                        console.log('User not found')
                        throw new Error('User not found')
                    }
    
                    if (!user.authenticate(credentials.password)) {
                        throw new Error('Invalid email or password')
                    }
    
                    return {
                        id: user.entityId,
                        name: user.name,
                        email: user.email,
                        isAdmin: user.isAdmin,
                    }
                } catch (err) {
                    console.log(err)
                    throw new Error(err)
                } finally {
                    await client.close()
                }
            }
        })
    ],
    secret: process.env.NEXT_PUBLIC_SECRET ,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token
        },
        async session({ session, token }) {
            session.user = token.user;
            return session;
        }
    }
})