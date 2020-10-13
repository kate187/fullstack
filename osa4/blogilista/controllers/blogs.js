const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
  .find({}).populate('user', {username: 1, name: 1});

  response.json(blogs.map(u => u.toJSON()));
  console.log('foobar');
});

blogsRouter.get('/', (request, response) => {
  logger.info('receiving get');
  Blog.find({}).then(blogs => {
    response.json(blogs.map(blog => blog.toJSON()));
  });
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
  .then(blog => {
    if(blog) {
      response.json(blog.toJSON());
    } else {
      response.status(404).end();
    }
  }).catch(error => next(error))
})

/*
const getTokenFrom = request => {
  const authorization = request.get('authorization');
  if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
}*/

blogsRouter.post('/', async (request, response, next) => {
  logger.info('receiving post request');

 // logger.info(request);
  //const blog = new Blog(request.body);

  const body = request.body;

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if(!request.token || !decodedToken.id) {
    return response.status(401).json({error: 'token missing or invalid' });
  }
  
  const user = await User.findById(decodedToken.id);

  logger.info('user: ' + user);

  if(!body.title || !body.url || !user)
  {
    response.status(400).end();
    return;
  }

  logger.info('user id: ' + user._id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id
  });

  const savedBlog = await blog.save();
  
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog.toJSON());
});

blogsRouter.delete('/:id', async (request, response, next) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if(!request.token || !decodedToken.id) {
    return response.status(401).json({error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);
  const blog = await Blog.findById(request.params.id);

  if(!blog) {
    return response.status(204).end();
  }

  if(blog.user.toString() !== decodedToken.id.toString()) {
    return response.status(401).end('Not authenticated');
  }

  const deletedBlog = await Blog.findByIdAndRemove(request.params.id);

  return response.status(204).end();
})

blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body;

  const blog = {
    likes: body.likes
  }

  Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
  .then(updatedBlog => {
    response.json(updatedBlog.toJSON())
  })
  .catch(error => next(error));
})

module.exports = blogsRouter
