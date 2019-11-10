import React from 'react';
import './style.css';

function Comment({ comment }) {
  return (
    <div className="post-comment">
      <img src={comment.author.avatar} className="avatar-sm" />
      <div className="comment">
        <span>{comment.author.name}: </span>
        {comment.content}
      </div>
    </div>
  );
}

export default Comment;