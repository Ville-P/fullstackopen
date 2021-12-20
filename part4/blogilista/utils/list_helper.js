const dummy = (blogs) => {
  return 1
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
    return null
  }
  const reducer = (mostLiked, nextItem) => {
    return (mostLiked.likes >= nextItem.likes) ? mostLiked : nextItem
  }
  return blogs.reduce(reducer, blogs[0])
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
