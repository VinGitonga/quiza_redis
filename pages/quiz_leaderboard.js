import {
    Box,
    Flex,
    IconButton,
    Heading,
    Text,
    Avatar,
    Tooltip,
    Tag,
} from "@chakra-ui/react";
import Card from "../components/Card";
import Layout from "../components/Layout";
import { BsClipboardData } from "react-icons/bs";
import useSWR from "swr";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Head from 'next/head'

const fetcher = (url) => axios.get(url, fetcher).then((resp) => resp.data);

const getPercentageScore = (score, totalResponses) =>
    (score / totalResponses) * 100;

export default function QuizLeaderBoard() {
    const router = useRouter();
    const { quizId } = router.query;
    console.log(router.query)
    const { data: users } = useSWR(`/api/quiz/submissions/leaderboard/${quizId}`, fetcher);
    console.log(users)
    const { data } = useSession;

    return (
        <Box px={8} style={{ fontFamily: "Poppins" }}>
            <Head>
                <title>Quiza | Leaderboard</title>
            </Head>
            <Heading py={5}>Users</Heading>
            <Card>
                {users?.map((quizParticipant) => (
                    <UserItem
                        key={quizParticipant?.entityId}
                        user={quizParticipant}
                        isLoggedInUserAdmin={data?.user?.isAdmin}
                    />
                ))}
            </Card>
        </Box>
    );
}

const UserItem = ({ user, isLoggedInUserAdmin }) => {
    const router = useRouter();
    return (
        <Box mb={6}>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Flex alignItems={"center"}>
                    <Avatar
                        size="lg"
                        mr={5}
                        src={`https://avatars.dicebear.com/api/adventurer/${user?.userName?.toLowerCase()
                            .replaceAll(" ", "")}.svg`}
                    />
                    {/* To add a push state */}
                    <Flex
                        alignItems={"flex-start"}
                        justifyContent={"space-between"}
                        flexDirection={"column"}
                    >
                        <Text fontSize={"xl"}>{user?.userName}</Text>
                        <Text fontSize={"md"} color={"gray.500"}>
                            {`${getPercentageScore(
                                user?.score,
                                user?.responses?.length
                            )}%`}
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
                    {user?.quizTitle}
                </Tag>
                <Tooltip
                    label={"View Attempt"}
                    hasArrow
                    placement={"top"}
                    bg={"teal"}
                >
                    <IconButton
                        size={"md"}
                        icon={<BsClipboardData />}
                        isRound
                        bg={"cyan.100"}
                        disabled={!isLoggedInUserAdmin}
                        onClick={() => {
                            router.push(
                                {
                                    pathname: "/results",
                                    query: {
                                        userId: user?.attemptId,
                                    },
                                },
                                "/results"
                            );
                        }}
                    />
                </Tooltip>
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

QuizLeaderBoard.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};
