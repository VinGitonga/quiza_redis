import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Heading,
    IconButton,
    Flex,
    Box,
    Icon,
    Tooltip,
    HStack,
    Stack,
    Text,
} from "@chakra-ui/react";
import Card from "../Card";
import { GrAdd } from "react-icons/gr";
import { CgTrash } from "react-icons/cg";
import { FiChevronRight, FiChevronDown, FiEdit3 } from "react-icons/fi";
import { IoDiscOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url) => axios.get(url).then((resp) => resp.data);

/**
 * Method to validate if the current user is the quiz author
 * returns falsly if the current user is author and vice versa
 * This is to ensure that the author only can edit and remove questions
 * Thus disabling the edit and remove buttons
 */

const validateUser = (currentUserId, authorUserId) =>
    String(currentUserId) === String(authorUserId) ? false : true;

const Questions = ({ quiz }) => {
    const { data: session } = useSession();
    const router = useRouter()
    console.log(quiz)

    const { data: questions } = useSWR(
        () => `/api/question/creating/${quiz?.id}`,
        fetcher
    );

    return (
        <Card>
            <Flex justify={"space-between"} mb={3}>
                <Heading>Questions</Heading>
                <Tooltip
                    label={"Add Question"}
                    hasArrow
                    placement={"top"}
                    bg={"teal"}
                >
                    <IconButton
                        size={"md"}
                        aria-label={"type"}
                        icon={<GrAdd />}
                        isRound
                        bg={"gray.300"}
                        onClick={() =>
                            router.push(
                                {
                                    pathname: "/create_question",
                                    query: { quizId: quiz?.id },
                                },
                                "/create_question"
                            )
                        }
                        disabled={validateUser(
                            session?.user?.id,
                            quiz?.authorId
                        )}
                    />
                </Tooltip>
            </Flex>
            {/* Our Accordion */}
            <Accordion allowToggle>
                {questions?.length === 0 ? (
                    <Text>No questions have been created yet.</Text>
                ) : (
                    <>
                        {questions?.map((question) => (
                            <QuestionItem
                                key={question?.entityId}
                                question={question}
                                isBtnDisabled={validateUser(
                                    session?.user?.id?.toString(),
                                    quiz?.authorId
                                )}
                            />
                        ))}
                    </>
                )}
            </Accordion>
        </Card>
    );
};

const QuestionItem = ({ question, isBtnDisabled }) => {
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
                            <Box
                                flex="1"
                                textAlign="left"
                                fontFamily={"Poppins"}
                            >
                                {question?.description}
                            </Box>
                            <HStack spacing={4}>
                                <Tooltip
                                    label={"Edit Question"}
                                    hasArrow
                                    placement={"left"}
                                    bg={"teal"}
                                >
                                    <IconButton
                                        size={"sm"}
                                        aria-label={"edit"}
                                        icon={<FiEdit3 />}
                                        isRound
                                        disabled={isBtnDisabled}
                                        bg={"gray.300"}
                                    />
                                </Tooltip>
                                <Tooltip
                                    label={"Remove Question"}
                                    hasArrow
                                    placement={"right"}
                                    bg={"teal"}
                                >
                                    <IconButton
                                        size={"sm"}
                                        aria-label={"remove"}
                                        icon={<CgTrash />}
                                        isRound
                                        disabled={isBtnDisabled}
                                        bg={"gray.300"}
                                    />
                                </Tooltip>
                            </HStack>
                        </AccordionButton>
                    </Heading>
                    <AccordionPanel pb={4}>
                        {question?.options?.map((opt, i) => (
                            <OptionItem
                                key={i}
                                color={
                                    question?.correctAnswer === opt
                                        ? "green"
                                        : "gray.800"
                                }
                                text={opt}
                            />
                        ))}
                    </AccordionPanel>
                </>
            )}
        </AccordionItem>
    );
};

const OptionItem = ({ color, text }) => (
    <Stack spacing={4} direction={"row"} alignItems={"center"}>
        <Icon as={IoDiscOutline} w={4} h={4} color={color} />
        <Text color={color}>{text}</Text>
    </Stack>
);

export default Questions;
