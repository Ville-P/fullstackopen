import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const author = component.container.querySelector('#author')
  const title = component.container.querySelector('#title')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(author, { target: { value: 'DaVinci' } })
  fireEvent.change(title, { target: { value: 'Coolest blog' } })
  fireEvent.change(url, { target: { value: 'monalisa.com' } })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].author).toBe('DaVinci')
  expect(createBlog.mock.calls[0][0].title).toBe('Coolest blog')
  expect(createBlog.mock.calls[0][0].url).toBe('monalisa.com')
})
