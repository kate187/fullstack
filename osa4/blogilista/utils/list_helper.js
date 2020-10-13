//const Blog = require('../models/blog');

const dummy = (blogs) => {
  // ...
  return 1;
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  }

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
}

const favouriteBlog = (blogs) => {
  const reducer = (fav, blog) => {
    return blog.likes > fav.likes ? blog : fav;
  }

  return blogs.length === 0 ? undefined : blogs.reduce(reducer, blogs[0]);
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}
