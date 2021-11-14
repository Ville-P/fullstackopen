import React, { useState } from 'react'

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Header = ({text}) => {
  return (
    <>
      <h1>{text}</h1>
    </>
  )
}

const Statistics = ({type, counter}) => {
  return (
    <>
      <p>{type} {counter}</p>
    </>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClick = (type) => {
    switch (type) {
      case ("good"):
        return () => setGood(good + 1)
      case ("neutral"):
        return () => setNeutral(neutral + 1)
      case ("bad"):
        return () => setBad(bad +1)
      default:
        return () => console.log("Unrecognized button type")
    }
  }

  return (
    <div>
      <Header text="give feedback" />
      <Button handleClick={handleClick("good")} text="good" />
      <Button handleClick={handleClick("neutral")} text="neutral" />
      <Button handleClick={handleClick("bad")} text="bad" />
      <Header text="statistics" />
      <Statistics type="good" counter={good} />
      <Statistics type="neutral" counter={neutral} />
      <Statistics type="bad" counter={bad} />
    </div>
  )
}

export default App
