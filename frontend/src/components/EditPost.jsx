import { useState, useEffect } from 'react'
import { Button, Grid, Box, TextField } from '@mui/material';
import { useFetch } from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';

const EditPost = ({ id }) => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const navigate = useNavigate();

    const { patchData, data } = useFetch(`http://localhost:3000/post/update/${id}`, 'PATCH');

    const handleUpdate = (e) => {
        e.preventDefault();
        patchData({ title, desc });
    }

    useEffect(() => {
        if (data) {
            navigate("/home")
            window.location.reload();
        }
    }, [data, navigate])

    return (
        <Box component="form" noValidate onSubmit={handleUpdate} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        name="title"
                        required
                        fullWidth
                        id="title"
                        label="new Title"
                        autoFocus
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="desc"
                        label="new Description"
                        name="desc"
                        onChange={(e) => setDesc(e.target.value)}
                    />
                </Grid>
            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Update!
            </Button>
        </Box>
    )
}

export default EditPost