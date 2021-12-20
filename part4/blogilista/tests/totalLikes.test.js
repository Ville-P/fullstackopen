const listHelper = require('../utils/list_helper')
const blogLists = require('./exampleBlogs')

describe('total likes', () => {
  const listWithOneBlog = blogLists.listWithOneBlog
  const emptyList = blogLists.emptyList
  const listWithMultipleBlogs = blogLists.listWithMultipleBlogs

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has multiple blogs equals sum of their likes', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    expect(result).toBe(36)
  })

  test('when list is empty equals 0', () => {
    const result = listHelper.totalLikes(emptyList)
    expect(result).toBe(0)
  })
})
