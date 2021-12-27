import React, { useState } from 'react'

const Blog = ({blog, updateLikes}) => {
  const [fullView, setFullView] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = () => {
    updateLikes(
      {...blog, likes: blog.likes + 1 }
    )
  }

  return fullView ?
    (
      <div style={blogStyle}>
        {blog.title}
        <button onClick={()  => setFullView(false)}>hide</button><br/>
        {blog.url}<br/>
        likes {blog.likes}<button onClick={addLike}>like</button><br/>
        {blog.author}
      </div>
    ) : (
      <div style={blogStyle}>
        {blog.title}
        <button onClick={()  => setFullView(true)}>view</button>
      </div>
    )
}

export default Blog
