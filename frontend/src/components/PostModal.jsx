import { useState, useEffect } from 'react'
import { Button, Card, CardHeader, CardActions, CardActionArea, CardContent, CardMedia, Typography, Avatar, Modal, Grid, Box, IconButton, Tooltip, Container, TextField, Divider, Stack } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useFetch } from '../hooks/useFetch';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import EditPost from './EditPost';

const PostModal = ({ id, open, close }) => {
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);
    const [comment, setComment] = useState("");

    const { data } = useFetch(`http://localhost:3000/post/${id}`);
    const { user } = useUser();

    const { deleteData, data: deletedData } = useFetch(`http://localhost:3000/post/delete/${data?._id}`, 'DELETE');

    const { patchData, data: patchedData } = useFetch(`http://localhost:3000/post/createComment/${data?._id}`, 'PATCH')

    const { patchData: deleteComment, data: deletedComment } = useFetch(`http://localhost:3000/post/deleteComment/${data?._id}`, 'PATCH')

    const handleDelete = (e) => {
        e.preventDefault();
        deleteData();
    }

    const handleComment = (e) => {
        e.preventDefault();
        patchData({
            commentById: user.id,
            commentByName: user.username,
            commentByPicture: user.profilePicture,
            comment
        });
    }

    const handleCommentDelete = (commentId) => {

        deleteComment({
            commentId
        });

        setTimeout(() => {
            navigate("/home");
            window.location.reload();
        }, 1000)
    }

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

    useEffect(() => {
        if (deletedData) {
            navigate("/home")
            window.location.reload();
        }
    }, [deletedData, navigate])

    useEffect(() => {
        if (patchedData) {
            navigate("/home");
            window.location.reload();
        }
    }, [patchedData, navigate])

    useEffect(() => {
        if (deletedComment) {
            navigate("/home");
            window.location.reload();
        }
    }, [deletedComment, navigate])

    return (
        <>
            {
                data && (
                    <Modal
                        open={open}
                        onClose={close}
                        key={data._id}
                    >
                        <Card
                            sx={style}
                        >
                            <Grid container spacing={2} /* columns={2} */>
                                <Grid item xs={6}>
                                    <Tooltip title="Open Picture">
                                        <CardActionArea href={data.postFile} target='_blank' rel='noopener' sx={{ display: "flex", justifyContent: "center" }}>
                                            <CardMedia
                                                component="img"
                                                image={data.postFile}
                                                sx={{ height: "700px", width: "300px", objectFit: "contain", bgcolor: "black" }}
                                                alt="random"
                                            />
                                        </CardActionArea>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={6} sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                    <Box sx={{ wordWrap: "break-word", maxWidth: "330px", overflow: "auto" }}>
                                        <CardContent>
                                            {isEdit ? <EditPost id={data._id} /> : <>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    {data.title}
                                                </Typography>
                                                <Typography gutterBottom variant="body2" >
                                                    {data.desc}
                                                </Typography>
                                            </>}
                                            <Box mt={4} >
                                                <Typography mb={2}>
                                                    Comments:
                                                </Typography>
                                                <Container sx={{ overflowY: "scroll", height: "300px" }}>
                                                    {data.comments.map((comment) => (
                                                        <Box key={comment._id} sx={{ display: "flex", alignItems: "center" }}>
                                                            <Avatar variant='circle' src={comment.commentByPicture} sx={{ margin: "5px" }} />
                                                            <Stack>
                                                                <Typography variant='body1' fontWeight={700}>{comment.commentByName}</Typography>
                                                                <Typography variant='subtitle2'>{comment.comment}</Typography>
                                                                <Divider />
                                                            </Stack>
                                                            {
                                                                comment.commentById === user.id && (
                                                                    <IconButton sx={{ ml: 1 }}
                                                                        onClick={() => {
                                                                            handleCommentDelete(comment._id)
                                                                        }} color="inherit"><DeleteForeverIcon /></IconButton>
                                                                )
                                                            }
                                                        </Box>
                                                    ))}
                                                </Container>
                                            </Box>
                                        </CardContent>
                                    </Box>
                                    <Box>
                                        <Box component="form" mt={2} noValidate onSubmit={handleComment}>
                                            <TextField
                                                name="comment"
                                                required
                                                fullWidth
                                                id="comment"
                                                label="Write a comment!"
                                                onChange={(e) => setComment(e.target.value)} />
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                sx={{ mt: 2, mb: 2 }}>
                                                Submit
                                            </Button>
                                        </Box>
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <CardHeader
                                                avatar={<Avatar variant="rounded" src={data.createdByPicture} />}
                                                title={data.createdByName}
                                            />
                                            {
                                                data.createdById === user.id && (
                                                    <CardActions>
                                                        <Button size="small" onClick={() => setIsEdit((prevState) => !prevState)}>EDIT</Button>
                                                        <IconButton sx={{ ml: 1 }} onClick={handleDelete} color="inherit"><DeleteForeverIcon /></IconButton>
                                                    </CardActions>
                                                )
                                            }
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>
                    </Modal>
                )
            }
        </>
    )
}

export default PostModal