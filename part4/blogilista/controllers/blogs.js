const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const newBlog = await blog.save()
  user.blogs = user.blogs.concat(newBlog._id)

  // mongoose-unique-validator has a bug that does not work without
  // 'validateModifiedOnly: true':
  // https://github.com/blakehaswell/mongoose-unique-validator/issues/131
  await user.save({ validateModifiedOnly: true })

  response.status(201).json(newBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if ( blog.user.toString() === user.id.toString() ) {
    blog.deleteOne()
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'wrong user' })
  }
  await Blog.findByIdAndRemove(request.params.id)
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if ( blog.user.toString() === user.id.toString() ) {
    blog.title = body.title ? body.title : blog.title
    blog.author = body.author ? body.author : blog.author
    blog.url = body.url ? body.url : blog.url
    blog.likes = body.likes ? body.likes : blog.likes

    const updatedBlog = await blog.save()
    response.json(updatedBlog)
  } else {
    return response.status(401).json({ error: 'wrong user' })
  }
})

module.exports = blogsRouter
