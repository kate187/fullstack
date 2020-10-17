import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    author: 'asd',
    title: 'foobar',
    url: "fff",
    likes: 7

  }

  const component = render(
    <Blog blog={blog} />
  )

    expect(component.container).toHaveTextContent(
      'asd'
    )
    expect(component.container).toHaveTextContent(
      'foobar'
    )
    expect(component.container).not.toHaveTextContent(
      'fff'
    )
    expect(component.container).not.toHaveTextContent(
      '7'
    )
})
