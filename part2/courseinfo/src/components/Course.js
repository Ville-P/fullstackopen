import React from 'react'

const Header = ({text}) => (
    <>
      <h1>{text}</h1>
    </>
  )
  
  const Part = ({name, exercises}) => (
    <>
      <p>
        {name} {exercises}
      </p>
    </>
  )
  
  const Content = ({parts}) => (
    <>
      {parts.map(part =>
        <Part key={part.id} name={part.name} exercises={part.exercises}/>
      )}
    </>
  )
  
  const Total = ({parts}) => {
    const total = parts.reduce((partTotal, part) => partTotal + part.exercises, 0)
    return (
      <>
        <b>Number of exercises {total}</b>
      </>
    )
  }
  
  const Course = ({courses}) => (
    <>
      {courses.map(course =>
        <div key={course.id}>
          <Header text={course.name} />
          <Content parts={course.parts} />
          <Total parts={course.parts} />
        </div>
      )}
    </>
  )

export default Course