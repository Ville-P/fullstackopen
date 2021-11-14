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

const Statistics = ({good, neutral, bad}) => {
  if ([good, neutral, bad].every((count) => count == 0)) {
    return (
      <>
        <p>
          No feedback given
        </p>
      </>
    )
  }
  let total = good + neutral + bad
  let avg = (good - bad) / (total)
  let positive = (good / total) * 100
  return (
    <>
      <p>good {good}
      <br />neutral {neutral}
      <br />bad {bad}
      <br />total {total}
      <br />average {avg}
      <br />positive {positive} %</p>
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
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
