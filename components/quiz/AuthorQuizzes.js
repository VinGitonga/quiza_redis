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
import { useRouter } from "next/router";
import { useState } from "react";
import { removeQuiz } from "../../services/quiz";
import ConfirmDialog from "../common/ConfirmDialog";

const AuthorQuizzes = ({ quizzes }) => {
    return (
        <Box px={8}>
            <Heading py={5}>My Quizzes</Heading>
            <Card>
                {quizzes?.length === 0 ? (
                    <Text>You haven&apos;t authored any quizzes yet.</Text>
                ) : (
                    <>
                        {quizzes?.map((quiz) => (
                            <QuizItem key={quiz?.entityId} quiz={quiz} />
                        ))}
                    </>
                )}
            </Card>
        </Box>
    );
};

const QuizItem = ({ quiz }) => {
    const router = useRouter();
    const toast = useToast();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const remove = () => {
        setLoading(true);
        removeQuiz(quiz?.entityId)
            .then((data) => {
                if (data.message) {
                    setShowConfirmModal(false);
                    toast({
                        title: "Success",
                        description: data?.message,
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    });
                    router.replace("/my_quizzes");
                } else {
                    toast({
                        title: "Error",
                        description: data?.error,
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    });
                }
            })
            .finally(() => {
                setLoading(false);
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
                        onClick={() =>
                            router.push(
                                {
                                    pathname: "/quiz_detail",
                                    query: { quizId: quiz.entityId },
                                },
                                "/quiz_detail"
                            )
                        }
                    >
                        {quiz?.title}
                    </Text>
                </Flex>
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
                        label={"Remove Quiz"}
                        hasArrow
                        placement={"right"}
                        bg={"teal"}
                    >
                        <IconButton
                            size={"sm"}
                            aria-label={"remove"}
                            icon={<CgTrash />}
                            isRound
                            bg={"gray.300"}
                            onClick={() => setShowConfirmModal(true)}
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
                title={"Remove Quiz"}
                description={`Are you sure you want to remove ${quiz?.title} quiz`}
                isLoading={loading}
                loadingText={"Removing"}
                onClickConfirm={remove}
            />
        </Box>
    );
};

export default AuthorQuizzes;
