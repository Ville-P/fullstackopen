import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('rendered blog is shown correctly with normal view', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'react-test',
    likes: 3,
    url: 'www.react-test.com'
  }

  const component = render(
    <Blog blog={blog} />
  )

  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
  expect(component.container).toHaveTextContent('react-test')
  expect(component.container).not.toHaveTextContent('3')
  expect(component.container).not.toHaveTextContent('www.react-test.com')
})

test('blog full view is shown after button click', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'react-test',
    likes: 3,
    url: 'www.react-test.com',
    user: { id:1 }
  }

  const component = render(
    <Blog blog={blog} user={{ id:1 }} />
  )

  const button = component.getByText('view')
  expect(component.container).not.toHaveTextContent('3')
  expect(component.container).not.toHaveTextContent('www.react-test.com')
  fireEvent.click(button)

  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
  expect(component.container).toHaveTextContent('react-test')
  expect(component.container).toHaveTextContent('3')
  expect(component.container).toHaveTextContent('www.react-test.com')
})

test('clicking like button calls event handler', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'react-test',
    likes: 3,
    url: 'www.react-test.com',
    user: { id:1 }
  }
  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} updateLikes={mockHandler} user={{ id:1 }} />
  )

  const viewButton = component.getByText('view')
  fireEvent.click(viewButton)
  const likeButton = component.getByText('like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
