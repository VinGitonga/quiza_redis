import { Heading, Flex, Avatar, Box, Text, SimpleGrid } from "@chakra-ui/react";
import Card from "../Card";

const Info = ({ quiz }) => {
    return (
        <Card>
            <Flex alignItems={'center'}>
                <Avatar
                    size={'2xl'}
                    mr={5}
                    src={'https://source.unsplash.com/random'}
                />
                <Heading>{quiz?.title}</Heading>
            </Flex>
            <Box mt={2}>
                <SimpleGrid columns={{ base: 4, md: 2, lg: 2 }} spacing={'20px'}>
                    <Box mx={2}>
                        <Text color={'gray.400'} fontWeight={600} fontSize='sm' textTransform={'uppercase'}>Duration</Text>
                        <Text color={'gray.900'} fontSize={'md'}>{quiz?.duration} min</Text>
                    </Box>
                    <Box mx={2}>
                        <Text color={'gray.400'} fontWeight={600} fontSize='sm' textTransform={'uppercase'}>Quiza Code</Text>
                        <Text color={'gray.900'} fontSize={'md'}>{quiz?.quizCode}</Text>
                    </Box>
                </SimpleGrid>
                <Box mx={2} my={5}>
                    <Text color={'gray.400'} fontWeight={600} fontSize='sm' textTransform={'uppercase'}>Description</Text>
                    <Text color={'gray.900'} fontSize={'md'}>{quiz?.description}</Text>
                </Box>
            </Box>
        </Card>
    )
}

export default Info;