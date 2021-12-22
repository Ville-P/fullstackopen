const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})


usersRouter.post('/', async (request, response) => {

  const body = request.body
  const usernameLength = body.username ? body.username.length : 0
  const passwordLength = body.password ? body.password.length : 0
  if (usernameLength <= 3 || passwordLength <= 3) {
    const msg = 'password and username must be over 3 characters'
    return response.status(400).json({ error: `${msg}` })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter
