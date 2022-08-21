import { Flex, useColorModeValue, Box } from "@chakra-ui/react";

const Card = ({ children }) => (
    <Flex
        bg={useColorModeValue("#F9FAFB", "gray.600")}
        w="full"
        alignItems="center"
        justifyContent="center"
        pos="relative"
        mb={6}
    >
        <Box pos="absolute" top={0} w="full" h={1} bgColor={"#3e5b7f"} borderBottomLeftRadius={'lg'} borderBottomRightRadius={'lg'}></Box>
        <Box
            px={8}
            py={4}
            rounded="lg"
            shadow="lg"
            bg={useColorModeValue("white", "gray.800")}
            w={'full'}
        >
            {children}
        </Box>
    </Flex>
);

export default Card;