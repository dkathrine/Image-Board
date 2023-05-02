import { useContext, useState } from 'react'
import CameraIcon from '@mui/icons-material/PhotoCamera';
import { AppBar, Button, Box, Toolbar, Typography, Avatar, IconButton, CardActionArea, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { ColorModeContext } from '../context/ThemeContext';
import Cookies from 'js-cookie';
import UpdateProfile from './UpdateProfile';

const Navbar = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { user } = useUser();

    const handleLogout = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:3000/user/logout", { method: "POST" })

        if (response.ok) {
            console.log(response);
            console.log("triggered");
            Cookies.remove("token");

            setTimeout(() => {
                navigate("/login");
                window.location.reload()
            }, 500);

        }

        return response.json();
    }

    const navigate = useNavigate();
    return (
        <>
            <AppBar position="relative">
                <Toolbar>
                    <CameraIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" color="inherit" noWrap>
                        YIP! Your Image Board
                    </Typography>
                    {user &&
                        <Box sx={{ display: "flex", alignItems: "center", position: "absolute", right: "20px" }}>
                            <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>
                            <Tooltip title="Update Profile">
                                <CardActionArea onClick={handleOpen} sx={{ display: "flex", }}>
                                    <Avatar variant="rounded" src={user?.profilePicture} sx={{ margin: "0px 20px" }} />
                                    <Typography variant="h6" color="inherit" sx={{ mr: 2 }} noWrap>
                                        {user && `${user?.username}`}
                                    </Typography>
                                </CardActionArea>
                            </Tooltip>
                            <Button variant='contained' onClick={handleLogout}>Logout</Button>
                        </Box>
                    }

                </Toolbar>
            </AppBar >
            <UpdateProfile open={open} close={handleClose} />
        </>
    )
}

export default Navbar