import React from 'react'
const BlogForm = ({submitHandler, title, titleSetter, author, authorSetter, url, urlSetter}) => (
  <div>
    <h2>Create New</h2>
    <form onSubmit={submitHandler}>
      <div>
        title:
        <input
          type="text"
          value={title}
          name="title"
          onChange={({ target }) => titleSetter(target.value)}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          name="author"
          onChange={({ target }) => authorSetter(target.value)}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={url}
          name="url"
          onChange={({ target }) => urlSetter(target.value)}
        />
      </div>
        <button type="submit">create</button>
    </form>
  </div>
)

export default BlogForm
