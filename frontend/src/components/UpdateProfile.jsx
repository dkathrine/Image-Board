import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone';
import { Button, Card, Modal, Grid, Box, TextField, Typography } from '@mui/material';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = ({ open, close }) => {
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState();
    const navigate = useNavigate();

    const { user } = useUser();

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

    const handleUpdate = (e) => {
        e.preventDefault();
        patchData({ username, profilePicture });
    }

    const patchData = async ({ username, profilePicture }) => {
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('profilePicture', profilePicture);

            const response = await fetch(`http://localhost:3000/user/update/${user.id}`, {
                method: 'PATCH',
                body: formData,
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        } finally {
            navigate("/home");
            window.location.reload();
        }
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "50%",
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        height: "80vh"
    };

    return (
        <>
            {
                user && (
                    <Modal
                        open={open}
                        onClose={close}
                    >
                        <Card
                            sx={style}
                        >
                            <Box component="form" noValidate onSubmit={handleUpdate} sx={{ mt: 3 }}>
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
                                    Update Profile
                                </Button>
                                <Typography variant='caption'>
                                    You'll have to relog to see the changes!
                                </Typography>
                            </Box>
                        </Card>
                    </Modal>
                )
            }
        </>
    )
}

export default UpdateProfile