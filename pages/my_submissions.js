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
} from "@chakra-ui/react";
import Card from "../components/Card";
import { BsClipboardData } from "react-icons/bs";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import Layout from "../components/Layout";
import Head from "next/head"

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function MySubmissions() {
    const { data: attempts } = useSWR("/api/quiz/submissions", fetcher);
    console.log(attempts);

    return (
        <Box px={8}>
            <Heading py={5}>My Submissions</Heading>
            <Card>
                {attempts?.length === 0 ? (
                    <Text>You haven&apos;t taken any quizzes yet.</Text>
                ) : (
                    <>
                        {attempts?.map((attempt, i) => (
                            <QuizItem key={i} attempt={attempt} />
                        ))}
                    </>
                )}
            </Card>
        </Box>
    );
}

const QuizItem = ({ attempt }) => {
    const router = useRouter();

    return (
        <Box mb={6}>
            <Head>
                <title>Quiza | My Submissions</title>
            </Head>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Flex alignItems={"center"}>
                    <Avatar
                        size="xl"
                        mr={5}
                        src={"https://source.unsplash.com/random"}
                    />
                    {/* To add a push state */}
                    <Flex
                        alignItems={"flex-start"}
                        justifyContent={"space-between"}
                        flexDirection={"column"}
                    >
                        <Text
                            fontSize={"3xl"}
                            _hover={{
                                borderBottom: "2px solid #4299E1",
                            }}
                            cursor={"pointer"}
                        >
                            {attempt?.quizTitle}
                        </Text>
                        <Text
                            fontSize={"md"}
                            color={"gray.500"}
                            cursor="pointer"
                            onClick={() =>
                                router.push(
                                    {
                                        pathname: "/quiz_leaderboard",
                                        query: {
                                            quizId: attempt?.quizId,
                                        },
                                    },
                                    "/quiz_leaderboard"
                                )
                            }
                        >
                            View Quiz Leaderboard
                        </Text>
                    </Flex>
                </Flex>
                <Tag
                    display={{ base: "none", lg: "flex" }}
                    bg={"teal.400"}
                    variant="subtle"
                    size="lg"
                    borderRadius={"full"}
                >
                    You Scored {attempt?.score} / {attempt?.responses?.length}
                </Tag>
                <HStack spacing={4}>
                    <Tooltip
                        label={"View My Results"}
                        hasArrow
                        placement={"top"}
                        bg={"teal"}
                    >
                        <IconButton
                            size={"md"}
                            icon={<BsClipboardData />}
                            isRound
                            bg={"gray.300"}
                            onClick={() =>
                                router.push(
                                    {
                                        pathname: "/results",
                                        query: {
                                            attemptId: attempt?.attemptId,
                                        },
                                    },
                                    "/results"
                                )
                            }
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
        </Box>
    );
};

MySubmissions.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};
