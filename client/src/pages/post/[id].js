// pages/post/[id].js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import PostItem from '../../components/PostItem';
import PostForm from '../../components/PostForm';

const PostPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPostAndComments = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // Fetch the specific post
      const resPost = await axios.get(`/api/posts/${id}`);
      setPost(resPost.data);

      // Fetch comments
      const resComments = await axios.get(`/api/posts/${id}/comments`);
      setComments(resComments.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  if (loading || !post) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Post Details
      </Typography>
      <PostItem post={post} />
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Comments
      </Typography>
      <PostForm parentId={id} onSuccess={() => fetchPostAndComments()} />
      {comments.length > 0 ? (
        comments.map(comment => (
          <PostItem key={comment._id} post={comment} depth={1} />
        ))
      ) : (
        <Typography variant="body1">No comments yet.</Typography>
      )}
    </Container>
  );
};

export default PostPage;
