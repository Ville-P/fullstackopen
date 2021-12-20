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
  const blogs = await helper.blogsInDb()
  expect(blogs).toHaveLength(6)
})

test('all blogs have field id', async () => {
  const blogs = await helper.blogsInDb()
  blogs.forEach((blog) => {
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
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const updatedBlogs = await helper.blogsInDb()
  const authors = updatedBlogs.map(r => r.author)
  expect(updatedBlogs).toHaveLength(helper.initialBlogs.length + 1)
  expect(authors).toContain('Test Author')
})

test('a blog without likes will have it defaulted to 0', async () => {
  const newBlog =
    {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.url',
    }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const updatedBlogs = await helper.blogsInDb()
  const createdBlog = updatedBlogs.find(blog => blog.author === 'Test Author')
  expect(updatedBlogs).toHaveLength(helper.initialBlogs.length + 1)
  expect(createdBlog).toBeDefined()
  expect(createdBlog.likes).toBe(0)
})

test('an invalid blog is rejected correctly', async () => {
  const brokenBlog = { author: 'Test Author' }
  await api
    .post('/api/blogs')
    .send(brokenBlog)
    .expect(400)

  const updatedBlogs = await helper.blogsInDb()
  expect(updatedBlogs).toHaveLength(helper.initialBlogs.length)
})

test('blogs can be deleted', async () => {
  const blogs = await helper.blogsInDb()
  const id = blogs[0].id
  await api
    .delete(`/api/blogs/${id}`)
    .expect(204)

  const updatedBlogs = await helper.blogsInDb()
  expect(updatedBlogs).toHaveLength(helper.initialBlogs.length - 1)
})

test('a blog can be edited', async () => {
  const blogs = await helper.blogsInDb()
  const blog = blogs[0]
  const id = blog.id

  const modifiedBlog =
    {
      title: blog.title,
      author: 'Modified Author',
      url: blog.url,
      likes: 1337,
    }
  await api
    .put(`/api/blogs/${id}`)
    .send(modifiedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const updatedBlogs = await helper.blogsInDb()
  const updatedBlog = updatedBlogs.find(blog => blog.author === 'Modified Author')
  expect(updatedBlogs).toHaveLength(helper.initialBlogs.length)
  expect(updatedBlog).toBeDefined()
  expect(updatedBlog.likes).toBe(1337)
})

afterAll(() => {
  mongoose.connection.close()
})
