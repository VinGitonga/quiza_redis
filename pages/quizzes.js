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
import Card from "../components/Card";
import { GrAdd } from "react-icons/gr";
import { useRouter } from "next/router";
import { enrollToQuiz } from "../services/quiz";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import axios from "axios";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Layout from "../components/Layout"
import Head from "next/head"

const isEnrolled = (allUsersEnrolled, currentUserId) =>
    allUsersEnrolled.includes(currentUserId);

const fetcher = (url) => axios.get(url).then((resp) => resp.data);

export default function Quizes () {
    const { data: session } = useSession();

    const { data: quizzes } = useSWR("/api/quiz", fetcher);

    return (
        <Box px={8}>
            <Heading py={5}>Public Quizzes</Heading>
            <Head>
                <title>Quiza | Public Quizzes</title>
            </Head>
            <Card>
                {quizzes?.length === 0 ? (
                    <Text>
                        {session?.user?.isAdmin
                            ? "No quizzes yet, Create some yoo!"
                            : "There no quizzes contact Admin!"}
                    </Text>
                ) : (
                    <Box>
                        {quizzes?.map((quiz) => (
                            <QuizItem
                                key={quiz?.entityId}
                                quiz={quiz}
                                user={session?.user}
                            />
                        ))}
                    </Box>
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

    const enroll = () => {
        enrollToQuiz(quiz.entityId, user.id).then((data) => {
            setLoading(false);
            setShowConfirmModal(false);
            toast({
                title: "Success",
                description: data?.message,
                status: "success",
                duration: 9000,
                isClosable: true,
            });
        }).catch(err => {
            console.log(err)
            toast({
                title: 'Error',
                description: err?.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
              })
        })
    };

    return (
        <Box mb={6}>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Flex alignItems={"center"}>
                    <Avatar size="xl" mr={5} src={"https://source.unsplash.com/random"} />
                    {/* To add a push state */}
                    <Text
                        fontSize={"3xl"}
                        _hover={{
                            borderBottom: "2px solid #4299E1",
                        }}
                        cursor={"pointer"}
                        onClick={() =>
                            user.isAdmin
                                ? router.push({
                                      pathname: "/quiz_detail",
                                      query: { quizId: quiz?._id },
                                  })
                                : {}
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
                        label={
                            isEnrolled(quiz.usersEnrolled, user?.id)
                                ? "Already enrolled"
                                : "Enroll to Quiz"
                        }
                        hasArrow
                        placement={"top"}
                        bg={"teal"}
                    >
                        <IconButton
                            size={"md"}
                            icon={<GrAdd />}
                            isRound
                            bg={"gray.300"}
                            onClick={() => setShowConfirmModal(true)}
                            disabled={user?.isAdmin || isEnrolled(quiz.usersEnrolled, user?.id)}
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
                title={"Enroll to Quiz"}
                description={`Are you sure you want to enroll to ${quiz?.title} quiz`}
                isLoading={loading}
                loadingText={"Enrolling"}
                onClickConfirm={enroll}
            />
        </Box>
    );
};

Quizes.getLayout = function getLayout(page){
    return (
        <Layout>
            {page}
        </Layout>
    )
}