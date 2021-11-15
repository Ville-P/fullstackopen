import React, { useState } from 'react'

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Header = ({text}) => (
  <>
    <h1>{text}</h1>
  </>
)

const DisplayVotes = ({votes}) => (
  <>
    has {votes} votes
  </>
)

const DisplayMostVoted = ({votes, anecdotes}) => {
  let indexMaxVotes = 0
  let maxVotes = 0
  for (let index = 0; index < votes.length; index++) {
    let currentVotes = votes[index]
    if (currentVotes > maxVotes) {
      maxVotes = currentVotes
      indexMaxVotes = index
    }
  }
  return (
    <>
      {anecdotes[indexMaxVotes]} <br />
      <DisplayVotes votes={votes[indexMaxVotes]} /> 
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const changeAnecdote = () => {
    let random = Math.floor(Math.random() * anecdotes.length);
    if (random === selected) {
      random = (random + 1) % anecdotes.length
    }
    return () => setSelected(random)
  }

  const voteAnecdote = () => {
    let currentVotes = [...votes]
    currentVotes[selected] += 1
    return () => setVotes(currentVotes)
  }

  return (
    <div>
      <Header text="Anecdote of the day" />
      {anecdotes[selected]} <br />
      <DisplayVotes votes={votes[selected]} /> <br />
      <Button handleClick={voteAnecdote()} text="vote" />
      <Button handleClick={changeAnecdote()} text="next anecdote" />
      <Header text="Anecdote with most votes" />
      <DisplayMostVoted votes={votes} anecdotes={anecdotes} />
    </div>
  )
}

export default App
