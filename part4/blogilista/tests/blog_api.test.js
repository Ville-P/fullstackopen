const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./api_helper')

const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct number of blogs is found', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(6)
})

test('all blogs have field id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined()
  })
})

test('a valid blog can be added', async () => {
  const newBlog =
    {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.url',
      likes: 99,
    }
  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const res = await api.get('/api/blogs')
  const authors = res.body.map(r => r.author)
  expect(res.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(authors).toContain('Test Author')
})

afterAll(() => {
  mongoose.connection.close()
})
