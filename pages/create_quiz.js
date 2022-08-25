import { useState } from "react";
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    Textarea,
    useColorModeValue,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
    useToast,
    Alert,
    AlertIcon,
    Select,
} from "@chakra-ui/react";
import { FiEdit3 } from "react-icons/fi";
import { MdGraphicEq } from "react-icons/md";
import { createQuiz } from "../services/quiz";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Head from "next/head"

export default function CreateQuiz() {
    const router = useRouter();
    const toast = useToast();
    const [duration, setDuration] = useState(10);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [scheduledFor, setScheduledFor] = useState(new Date());
    const [quizType, setQuizType] = useState("private");
    const [loading, setLoading] = useState(false);

    const { data: session } = useSession();

    const clickSubmit = async () => {
        setLoading(true);
        const quiz = {
            title: title,
            duration: duration,
            description: description,
            authorId: session.user.id,
            quizType: quizType,
            scheduledFor: scheduledFor,
        };

        const resetForm = () => {
            setTitle("");
            setDescription("");
            setDuration(10);
            setLoading(false);
        };

        createQuiz(quiz)
            .then((data) => {
                if (data?.message) {
                    resetForm();
                    toast({
                        title: "Success",
                        description: data?.message,
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    });
                    router.push(
                        {
                            pathname: "/quiz_detail",
                            query: { quizId: data?.quizId },
                        },
                        "/quiz_detail"
                    );
                } else {
                    toast({
                        title: "Error",
                        description: data?.error,
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                }
                resetForm();
            })
            .finally(() => setLoading(false));
    };

    return (
        <Box>
            <Head>
                <title>Quiza | Create Quiz</title>
            </Head>
            <Flex
                justify={"center"}
                align={"flex-start"}
                bg={useColorModeValue("gray.50", "gray.800")}
                mt={2}
            >
                <Stack spacing={8} mx={"auto"} w={"450px"}>
                    <Stack align={"center"}>
                        <Heading fontSize={"4xl"}>Create Quiza</Heading>
                    </Stack>
                    <Box
                        rounded={"lg"}
                        bg={useColorModeValue("white", "gray.700")}
                        boxShadow={"lg"}
                        p={8}
                    >
                        <Stack spacing={4}>
                            <FormControl id="title">
                                <FormLabel>Title</FormLabel>
                                <Input
                                    variant={"flushed"}
                                    color={"gray.500"}
                                    placeholder={"React Native"}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </FormControl>
                            <FormControl id="description">
                                <FormLabel>Description</FormLabel>
                                <Textarea
                                    placeholder="Type something"
                                    size="md"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                />
                            </FormControl>
                            <FormControl id="duration">
                                <FormLabel>Duration</FormLabel>
                                <Slider
                                    aria-label="duration"
                                    defaultValue={duration}
                                    min={0}
                                    max={60}
                                    onChange={(val) => setDuration(val)}
                                >
                                    <SliderMark
                                        value={duration}
                                        mt="3"
                                        ml="-2.5"
                                        fontSize="sm"
                                    >
                                        {duration} min
                                    </SliderMark>
                                    <SliderTrack bg="red.100">
                                        <SliderFilledTrack bg="tomato" />
                                    </SliderTrack>
                                    <SliderThumb boxSize={6}>
                                        <Box color="tomato" as={MdGraphicEq} />
                                    </SliderThumb>
                                </Slider>
                            </FormControl>
                            <FormControl id="scheduledFor">
                                <FormLabel>Quiz Start Date and Time</FormLabel>
                                <Input
                                    variant={"flushed"}
                                    color={"gray.500"}
                                    placeholder="Select Quiz Start Date and Time"
                                    type={"datetime-local"}
                                    value={scheduledFor}
                                    onChange={(e) =>
                                        setScheduledFor(e.target.value)
                                    }
                                />
                            </FormControl>
                            <FormControl id="quizType">
                                <FormLabel>Quiz Type</FormLabel>
                                <Select
                                    placeholder="Select quiz type"
                                    onChange={(e) =>
                                        setQuizType(e.target.value)
                                    }
                                    value={quizType}
                                >
                                    <option value={"private"}>
                                        {"Private"}
                                    </option>
                                    <option value={"public"}>{"Public"}</option>
                                </Select>
                            </FormControl>
                            <Stack spacing={10} my={8}>
                                <Button
                                    bg={"blue.400"}
                                    color={"white"}
                                    leftIcon={<FiEdit3 />}
                                    isLoading={loading}
                                    loadingText={"Saving ..."}
                                    onClick={clickSubmit}
                                    _hover={{
                                        bg: "blue.500",
                                    }}
                                >
                                    Create
                                </Button>
                            </Stack>
                            <Alert status="info">
                                <AlertIcon />
                                Note That after creating the quiz you add
                                questions
                            </Alert>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </Box>
    );
}

CreateQuiz.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};
