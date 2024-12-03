// components/PostForm.js
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';

const PostForm = ({ parentId = null, onSuccess }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/posts', {
        content,
        parentId,
      });
      setContent('');
      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      console.error(error);
      alert('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label={parentId ? 'Write a reply...' : 'Create a new post'}
        multiline
        fullWidth
        minRows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        variant="outlined"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ mt: 1 }}
      >
        {loading ? 'Posting...' : 'Post'}
      </Button>
    </Box>
  );
};

export default PostForm;
