import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    ModalOverlay,
    ModalFooter,
} from "@chakra-ui/react";
import { useState } from "react";
import { enrollToQuizCode } from "../../services/quiz";

export default function JoinQuiz({ open, setOpen }) {
    const [code, setCode] = useState("");
    const toast = useToast();

    const clickSubmit = async () => {
        if (!code) {
            toast({
                title: "Error",
                description: "Input quiz code",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } else {
            // send patch request
            enrollToQuizCode(code).then((data) => {
                console.log(data);
                if (data?.error){
                    toast({
                        title: "Error",
                        description: data?.error,
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                    setCode("")
                } else {
                    setCode("")
                    setOpen(false)
                    toast({
                        title: "Success",
                        description: data?.message,
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    });
                }
            });
        }
    };

    return (
        <>
            <Modal isOpen={open} onClose={setOpen} closeOnOverlayClick={false}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Join Quiz</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Quiz Code</FormLabel>
                            <Input
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Quiz Code"
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={clickSubmit}>
                            Submit
                        </Button>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
