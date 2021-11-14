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

const StatisticsLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  if ([good, neutral, bad].every((count) => count === 0)) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
  let total = good + neutral + bad
  let avg = (good - bad) / (total)
  let positive = (good / total) * 100
  return (
    <table>
      <tbody>
        <StatisticsLine text="good" value={good}/>
        <StatisticsLine text="neutral" value={neutral}/>
        <StatisticsLine text="bad" value={bad}/>
        <StatisticsLine text="total" value={total}/>
        <StatisticsLine text="average" value={avg}/>
        <StatisticsLine text="positive" value={positive + " %"}/>
      </tbody>
    </table>
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
