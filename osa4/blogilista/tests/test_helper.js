const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
  {
    author: 'Blogger Guy',
    likes: 4,
    title: 'title',
    url: 'url'
  },
  {
    author: 'Another Person',
    likes: 5,
    title: 'title',
    url: 'url'
  }
];

const nonExistingId = async () => {
  const blog = new Blog({ author: 'someone' });

  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
}

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();

})

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}
