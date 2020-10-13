const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

test('blogs are returned as json', async () => {
  await api
  .get('/api/blogs')
  .expect(200)
  .expect('Content-Type', /application\/json/);
});

const getToken = async () => {
  const credentials = {
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  };

  const res = await api
    .post('/api/login')
  .send(credentials);

  //console.log(res);
//  console.log('getting token');
  //console.log(res.body.token);
  return 'bearer ' + res.body.token;
}

test('id field as id', async () => {
  const blog = {
    author: "guy",
    title: 'title',
    url: 'url'
  };

  const token = await getToken();

  await api
  .post('/api/blogs')
  .send(blog)
  .set({Authorization: token})
  .expect(201)
  .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs');

  response.body.map(r => expect(r.id).toBeDefined());

});

test('blog count increments by one', async() => {
  const blog = {
    author: "Sample Blogger",
    title: 'title',
    url: 'url'
  };

  const token = await getToken();

  await api
  .post('/api/blogs')
  .send(blog)
  .set({Authorization: token})
  .expect(201)
  .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs');

  const contents = response.body.map(r => r.author);

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
  expect(contents).toContain('Sample Blogger');
});

test('likes field init', async() => {
  const blog = {
    author: "Sample Blogger",
    title: 'title',
    url: 'url'
  };


  const token = await getToken();

  await api
  .post('/api/blogs')
  .send(blog)
  .set({Authorization: token})
  .expect(201)
  .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs');

  const nBlog = response.body.filter(r => r.author === "Sample Blogger")[0];

  //console.log(nBlog);
  expect(nBlog.likes).toBeDefined();
  expect(nBlog.likes == 0);


});

test('invalid gets rejected', async() => {
  const blog = {
    author: "Sample Blogger",
    title: 'title'
  };

  const token = await getToken();

  await api
  .post('/api/blogs')
  .send(blog)
  .set({Authorization: token})
  .expect(400);
});

afterAll(() => {
  mongoose.connection.close();
})
