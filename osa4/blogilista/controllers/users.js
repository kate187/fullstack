const usersRouter = require('express').Router();
const User = require('../models/user');
const logger = require('../utils/logger');
const bcrypt = require('bcrypt');

usersRouter.get('/', async (request, response) => {
  const users = await User
  .find({}).populate('blogs');

  response.json(users.map(u => u.toJSON()));
})

usersRouter.get('/:id', (request, response, next) => {
  User.findById(request.params.id)
  .then(user => {
    if(user) {
      response.json(user.toJSON());
    } else {
      response.status(404).end();
    }
  }).catch(error => next(error))
})

usersRouter.post('/', async (request, response, next) => {
  logger.info('receiving a post request');
  logger.info(request.body);

  const body = request.body;
  const saltRounds = 10;

  if(!body.username || !body.password || !body.name)
  {
    response.status(400).end();
    return;
  }

  if(body.username.length < 3 || body.password.length < 3)
  {
    response.status(400).end("Credentials not long enough");
    return;
  }

  const passwordHash = await bcrypt.hash(body.password, saltRounds);
  

  const user = new User({
    username: body.username,
    passwordHash: passwordHash,
    name: body.name
  });

  user.save()
  .then(savedUser => {
    response.status(201).json(savedUser);
  }).catch(error => next(error))
});

module.exports = usersRouter;
