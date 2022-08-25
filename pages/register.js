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
    Text,
    useColorModeValue,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    IconButton,
    Icon,
    RadioGroup,
    Radio,
    Link,
    useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { RiLoginCircleFill } from "react-icons/ri";
import { FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { BiLock } from "react-icons/bi";
import { register } from "../services/auth";
import Head from "next/head"

export default function Register() {
    const router = useRouter();
    const toast = useToast();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleShowPass = () => setShowPass(!showPass);

    const clickSubmit = async () => {
        let userInfo = {
            name: name,
            email: email,
            password: password,
            isAdmin: role === "Administrator" ? true : false,
        };

        setLoading(true);
        register(userInfo)
            .then((resp) => {
                if (resp?.message) {
                    toast({
                        title: "Success",
                        description: resp?.message,
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    });
                    router.push("/login");
                } else {
                    toast({
                        title: "Error",
                        description: resp?.error,
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                }
            })
            .finally(() => setLoading(false));
    };

    return (
        <Flex
            minH={"100vh"}
            align={"center"}
            justify={"center"}
            bg={useColorModeValue("gray.50", "gray.800")}
            fontFamily={"Poppins"}
        >
        <Head>
                <title>Quiza | Register</title>
            </Head>
            <Stack spacing={8} mx={"auto"} w={"600px"}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"}>Get Started with Quiza</Heading>
                    <Text fontSize={"lg"} color={"gray.600"}>
                        Create an account
                    </Text>
                </Stack>
                <Box
                    rounded={"lg"}
                    bg={useColorModeValue("white", "gray.700")}
                    boxShadow={"lg"}
                    p={8}
                >
                    <Stack spacing={4}>
                        <FormControl id="name">
                            <FormLabel>Name</FormLabel>
                            <InputGroup>
                                <InputLeftElement>
                                    <Icon as={FiUser} w={4} h={4} />
                                </InputLeftElement>

                                <Input
                                    type="text"
                                    variant={"flushed"}
                                    color={"gray.500"}
                                    placeholder={"Jack Ryan"}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </InputGroup>
                        </FormControl>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <InputGroup>
                                <InputLeftElement>
                                    <Icon as={HiOutlineMail} w={4} h={4} />
                                </InputLeftElement>
                                <Input
                                    type="email"
                                    variant={"flushed"}
                                    color={"gray.500"}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={"jack@outlook.com"}
                                />
                            </InputGroup>
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <InputLeftElement>
                                    <Icon as={BiLock} w={4} h={4} />
                                </InputLeftElement>
                                <Input
                                    type={showPass ? "text" : "password"}
                                    variant={"flushed"}
                                    color={"gray.500"}
                                    placeholder={"Password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <InputRightElement>
                                    <IconButton
                                        size={"sm"}
                                        aria-label={"type"}
                                        icon={
                                            showPass ? <FiEye /> : <FiEyeOff />
                                        }
                                        isRound
                                        onClick={handleShowPass}
                                        bg={"gray.300"}
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <FormControl id="confirmPassword">
                            <FormLabel>Confirm Password</FormLabel>
                            <InputGroup>
                                <InputLeftElement>
                                    <Icon as={BiLock} w={4} h={4} />
                                </InputLeftElement>
                                <Input
                                    type={showPass ? "text" : "password"}
                                    variant={"flushed"}
                                    color={"gray.500"}
                                    placeholder={"Confirm Password"}
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                                <InputRightElement>
                                    <IconButton
                                        size={"sm"}
                                        aria-label={"type"}
                                        icon={
                                            showPass ? <FiEye /> : <FiEyeOff />
                                        }
                                        isRound
                                        onClick={handleShowPass}
                                        bg={"gray.300"}
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <FormControl id="role">
                            <FormLabel>Role</FormLabel>
                            <RadioGroup value={role} onChange={setRole}>
                                <Stack spacing={5} direction="row">
                                    <Radio
                                        colorScheme="teal"
                                        color={"gray.500"}
                                        value="Administrator"
                                    >
                                        <Text
                                            color={"gray.500"}
                                            fontSize={"sm"}
                                        >
                                            Administrator
                                        </Text>
                                    </Radio>
                                    <Radio
                                        colorScheme="teal"
                                        color={"gray.500"}
                                        value="Student"
                                    >
                                        <Text
                                            color={"gray.500"}
                                            fontSize={"sm"}
                                        >
                                            Student
                                        </Text>
                                    </Radio>
                                </Stack>
                            </RadioGroup>
                        </FormControl>
                        <Button
                            bg={"blue.400"}
                            color={"white"}
                            isLoading={loading}
                            loadingText={"Saving your info ..."}
                            onClick={clickSubmit}
                            mt={10}
                            leftIcon={<RiLoginCircleFill />}
                            _hover={{
                                bg: "blue.500",
                            }}
                        >
                            Sign up
                        </Button>
                        <Link
                            color={"blue.400"}
                            onClick={() => router.push("/login")}
                        >
                            {" "}
                            Already have an account? Login
                        </Link>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}