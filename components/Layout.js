import Navbar from "./Navbar";
// import Appbar from "./common/Appbar"

export default function Layout({ children }) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
        </>
    );
}
