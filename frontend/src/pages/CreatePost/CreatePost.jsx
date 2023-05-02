import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Button, CssBaseline, TextField, Grid, Box, Typography, Container } from '@mui/material';
import { useUser } from '../../hooks/useUser.js';
import Navbar from '../../components/Navbar.jsx';

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [postFile, setPostFile] = useState();
    const { user } = useUser();

    const navigate = useNavigate();

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles) {
            setPostFile(acceptedFiles[0]);
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, accept: {
            'image/jpeg': [".jpeg"],
            'image/png': [".png"],
            'image/gif': [".gif"],
            'video/mp4': [".mp4"],
        }
    })

    const handleRegister = (e) => {
        e.preventDefault();
        postData({ title, desc, postFile });
    }

    const postData = async ({ title, desc, postFile }) => {
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('desc', desc);
            formData.append('postFile', postFile);
            formData.append('createdById', user.id);
            formData.append('createdByName', user.username);
            formData.append('createdByPicture', user.profilePicture);

            const response = await fetch(`http://localhost:3000/post/create`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        } finally {
            navigate("/home");
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
                    <Typography component="h1" variant="h5">
                        Post Something!
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleRegister} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="title"
                                    required
                                    fullWidth
                                    id="title"
                                    label="Title"
                                    autoFocus
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="desc"
                                    label="Description"
                                    name="desc"
                                    onChange={(e) => setDesc(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    {
                                        isDragActive ?
                                            <p>Drop the files here ...</p> :
                                            <p>{postFile ? `${postFile.name}` : "Drag 'n' drop your file here, or click to select file!(Only .jpeg .png .gif .mp4)"}</p>
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
                            Post!
                        </Button>
                        <Button href='/home' fullWidth variant='outlined'>Back to Home</Button>
                    </Box>
                </Box>
            </Container>
        </>
    )
}

export default CreatePost