const listHelper = require('../utils/list_helper')
const blogLists = require('./exampleBlogs')

describe('most likes', () => {
  const listWithOneBlog = blogLists.listWithOneBlog
  const emptyList = blogLists.emptyList
  const listWithMultipleBlogs = blogLists.listWithMultipleBlogs

  test('when list has only one blog, most liked is that', () => {
    const mostLikes = { author: 'Edsger W. Dijkstra', 'likes': 5 }
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result).toEqual(mostLikes)
  })

  test('when list has multiple blogs, most liked is any of the author with same amount', () => {
    const mostLikes = { 'author': 'Robert C. Martin', 'likes': 12 }
    const result = listHelper.mostLikes(listWithMultipleBlogs)
    expect(result).toEqual(mostLikes)
  })

  test('when list is empty return undefined author and blogs', () => {
    const mostLikes = { 'author': undefined, 'likes': undefined }
    const result = listHelper.mostLikes(emptyList)
    expect(result).toEqual(mostLikes)
  })
})
