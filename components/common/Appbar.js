import * as React from 'react';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import BubbleChartOutlinedIcon from "@mui/icons-material/BubbleChartOutlined";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const ResponsiveAppBar = () => {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const { data } = useSession();
    const router = useRouter();

    const logout = async () => {
        const result = await signOut({
            redirect: false,
            callbackUrl: "/login",
        });
        router.push(result.url);
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static" color="secondary" >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <BubbleChartOutlinedIcon
                        sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontFamily: "Poppins",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        Quiza
                    </Typography>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            <MenuItem
                                onClick={() => router.replace("/quizzes")}
                            >
                                <Typography textAlign="center">
                                    Public Quizzes
                                </Typography>
                            </MenuItem>
                            <MenuItem
                                onClick={() => router.replace("/my_quizzes")}
                            >
                                <Typography textAlign="center">
                                    My Quizzes
                                </Typography>
                            </MenuItem>
                            {!data?.user?.isAdmin ? (
                                <MenuItem
                                    onClick={() =>
                                        router.replace("/my_submissions")
                                    }
                                >
                                    <Typography textAlign="center">
                                        My Submissions
                                    </Typography>
                                </MenuItem>
                            ) : (
                                <>
                                    <MenuItem
                                        onClick={() =>
                                            router.replace("/create_quiz")
                                        }
                                    >
                                        <Typography textAlign="center">
                                            Create New Quiz
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => router.replace("/users")}
                                    >
                                        <Typography textAlign="center">
                                            Users
                                        </Typography>
                                    </MenuItem>
                                </>
                            )}
                        </Menu>
                    </Box>
                    <BubbleChartOutlinedIcon
                        sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
                    />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                            fontFamily: "Poppins",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        Quiza
                    </Typography>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                        }}
                    >
                        <Button
                            onClick={() => router.replace("/quizzes")}
                            sx={{ my: 2, color: "white", display: "block" }}
                        >
                            Public Quizzes
                        </Button>
                        <Button
                            onClick={() => router.replace("/my_quizzes")}
                            sx={{ my: 2, color: "white", display: "block" }}
                        >
                            My Quizzes
                        </Button>
                        {!data?.user?.isAdmin ? (
                            <Button
                                onClick={() =>
                                    router.replace("/my_submissions")
                                }
                                sx={{ my: 2, color: "white", display: "block" }}
                            >
                                My Submissions
                            </Button>
                        ) : (
                            <>
                                <Button
                                    sx={{
                                        my: 2,
                                        color: "white",
                                        display: "block",
                                    }}
                                    onClick={() =>
                                        router.replace("/create_quiz")
                                    }
                                >
                                    Create Quiz
                                </Button>
                                <Button
                                    sx={{
                                        my: 2,
                                        color: "white",
                                        display: "block",
                                    }}
                                    onClick={() => router.replace("/users")}
                                >
                                    Users
                                </Button>
                            </>
                        )}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}
                            >
                                <Avatar
                                    alt={data?.user?.name}
                                    src={`https://avatars.dicebear.com/api/adventurer/${data?.user?.name
                                        .toLowerCase()
                                        .replaceAll(" ", "")}.svg`}
                                />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem
                                onClick={() => router.replace("/my_profile")}
                            >
                                <Typography textAlign="center">
                                    {data?.user?.name}
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={logout}>
                                <Typography textAlign="center">
                                    {"Logout"}
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default ResponsiveAppBar;
