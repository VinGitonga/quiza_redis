import { useState, useEffect } from "react";
import {
    Heading,
    Box,
    Flex,
    Text,
    Avatar,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Icon,
    Stack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Card from "../components/Card";
import Layout from "../components/Layout";
import Loader from "../components/common/Loader";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import {
    IoCheckmarkDoneOutline,
    IoCloseOutline,
    IoWarningOutline,
    IoDiscOutline,
} from "react-icons/io5";

import useSWR from "swr";
import axios from "axios";
import Head from "next/head";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Results() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { attemptId } = router.query;

    const { data: attemptInfo } = useSWR(
        () => `/api/quiz/attempt/${attemptId}`,
        fetcher
    );

    useEffect(() => {
        if (attemptInfo) {
            setLoading(false);
        }
    }, [attemptInfo]);

    return (
        <Box px={8} style={{ fontFamily: "Poppins" }}>
            <Head>
                <title>Quiza | Results</title>
            </Head>
            <Heading py={5}>Results</Heading>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <Card>
                        <Flex
                            alignItems={"center"}
                            justifyContent={"space-between"}
                        >
                            <Flex alignItems={"center"}>
                                <Avatar
                                    size="lg"
                                    mr={5}
                                    src={"https://source.unsplash.com/random"}
                                />
                                <Text fontSize={"xl"}>
                                    {attemptInfo?.quizTitle}
                                </Text>
                            </Flex>
                            <Text fontSize={"md"}>
                                You scored {attemptInfo?.score} /{" "}
                                {attemptInfo?.responses?.length}
                            </Text>
                        </Flex>
                    </Card>
                    <Box mb={4} />
                    <Card>
                        <Heading py={5}>Responses</Heading>
                        <Accordion allowToggle>
                            {attemptInfo?.responses?.map((resp, i) => (
                                <QuestionItem key={i} response={resp} />
                            ))}
                        </Accordion>
                    </Card>
                </>
            )}
        </Box>
    );
}

const QuestionItem = ({ response }) => {
    const respIcon = (resp) => {
        if (
            String(resp?.selected).toLowerCase() ===
            String(resp?.correctAnswer).toLowerCase()
        ) {
            return (
                <Icon as={IoCheckmarkDoneOutline} w={4} h={5} color={"green"} />
            );
        } else if (String(resp?.selected) === null) {
            return (
                <Icon as={IoWarningOutline} w={4} h={5} color={"goldenrod"} />
            );
        } else {
            return <Icon as={IoCloseOutline} w={4} h={5} color={"red"} />;
        }
    };
    return (
        <AccordionItem my={3}>
            {({ isExpanded }) => (
                <>
                    <Heading as="h3" size={"sm"}>
                        <AccordionButton>
                            <Icon
                                as={isExpanded ? FiChevronDown : FiChevronRight}
                                w={6}
                                h={6}
                            />
                            <Box flex="1" textAlign="left">
                                {response?.description}
                            </Box>
                            {respIcon(response)}
                        </AccordionButton>
                    </Heading>
                    <AccordionPanel pb={4}>
                        <Stack spacing={4} direction={"column"}>
                            {response.options.map((opt, i) => (
                                <OptionItem
                                    resp={response}
                                    text={opt}
                                    key={i}
                                />
                            ))}
                        </Stack>
                    </AccordionPanel>
                </>
            )}
        </AccordionItem>
    );
};

const OptionItem = ({ resp, text }) => (
    <Stack spacing={4} direction={"row"} alignItems={"center"}>
        <Icon
            as={IoDiscOutline}
            w={4}
            h={4}
            color={
                resp.correctAnswer === text
                    ? "green"
                    : resp.selected === text
                    ? "red.500"
                    : "gray.800"
            }
        />
        <Text
            color={
                resp.correctAnswer === text
                    ? "green"
                    : resp.selected === text
                    ? "red.500"
                    : "gray.800"
            }
        >
            {text}
        </Text>
    </Stack>
);

Results.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};
