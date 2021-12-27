import React, { useState } from 'react'

const Blog = ({blog}) => {
  const [fullView, setFullView] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return fullView ?
    (
      <div style={blogStyle}>
        {blog.title}
        <button onClick={()  => setFullView(false)}>hide</button><br/>
        {blog.url}<br/>
        likes {blog.likes}<button>like</button><br/>
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
