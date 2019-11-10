import React from 'react';
import Comment from '../Comment';
import './style.css';

function PostHeader({ author, date }) {
  return (
    <div className="post-header">
      <img src={author.avatar} className="avatar" />
      <div className="header-info">
        <p>{author.name}</p>
        <small>{date}</small>
      </div>
    </div>
  );
}

function PostContent({ content }) {
  return (
    <div className="post-content">
      <p>{content}</p>
    </div>
  );
}

function Post({ post }) {
  return (
    <div className="post">
      <PostHeader author={post.author} date={post.date} />
      <PostContent content={post.content} />
      {post.comments.map(comment => 
        <Comment
          key={comment.id} 
          comment={comment}
        />
      )}
    </div>
  );
}

export default Post;