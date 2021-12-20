const listHelper = require('../utils/list_helper')
const blogLists = require('./exampleBlogs')

describe('favorite blog', () => {
  const listWithOneBlog = blogLists.listWithOneBlog
  const emptyList = blogLists.emptyList
  const listWithMultipleBlogs = blogLists.listWithMultipleBlogs

  test('when list has only one blog, favorite is that', () => {
    const mostBlogs = { author: 'Edsger W. Dijkstra', 'blogs': 1 }
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual(mostBlogs)
  })

  test('when list has multiple blogs, favorite is the first most liked', () => {
    const mostBlogs = { 'author': 'Robert C. Martin', 'blogs': 3 }
    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    expect(result).toEqual(mostBlogs)
  })

  test('when list is empty return undefined author and blogs', () => {
    const mostBlogs = { 'author': undefined, 'blogs': undefined }
    const result = listHelper.mostBlogs(emptyList)
    expect(result).toEqual(mostBlogs)
  })
})
