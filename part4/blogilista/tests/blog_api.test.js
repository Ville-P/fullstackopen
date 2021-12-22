const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./api_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

describe('blog api tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
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
    // Get token to create blogs for a user
    const user = { username: 'niceUser', password: 'salis' }
    await helper.createUser(user)
    const token = await helper.loginUser(api, user)

    const newBlog =
      {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://test.url',
        likes: 99,
      }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const updatedBlogs = await helper.blogsInDb()
    const authors = updatedBlogs.map(r => r.author)
    expect(updatedBlogs).toHaveLength(helper.initialBlogs.length + 1)
    expect(authors).toContain('Test Author')
  })

  test('a valid blog can not be added without authorization', async () => {
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
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length)
  })

  test('a blog without likes will have it defaulted to 0', async () => {
    // Get token to create blogs for a user
    const user = { username: 'niceUser', password: 'salis' }
    await helper.createUser(user)
    const token = await helper.loginUser(api, user)

    const newBlog =
      {
        title: 'Test Blog123',
        author: 'Test Author',
        url: 'http://test.url',
      }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
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
    // Get token to create blogs for a user
    const user = { username: 'niceUser', password: 'salis' }
    await helper.createUser(user)
    const token = await helper.loginUser(api, user)

    const brokenBlog = { author: 'Test Author' }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(brokenBlog)
      .expect(400)

    const updatedBlogs = await helper.blogsInDb()
    expect(updatedBlogs).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs can be deleted', async () => {
    // Get token to create blogs for a user
    const user = { username: 'niceUser', password: 'salis' }
    await helper.createUser(user)
    const token = await helper.loginUser(api, user)

    const newBlog =
      {
        title: 'blogi',
        author: 'niceUser',
        url: 'http://test.url'
      }
    const resp = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const id = resp.body.id
    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1)

    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const updatedBlogs = await helper.blogsInDb()
    expect(updatedBlogs).toHaveLength(helper.initialBlogs.length)
  })

  test('a blog can be edited', async () => {
    // Get token to create blogs for a user
    const user = { username: 'niceUser', password: 'salis' }
    await helper.createUser(user)
    const token = await helper.loginUser(api, user)
    const blogs = await helper.blogsInDb()

    const newBlog =
      {
        title: 'blogi2',
        author: 'niceUser',
        url: 'http://test.url'
      }
    const resp = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const id = resp.body.id

    const modifiedBlog =
      {
        title: resp.body.title,
        author: 'Modified Author',
        url: resp.body.url,
        likes: 1337,
      }

    await api
      .put(`/api/blogs/${id}`)
      .send(modifiedBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedBlogs = await helper.blogsInDb()
    const updatedBlog = updatedBlogs.find(blog => blog.author === 'Modified Author')
    expect(updatedBlogs).toHaveLength(helper.initialBlogs.length + 1)
    expect(updatedBlog).toBeDefined()
    expect(updatedBlog.likes).toBe(1337)
  })

})

describe('user api tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if user fields are not valid', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'foo',
      name: 'Superuser',
      password: 'bar',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('over 3 characters')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

})

afterAll(() => {
  mongoose.connection.close()
})
