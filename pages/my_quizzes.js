import useSWR from "swr";
import { useSession } from "next-auth/react";
import axios from "axios";
import AuthorQuizzes from "../components/quiz/AuthorQuizzes";
import StudentQuizzes from "../components/quiz/StudentQuizzes";

const fetcher = (url) => axios.get(url).then((resp) => resp.data);

const MyQuizzes = () => {
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
};

export default MyQuizzes;
