import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  const setBlogsSorted = (blogs) => {
    const sortedBlogs = blogs.sort((a, b) => {
      return b.likes - a.likes
    })
    setBlogs(sortedBlogs)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogsSorted( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )


      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage(`Logged in as ${user.name}`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      blogFormRef.current.toggleVisibility()
      setBlogsSorted(blogs.concat(returnedBlog))
      setSuccessMessage(`a new blog '${returnedBlog.title}' by ${returnedBlog.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage(`Blog creation failed with ${exception}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const removeBlog = async (blogObject) => {
    const confirm = window.confirm(`Remove '${blogObject.title}' by ${blogObject.author}`)
    if (!confirm) {
      return
    }
    try {
      await blogService.remove(blogObject.id)
      setBlogsSorted(blogs.filter(blog => blog.id !== blogObject.id))
      setSuccessMessage(`Blog '${blogObject.title}' by ${blogObject.author} removed`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage(`Blog removal failed with ${exception}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  const updateLikes = async (blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogObject.id, blogObject)
      const updatedBlogs = blogs
        .filter(blog => blog.id !== updatedBlog.id)
        .concat(updatedBlog)
      setBlogsSorted(updatedBlogs)
      setSuccessMessage(`Liked '${updatedBlog.title}'`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage(`Unable to like: ${exception}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }



  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} type={'error'}/>
      <Notification message={successMessage} type={'success'}/>

      {user === null ?
        <LoginForm
          loginHandler={handleLogin}
          username={username}
          usernameSetter={setUsername}
          passwordSetter={setPassword}
          password={password}
        /> :
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>
            logout
          </button>
          <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
            <BlogForm
              createBlog={addBlog}
            />
          </Togglable>
          <div id='blog-list'>
            {blogs.map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                updateLikes={updateLikes}
                user={user}
                removeBlog={removeBlog}
              />
            )}
          </div>
        </div>
      }
    </div>
  )
}

export default App
