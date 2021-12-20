const listHelper = require('../utils/list_helper')
const blogLists = require('./exampleBlogs')

describe('favorite blog', () => {
  const listWithOneBlog = blogLists.listWithOneBlog
  const emptyList = blogLists.emptyList
  const listWithMultipleBlogs = blogLists.listWithMultipleBlogs

  test('when list has only one blog, favorite is that', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual(listWithOneBlog[0])
  })

  test('when list has multiple blogs, favorite is the first most liked', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs)
    expect(result).toEqual(listWithMultipleBlogs[2])
  })

  test('when list is empty return null', () => {
    const result = listHelper.favoriteBlog(emptyList)
    expect(result).toBe(null)
  })
})
