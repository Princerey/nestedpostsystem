// components/PostList.js
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Pagination, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import PostItem from './PostItem';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('desc');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/posts', {
        params: { page, limit: 2, sort },
      });
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      alert('Error fetching posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, sort]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2,mt:4 }}>
        <FormControl variant="outlined" size="small">
          <InputLabel>Sort By</InputLabel>
          <Select value={sort} onChange={handleSortChange} label="Sort By">
            <MenuItem value="desc">Most Recent</MenuItem>
            <MenuItem value="asc">Oldest</MenuItem>
          </Select>
        </FormControl>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} />
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        posts.map(post => <PostItem key={post._id} post={post} />)
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} />
      </Box>
    </Box>
  );
};

export default PostList;
