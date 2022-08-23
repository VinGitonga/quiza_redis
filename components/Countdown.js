import { Stack, Text, } from "@chakra-ui/react"
import Countdown from "react-countdown";


const Counter = ({ title, totalTime, onComplete }) => {
    const renderer = ({ hours, minutes, seconds }) => (
        <Stack spacing={5} direction={"row"}>
            <Text>{hours} Hours</Text>
            <Text>{minutes} Minutes</Text>
            <Text>{seconds} Seconds</Text>
        </Stack>
    )

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
    )
}

export default Counter;