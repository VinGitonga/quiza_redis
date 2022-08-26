/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import {
    Box,
    Flex,
    Heading,
    Stack,
    Button,
    Text,
    RadioGroup,
    Radio,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import Countdown from "../components/Countdown";
import Layout from "../components/Layout";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Loader from "../components/common/Loader";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import axios from "axios";
import useSWR from "swr";
import { submitQuiz, resetQuiz } from "../services/quiz";
import Head from "next/head"

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Quiz (){
    const router = useRouter();
    const toast = useToast();
    const { quizId } = router.query;
    const { data: session } = useSession();

    const [allQuestions, setAllQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [currentAns, setCurrentAns] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [allAns, setAllAns] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalDuration, setTotalDuration] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);

    const { data } = useSWR("/api/quiz/student", fetcher);

    /**
     * Handle next btn
     */
    const _next = () => {
        let currQues = currentQuestion + 1;
        setCurrentStep(currentStep + 1);
        setCurrentQuestion(currentQuestion + 1);
        setCurrentAns(allAns[currQues].selectedOption);
    };

    /**
     * Handle Prev Btn
     */

    const _prev = () => {
        let currQues = currentQuestion - 1;
        setCurrentStep(currentStep - 1);
        setCurrentQuestion(currentQuestion - 1);
        setCurrentAns(allAns[currQues].selectedOption);
    };
    // Prev Btn
    const prevBtn = () => {
        if (currentStep !== 1) {
            return <QuizBtn text={"Prev"} onClick={_prev} />;
        }
        return null;
    };

    // Next Btn
    const nextBtn = () => {
        if (currentStep < allQuestions.length) {
            return <QuizBtn text={"Next"} onClick={_next} />;
        } else if (currentStep === allQuestions.length) {
            return (
                <QuizBtn
                    text={"Finish"}
                    onClick={() => setShowConfirmModal(true)}
                />
            );
        }
    };

    // Save the answers on click next or prev

    const handleChange = (event) => {
        setCurrentAns(event);
        console.log(currentAns);

        let newState = allAns;
        newState[currentQuestion].selectedOption = event;
        setAllAns(newState);
    };
    /**
     * Submit the quiz to the backend
     */

    const clickSubmit = () => {
        let submitData = {
            questions: allAns,
        };

        submitQuiz(
            { quizId: quizId, userId: session?.user?.id },
            submitData
        ).then((data) =>
            router.replace(
                { pathname: "/results", query: { attemptId: data.attemptId } },
                "/results"
            )
        );
    };

    /**
     * this method takes in the current quiz duration and returns the future end time for the quiz for the countdown component
     */

    function getTotalTime(duration) {
        let durationInMillSec = parseInt(duration) * 60 * 1000;
        let currentTime = new Date().getTime();
        let futureTime = currentTime + durationInMillSec;
        return futureTime;
    }

    /**
     * This methods takes an array of questions and duration and restructures questions in a form
     * for saving answers.
     * @param {*} questions
     * @param duration
     */

    const setupQuiz = (questions, duration) => {
        var questionsData = [];
        var answerData = [];
        var quizDuration = 0;

        if (questions?.length === 0) {
            console.log("Empty");
            return;
        }

        questions?.map((ques) => {
            let questObj = {
                text: ques?.description,
                options: ques?.options,
            };

            questionsData.push(questObj);
            console.log("Tried");

            let ansObj = {
                selectedOption: null,
            };

            answerData.push(ansObj);
        });
        quizDuration = getTotalTime(duration);

        setAllQuestions(questionsData);
        setAllAns(answerData);
        setTotalDuration(quizDuration);
        setLoading(false);
    };

    useEffect(() => {
        if (data) {
            setupQuiz(data.questions, data.duration);
            console.log("did that");
        }
    }, [data]);

    /**
     * Method that resets the quiz and redirects the user
     */

    const onTimeUp = () => {
        resetQuiz();
        setShowResetModal(false);
        router.replace(`/quizzes`);
    };

    return (
        <Box fontFamily={"Poppins"}>
            <Head>
                <title>Quiza | Take Quiz</title>
            </Head>
            <Flex
                justify={"center"}
                align={"flex-start"}
                bg={useColorModeValue("gray.50", "gray.800")}
                mt={2}
            >
                {loading ? (
                    <Loader />
                ) : (
                    <Stack spacing={8} mx={"auto"} w={"768px"}>
                        <Stack
                            align={"center"}
                            direction={"row"}
                            justify={"space-between"}
                        >
                            <Heading fontSize={"2xl"}>
                                Question {currentStep} out of{" "}
                                {allQuestions.length}
                            </Heading>
                            <Countdown
                                title={"Time Remaining"}
                                totalTime={totalDuration}
                                onComplete={() => setShowResetModal(true)}
                            />
                        </Stack>
                        <Box
                            rounded={"lg"}
                            bg={useColorModeValue("white", "gray.700")}
                            boxShadow={"lg"}
                            p={8}
                        >
                            <Text size={"md"} mb={3}>
                                {allQuestions[currentQuestion]?.text}
                            </Text>
                            <RadioGroup
                                onChange={handleChange}
                                value={currentAns}
                            >
                                <Stack spacing={4} direction={"column"}>
                                    {allQuestions[currentQuestion]?.options.map(
                                        (opt, i) => (
                                            <Radio value={opt} key={opt}>
                                                {opt}
                                            </Radio>
                                        )
                                    )}
                                </Stack>
                            </RadioGroup>
                            <Stack spacing={10} direction={"row"} mt={5}>
                                {prevBtn()}
                                {nextBtn()}
                            </Stack>
                        </Box>
                    </Stack>
                )}
            </Flex>
            {/* Dialog Box to confirm quiz submission */}
            <ConfirmDialog
                isOpen={showConfirmModal}
                onClose={setShowConfirmModal}
                title={"Submit Quiz"}
                description={`Confirm to submit quiz`}
                onClickConfirm={clickSubmit}
            />
            <ConfirmDialog
                isOpen={showResetModal}
                onClose={setShowResetModal}
                title={"Quiz timeout!"}
                description={`You time to do the quiz is up.`}
                onClickConfirm={onTimeUp}
                showNoBtn={false}
            />
        </Box>
    );
};

const QuizBtn = ({ text, onClick }) => (
    <Button
        bg={"blue.400"}
        onClick={onClick}
        color={"white"}
        _hover={{
            bg: "blue.500",
        }}
    >
        {text}
    </Button>
);

Quiz.getLayout = function getLayout(page){
    return (
        <Layout>
            {page}
        </Layout>
    )
}