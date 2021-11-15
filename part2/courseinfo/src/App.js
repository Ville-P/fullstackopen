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

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      <Header text="Web development curriculum" />
      <Course courses={courses} />
    </div>
  )
}

export default App