import React, { useState } from 'react'

const PersonForm = ({onSubmit, newName, newNumber, onNameChange, onNumberChange}) => (
  <div>
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={newName} onChange={onNameChange}/>
      </div>
      <div>
        number: <input value={newNumber} onChange={onNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  </div>
)

const PersonFilter = ({filterValue, onChange}) => (
  <div>
    filter shown with: <input value={filterValue} onChange={onChange}/>
  </div>
)

const PersonList = ({persons}) => (
  <div>
    {persons.map( (person) =>
      <Person key={person.name} person={person} />
    )}
  </div>
)

const Person = ({person}) => (
  <p>{person.name} {person.number}</p>
)

const App = () => {
  const [ persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    let updatedPersons = [...persons]
    let newPerson = { name: newName, number: newNumber}
    if (persons.some( (person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      setNewName('')
      setNewNumber('')
      return
    }
    updatedPersons.push(newPerson)
    setPersons(updatedPersons)
    setNewName('')
    setNewNumber('')
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const personsToShow = !newFilter
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <PersonFilter filterValue={newFilter} onChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm onSubmit={addPerson} newName={newName} newNumber={newNumber} onNameChange={handlePersonChange} onNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <PersonList persons={personsToShow} />
    </div>
  )

}

export default App