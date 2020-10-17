import React from 'react'

const everything = ( {blog} ) => (
  <div>
  {blog.title} {blog.author} likes {blog.likes}
  </div>
)

const narrow = ({ blog }) => (
  <div>
  {blog.title} {blog.author}
  </div>
)

const Blog = ({ blog }) => (
  <div>
  {blog.showAll ? everything({blog})
    : narrow({blog})}
  </div>
)

export default Blog
