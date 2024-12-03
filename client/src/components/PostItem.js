// components/PostItem.js
import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, TextField } from '@mui/material';
import axios from 'axios';
import CommentList from './CommentList';
import PostForm from './PostForm';

const PostItem = ({ post, depth = 0 }) => {
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [showReply, setShowReply] = useState(false);
  const [replies, setReplies] = useState(post.replies || []);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(post.content);

  const handleLike = async () => {
    try {
      const res = await axios.post(`/api/posts/${post._id}/like`);
      setLikes(res.data.likes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await axios.post(`/api/posts/${post._id}/dislike`);
      setDislikes(res.data.dislikes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`/api/posts/${post._id}`);
      // Optionally, trigger a refresh or remove the post from the state
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Error deleting post');
    }
  };

  const handleEdit = async () => {
    if (!content.trim()) return;
    try {
      await axios.put(`/api/posts/${post._id}`, { content });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Error editing post');
    }
  };

  const addReply = (newReply) => {
    setReplies([...replies, newReply]);
  };

  return (
    <Box sx={{ ml: depth * 4, mt: 2 }}>
      <Card variant="outlined">
        <CardContent>
          {isEditing ? (
            <>
              <TextField
                fullWidth
                multiline
                minRows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                variant="outlined"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleEdit}
                sx={{ mt: 1 }}
              >
                Save
              </Button>
              <Button
                variant="text"
                onClick={() => setIsEditing(false)}
                sx={{ mt: 1, ml: 1 }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body1" gutterBottom>
                {post.content}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date(post.timestamp).toLocaleString()}
                {post.edited && ' (edited)'}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Button size="small" onClick={handleLike}>
                  Like ({likes})
                </Button>
                <Button size="small" onClick={handleDislike}>
                  Dislike ({dislikes})
                </Button>
                <Button size="small" onClick={() => setShowReply(!showReply)}>
                  Reply
                </Button>
                <Button size="small" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
                <Button size="small" color="error" onClick={handleDelete}>
                  Delete
                </Button>
              </Box>
            </>
          )}
          {showReply && (
            <PostForm
              parentId={post._id}
              onSuccess={addReply}
            />
          )}
          {replies.length > 0 && (
            <CommentList comments={replies} depth={depth + 1} />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PostItem;
