import {
    Heading,
    Box,
    SimpleGrid,
    GridItem,
    Flex,
    Avatar,
    Text,
} from "@chakra-ui/react";
import Card from "../components/Card";
import { useSession } from "next-auth/react";
import Layout from "../components/Layout"
import Head from "next/head"

export default function Profile(){
    const { data } = useSession();

    return (
        <Box px={8} style={{ fontFamily: "Poppins" }}>
            <Head>
                <title>Quiza | My Profile</title>
            </Head>
            <Heading py={5}>Profile</Heading>
            <Box py={2} mx="auto">
                <SimpleGrid
                    w={{ base: "full", xl: 11 / 12 }}
                    columns={{ base: 1, lg: 11 }}
                    gap={{ base: 0, lg: 16 }}
                    // mx="auto"
                >
                    <GridItem colSpan={{ base: "auto", md: 4 }}>
                        <Card>
                            <Flex alignItems={"center"}>
                                <Avatar
                                    size={"2xl"}
                                    mr={5}
                                    src={`https://avatars.dicebear.com/api/adventurer/${data?.user?.name
                                        .toLowerCase()
                                        .replaceAll(" ", "")}.svg`}
                                />
                                <Heading>{data?.user?.name}</Heading>
                            </Flex>
                        </Card>
                    </GridItem>
                    <GridItem colSpan={{ base: "auto", lg: 7 }}>
                        <Card>
                            <SimpleGrid
                                columns={{ base: 4, md: 2, lg: 2 }}
                                spacing={"20px"}
                            >
                                <Box mx={2}>
                                    <Text
                                        color={"gray.400"}
                                        fontWeight={600}
                                        fontSize="sm"
                                        textTransform={"uppercase"}
                                    >
                                        Name
                                    </Text>
                                    <Text color={"gray.900"} fontSize={"md"}>
                                    {data?.user?.name}
                                    </Text>
                                </Box>
                                <Box mx={2}>
                                    <Text
                                        color={"gray.400"}
                                        fontWeight={600}
                                        fontSize="sm"
                                        textTransform={"uppercase"}
                                    >
                                        Email
                                    </Text>
                                    <Text color={"gray.900"} fontSize={"md"}>
                                    {data?.user?.email}
                                    </Text>
                                </Box>
                                <Box mx={2}>
                                    <Text
                                        color={"gray.400"}
                                        fontWeight={600}
                                        fontSize="sm"
                                        textTransform={"uppercase"}
                                    >
                                        Role
                                    </Text>
                                    <Text color={"gray.900"} fontSize={"md"}>
                                    {data?.user?.isAdmin ? "Administrator" : "Student"}
                                    </Text>
                                </Box>
                                <Box mx={2}>
                                    <Text
                                        color={"gray.400"}
                                        fontWeight={600}
                                        fontSize="sm"
                                        textTransform={"uppercase"}
                                    >
                                        Quizas Enrolled
                                    </Text>
                                    <Text color={"gray.900"} fontSize={"md"}>
                                        14
                                    </Text>
                                </Box>
                                <Box mx={2}>
                                    <Text
                                        color={"gray.400"}
                                        fontWeight={600}
                                        fontSize="sm"
                                        textTransform={"uppercase"}
                                    >
                                        Quizas Submitted
                                    </Text>
                                    <Text color={"gray.900"} fontSize={"md"}>
                                        12
                                    </Text>
                                </Box>
                            </SimpleGrid>
                        </Card>
                    </GridItem>
                </SimpleGrid>
            </Box>
        </Box>
    );
};

Profile.getLayout = function getLayout(page){
    return (
        <Layout>
            {page}
        </Layout>
    )
}