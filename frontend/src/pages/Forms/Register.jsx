import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Navbar from '../../components/Navbar';
import Copyright from '../../components/Copyright';

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profilePicture, setProfilePicture] = useState();

    const navigate = useNavigate();

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles) {
            setProfilePicture(acceptedFiles[0]);
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, accept: {
            'image/jpeg': [".jpeg"],
            'image/png': [".png"],
            'image/gif': [".gif"],
        }
    })

    const handleRegister = (e) => {
        e.preventDefault();
        postData({ username, email, password, profilePicture });
    }

    const postData = async ({ username, email, password, profilePicture }) => {
        if (profilePicture === "undefined") {
            profilePicture = "https://res.cloudinary.com/dhdugvhj3/image/upload/v1680609327/default_profile_picture/default_profile_picture_qssq71.jpg";
        }
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('profilePicture', profilePicture);

            const response = await fetch(`http://localhost:3000/user/register`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        } finally {
            navigate("/login");
        }
    };

    return (
        <>
            <Navbar />
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleRegister} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="username"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    autoFocus
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    {
                                        isDragActive ?
                                            <p>Drop the files here ...</p> :
                                            <p>{profilePicture ? `${profilePicture.name}` : "Drag 'n' drop your profile picture here, or click to select file!(Only .jpeg .png .gif)"}</p>
                                    }
                                </div>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href='/login' variant="body2" /* onClick={navigate("/login")} */>
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
            {/* Footer */}
            <Box sx={{ bgcolor: 'background.paper', p: 6 }
            } component="footer" >
                <Typography variant="h6" align="center" gutterBottom>
                    Footer
                </Typography>
                <Typography
                    variant="subtitle1"
                    align="center"
                    color="text.secondary"
                    component="p"
                >
                    Just a Footer!!!
                </Typography>
                <Copyright />
            </Box >
            {/* End footer */}
        </>
    )
}

export default Register