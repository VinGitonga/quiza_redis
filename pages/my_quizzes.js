import useSWR from "swr";
import { useSession } from "next-auth/react";
import axios from "axios";
import AuthorQuizzes from "../components/quiz/AuthorQuizzes";
import StudentQuizzes from "../components/quiz/StudentQuizzes";
import Layout from "../components/Layout";

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

    return session?.user?.isAdmin ? (
        <AuthorQuizzes quizzes={quizzes} />
    ) : (
        <StudentQuizzes quizzes={quizzes} />
    );
}

MyQuizzes.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};
