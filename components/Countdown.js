import { Stack, Text } from "@chakra-ui/react";
import Countdown from "react-countdown";

const Counter = ({ title, totalTime, onComplete, isQuizCountdown = true }) => {
    const renderer = ({ hours, minutes, seconds, completed }) => (
        <Stack spacing={5} direction={"row"}>
            {completed ? (
                <>
                    <Text>
                        {isQuizCountdown
                            ? "Quiz Time has elapsed"
                            : "Quiz has already started, you can now take the quiz"}
                    </Text>
                </>
            ) : (
                <>
                    {totalTime < Date.now() ? (
                        <Text>You can take the quiz</Text>
                    ) : (
                        <>
                            <Text>{hours} Hours</Text>
                            <Text>{minutes} Minutes</Text>
                            <Text>{seconds} Seconds</Text>
                        </>
                    )}
                </>
            )}
        </Stack>
    );

    return (
        <Stack spacing={3}>
            <Text size={"lg"}>{title}</Text>
            {/* Time lapse */}
            <Countdown
                date={totalTime}
                renderer={renderer}
                onComplete={onComplete}
            />
        </Stack>
    );
};

export default Counter;
