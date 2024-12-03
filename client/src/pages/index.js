// pages/index.js
import React from 'react';
import { Container, Typography } from '@mui/material';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';
import axios from 'axios';

const Home = () => {
  const handleNewPost = (newPost) => {
    // Optionally, refresh the post list or prepend the new post
    window.location.reload();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Anonymous Post System
      </Typography>
      <PostForm onSuccess={handleNewPost} />
      <PostList />
    </Container>
  );
};

export default Home;
