// components/CommentList.js
import React from 'react';
import PostItem from './PostItem';

const CommentList = ({ comments, depth }) => {
  return (
    <>
      {comments.map(comment => (
        <PostItem key={comment._id} post={comment} depth={depth} />
      ))}
    </>
  );
};

export default CommentList;
