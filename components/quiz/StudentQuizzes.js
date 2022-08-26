import { useState } from "react";
import {
    Box,
    Flex,
    Tag,
    IconButton,
    Heading,
    Text,
    Avatar,
    HStack,
    Tooltip,
    useToast,
} from "@chakra-ui/react";
import Card from "../Card";
import { CgTrash } from "react-icons/cg";
import { FiEdit3 } from "react-icons/fi";
import { useRouter } from "next/router";
import { startQuiz } from "../../services/quiz";
import ConfirmDialog from "../common/ConfirmDialog";
import { useSession } from "next-auth/react";
import Countdown from "../Countdown";

const StudentQuizzes = ({ quizzes }) => {
    const { data: session } = useSession();

    return (
        <Box px={8}>
            <Heading py={5}>My Quizzes</Heading>
            <Card>
                {quizzes?.length === 0 ? (
                    <Text>You haven&apos;t enrolled to any quizzes yet.</Text>
                ) : (
                    <>
                        {quizzes?.map((quiz) => (
                            <QuizItem
                                key={quiz?.entityId}
                                quiz={quiz}
                                user={session?.user}
                            />
                        ))}
                    </>
                )}
            </Card>
        </Box>
    );
};

const QuizItem = ({ quiz, user }) => {
    const router = useRouter();
    const toast = useToast();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const start = () => {
        startQuiz(quiz.entityId, user.id)
            .then((data) => {
                console.log(data)
                if (data?.error) {
                    toast({
                        title: "Error",
                        description: data?.error,
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                } else {
                    setShowConfirmModal(false);
                    toast({
                        title: "Success",
                        description: data?.message,
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    });
                    router.push(
                        {
                            pathname: "/take_quiz",
                            query: { quizId: quiz.entityId },
                        },
                        "/take_quiz"
                    );
                }
            }).catch(err => console.log(err))
            .finally(() => {
                setLoading(false)
                setShowConfirmModal(false);
            });
    };

    return (
        <Box mb={6}>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Flex alignItems={"center"}>
                    <Avatar
                        size="xl"
                        mr={5}
                        src={"https://source.unsplash.com/random"}
                    />
                    {/* To add a push state */}
                    <Text
                        fontSize={"3xl"}
                        _hover={{
                            borderBottom: "2px solid #4299E1",
                        }}
                        cursor={"pointer"}
                    >
                        {quiz?.title}
                    </Text>
                </Flex>
                <Countdown
                    title={"Time Remaining for quiz to Start"}
                    isQuizCountdown={false}
                    totalTime={new Date(quiz?.scheduledFor?.replace("Z", ""))}
                    onComplete={() => {}}
                />
                <Tag
                    display={{ base: "none", lg: "flex" }}
                    bg={"teal.400"}
                    variant="subtle"
                    size="lg"
                    borderRadius={"full"}
                >
                    {quiz?.description}
                </Tag>
                <HStack spacing={4}>
                    <Tooltip
                        label={"Start Quiz"}
                        hasArrow
                        placement={"top"}
                        bg={"teal"}
                    >
                        <IconButton
                            size={"md"}
                            icon={<FiEdit3 />}
                            isRound
                            bg={"gray.300"}
                            onClick={() => setShowConfirmModal(true)}
                        />
                    </Tooltip>
                    <Tooltip
                        label={"Remove Quiz from List"}
                        hasArrow
                        placement={"top"}
                        bg={"teal"}
                    >
                        <IconButton
                            size={"md"}
                            icon={<CgTrash />}
                            isRound
                            bg={"gray.300"}
                        />
                    </Tooltip>
                </HStack>
            </Flex>
            <br />
            <hr
                style={{
                    backgroundColor: "#CBD5E0",
                    color: "#CBD5E0",
                    height: 2,
                }}
            />
            <ConfirmDialog
                isOpen={showConfirmModal}
                onClose={setShowConfirmModal}
                title={"Start Quiz"}
                description={`Are you sure you want to start ${quiz?.title} quiz`}
                isLoading={loading}
                loadingText={"Enrolling"}
                onClickConfirm={start}
            />
        </Box>
    );
};

export default StudentQuizzes;
