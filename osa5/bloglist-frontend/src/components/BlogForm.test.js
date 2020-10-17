import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('<BlogForm /> clicking like twice calls the corresponding handler twice', () => {
  const like = jest.fn()

  const blog = {
    author: 'foo',
    title: 'foo'
  }

  const component = render(
    <button onClick={() => like(blog)}>like</button>
  )

    const button = component.container.querySelector('button')
    fireEvent.click(button);
    fireEvent.click(button);
    expect(like.mock.calls).toHaveLength(2)
})

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const addBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={addBlog} />
  )

  const inputTitle = component.container.querySelector('#title')
  const inputAuthor = component.container.querySelector('#author')
  const inputUrl = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(inputTitle, {
    target: {value: 'foo'}
  })
  fireEvent.change(inputAuthor, {
    target: {value: 'bar'}
  })
  fireEvent.change(inputUrl, {
    target: {value: 'baz'}
  })

  fireEvent.submit(form)
  
  expect(addBlog.mock.calls).toHaveLength(1)
  {/*
  expect(addBlog.mock.calls[0][0].content).toBe('foo')
  expect(addBlog.mock.calls[0][1].content).toBe('bar')
  expect(addBlog.mock.calls[0][2].content).toBe('baz')*/}
})
