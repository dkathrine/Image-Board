import { useState } from 'react'
import { Button, Card, CardHeader, CardContent, CardMedia, CssBaseline, Grid, Stack, Box, Typography, Container, Avatar, CardActionArea } from '@mui/material';
import { useFetch } from '../../hooks/useFetch';
import Navbar from '../../components/Navbar';
import PostModal from '../../components/PostModal';
import Copyright from '../../components/Copyright';


const Home = () => {
    const { data } = useFetch('http://localhost:3000/post/all');
    const [open, setOpen] = useState({});
    const handleOpen = (id) => setOpen(prev => ({ ...prev, [id]: true }));
    const handleClose = (id) => setOpen(prev => ({ ...prev, [id]: false }));


    return (
        <>
            <CssBaseline />
            <Navbar />
            <main>
                {/* Hero unit */}
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        pt: 8,
                        pb: 6,
                    }}
                >
                    <Container maxWidth="sm">
                        <Typography
                            component="h1"
                            variant="h2"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            YIP!
                        </Typography>
                        <Stack
                            sx={{ pt: 4 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                            <Button variant="contained" href='/create'>Post Something!</Button>
                        </Stack>
                    </Container>
                </Box>
                <Container sx={{ py: 8 }} maxWidth="lg">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {data?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((data) => (
                            <>
                                <Grid item key={data._id} xs={12} sm={6} md={3}>
                                    <Card>
                                        <CardActionArea sx={{ height: '32rem', display: 'flex', flexDirection: 'column' }} onClick={() => handleOpen(data._id)}>
                                            <CardMedia
                                                component="img"
                                                sx={{
                                                    height: 1 / 2
                                                }}
                                                image={data.postFile}
                                                alt="random"
                                                autoPlay
                                            />
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Box sx={{ wordWrap: "break-word", maxWidth: "300px", overflow: "auto" }}>
                                                    <Typography gutterBottom variant="h5" component="h2">
                                                        {data?.title}
                                                    </Typography>
                                                    <Typography>
                                                        {data.desc?.length > 30 ? data.desc?.slice(0, 30) + "..." : data.desc}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                            <CardHeader
                                                avatar={<Avatar variant="rounded" src={data.createdByPicture} />}
                                                title={data.createdByName}
                                            />
                                        </CardActionArea>
                                    </Card>
                                    <PostModal id={data._id} open={open[data._id] || false} close={() => handleClose(data._id)} />
                                </Grid>
                            </>
                        ))}
                    </Grid>
                </Container>
            </main >
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

export default Home