import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import "@fontsource/poppins";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    const getLayout = Component.getLayout || ((page) => page);
    return (
        <ChakraProvider>
            <SessionProvider session={session}>
                {getLayout(<Component {...pageProps} />)}
            </SessionProvider>
        </ChakraProvider>
    );
}

export default MyApp;
