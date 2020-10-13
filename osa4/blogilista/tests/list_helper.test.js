const listHelper = require('../utils/list_helper');

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('total likes', () => {
  const listWithOneBlog = [
    {
      author: 'Blogger Guy',
      likes: 4
    }
  ];

  test('when list', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(4);
  })
})

describe('fav blog', () => {
  const blogs = [
    {
      author: 'Blogger Guy',
      likes: 4
    },
    {
      author: 'Another Person',
      likes: 5
    }
  ];

  test('from a list', () => {
    const res = listHelper.favouriteBlog(blogs);
    expect(res).toBe(blogs[1]);
  })
})
