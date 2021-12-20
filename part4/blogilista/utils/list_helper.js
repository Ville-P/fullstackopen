const lodash = require('lodash')

const dummy = (blogs) => {
  const dummyCount = (blogs.length < 0) ? blogs.length : 1
  return dummyCount
}

const totalLikes = (blogs) => {
  let sumLikes = 0
  blogs.forEach(blog => {
    sumLikes += Number(blog.likes)
  })
  return sumLikes
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return undefined
  }
  const mostLiked = lodash.maxBy(blogs, 'likes')
  return mostLiked
}

const mostBlogs = (blogs) => {
  const authorCounts = lodash.countBy(blogs, (blog) => blog.author)
  const authorWithMostBlogs = lodash.max(Object.keys(authorCounts), (author) => authorCounts[author])
  const blogCount = authorCounts[authorWithMostBlogs]
  return { 'author': authorWithMostBlogs, 'blogs': blogCount }
}

const mostLikes = (blogs) => {
  const authorWorks = lodash.groupBy(blogs, (blog) => blog.author)
  const authorAndLikes = lodash.reduce(authorWorks, (result, data, author) => {
    result[author] = lodash.sumBy(data, 'likes')
    return result
  }, {})
  const authorWithMostLikes = lodash.max(Object.keys(authorAndLikes), (author) => authorAndLikes[author])
  const likeCount = authorAndLikes[authorWithMostLikes]
  return { 'author': authorWithMostLikes, 'likes': likeCount }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
