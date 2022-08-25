import useSWR from "swr";
import { useSession } from "next-auth/react";
import axios from "axios";
import AuthorQuizzes from "../components/quiz/AuthorQuizzes";
import StudentQuizzes from "../components/quiz/StudentQuizzes";
import Layout from "../components/Layout";
import Head from "next/head"

const fetcher = (url) => axios.get(url).then((resp) => resp.data);

export default function MyQuizzes() {
    const { data: session } = useSession();

    const { data: quizzes } = useSWR(
        () =>
            session?.user?.isAdmin
                ? "/api/user/my_quizzes"
                : "/api/quiz/enrolled",
        fetcher
    );

    return (
        <>
            <Head>
                <title>Quiza | My Quizzes</title>
            </Head>
            {session?.user?.isAdmin ? (
                <AuthorQuizzes quizzes={quizzes} />
            ) : (
                <StudentQuizzes quizzes={quizzes} />
            )}
        </>
    );
}

MyQuizzes.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};
