import { Spinner } from "@chakra-ui/react";

const Loader = () => (
    <div
        style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.3,
        }}
    >
        <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
        />
    </div>
);

export default Loader;
