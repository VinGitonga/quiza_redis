import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogOverlay,
    AlertDialogFooter,
    AlertDialogContent,
    AlertDialogCloseButton,
    AlertDialogHeader,
    Button,
} from "@chakra-ui/react";
import { useRef } from "react";

const ConfirmDialog = ({
    isOpen,
    onClose,
    title,
    description,
    onClickConfirm,
    isLoading = false,
    loadingText = "Saving",
    showNoBtn = true,
}) => {
    const cancelRef = useRef();

    return (
        <>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
                closeOnOverlayClick={false}
            >
                <AlertDialogOverlay />

                <AlertDialogContent>
                    <AlertDialogHeader>{title}</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>{description}</AlertDialogBody>
                    <AlertDialogFooter>
                        {showNoBtn && (
                            <Button
                                ref={cancelRef}
                                onClick={() => onClose(true)}
                            >
                                No
                            </Button>
                        )}
                        <Button
                            colorScheme="teal"
                            ml={3}
                            onClick={onClickConfirm}
                            isLoading={isLoading}
                            loadingText={loadingText}
                        >
                            Yes
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default ConfirmDialog;
