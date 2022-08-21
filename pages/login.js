import { useState } from "react";
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Icon,
    IconButton,
} from "@chakra-ui/react";
import { RiLoginCircleFill } from "react-icons/ri";
import { HiOutlineMail } from "react-icons/hi";
import { BiLock } from "react-icons/bi";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react"

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);


    const handleShowPass = () => setShowPass(!showPass);

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setLoading(false);
    };

    const clickSubmit = async () => {
        setLoading(true);

        await signIn('credentials', {
            redirect: false,
            email: email,
            password: password
        }).then((data) => {
            resetForm()
            console.log(data)
            router.replace('/profile')
        })
    };

    return (
        <Flex
            minH={"100vh"}
            align={"center"}
            justify={"center"}
            bg={useColorModeValue("gray.50", "gray.800")}
            fontFamily={"Poppins"}
        >
            <Stack spacing={8} mx={"auto"} w={"450px"}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"}>Welcome Back</Heading>
                    <Text fontSize={"lg"} color={"gray.600"}>
                        Signin to your account
                    </Text>
                </Stack>
                <Box
                    rounded={"lg"}
                    bg={useColorModeValue("white", "gray.700")}
                    boxShadow={"lg"}
                    p={8}
                >
                    <Stack spacing={4}>
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
                                        aria-label={"password"}
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
                        <Stack spacing={10}>
                            <Stack
                                direction={{ base: "column", sm: "row" }}
                                align={"start"}
                                justify={"space-between"}
                            >
                                <Checkbox>Remember me</Checkbox>
                                <Link color={"blue.400"}>Forgot password?</Link>
                            </Stack>
                            <Button
                                bg={"blue.400"}
                                color={"white"}
                                leftIcon={<RiLoginCircleFill />}
                                isLoading={loading}
                                loadingText={"Authenticating ..."}
                                onClick={clickSubmit}
                                _hover={{
                                    bg: "blue.500",
                                }}
                            >
                                Sign in
                            </Button>
                            <Link
                                color={"blue.400"}
                                onClick={() => router.push("/register")}
                            >
                                {" "}
                                Don&apos;t have an account? Register
                            </Link>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}
