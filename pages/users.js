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
import Navbar from "../components/Navbar";
import { IoEyeSharp } from "react-icons/io5";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url) => axios.get(url, fetcher).then((resp) => resp.data);

const Users = () => {
    const { data: users } = useSWR("/api/user", fetcher);

    return (
        <Box px={8} style={{ fontFamily: "Poppins" }}>
            <Navbar />
            <Heading py={5}>Users</Heading>
            <Card>
                {users?.map((user) => (
                    <UserItem key={user?.entityId} user={user} />
                ))}
            </Card>
        </Box>
    );
};

const UserItem = ({ user }) => {
    return (
        <Box mb={6}>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Flex alignItems={"center"}>
                    <Avatar
                        size="lg"
                        mr={5}
                        src={`https://avatars.dicebear.com/api/adventurer/${user?.name
                            .toLowerCase()
                            .replaceAll(" ", "")}.svg`}
                    />
                    {/* To add a push state */}
                    <Flex
                        alignItems={"flex-start"}
                        justifyContent={"space-between"}
                        flexDirection={"column"}
                    >
                        <Text fontSize={"xl"}>{user?.name}</Text>
                        <Text fontSize={"md"} color={"gray.500"}>
                            {user?.email}
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
                    {user?.isAdmin ? "Administrator" : "Student"}
                </Tag>
                <Tooltip
                    label={"View Profile"}
                    hasArrow
                    placement={"top"}
                    bg={"teal"}
                >
                    <IconButton
                        size={"md"}
                        icon={<IoEyeSharp />}
                        isRound
                        bg={"cyan.100"}
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

export default Users;
