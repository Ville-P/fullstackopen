import React, { useState, useEffect } from 'react'
import personService from './services/persons'

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

const PersonList = ({persons, onPress}) => (
  <div>
    {persons.map( (person) =>
      <Person key={person.name} person={person} onPress={onPress}/>
    )}
  </div>
)

const Person = ({person, onPress}) => (
  <div>
    {person.name} {person.number}
    <button onClick={() => onPress(person)}>delete</button>
  </div>
)

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')

  useEffect(() => {
    personService
    .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    let newPerson = { name: newName, number: newNumber}
    if (persons.some( (person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      setNewName('')
      setNewNumber('')
      return
    }
    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
      })
    setNewName('')
    setNewNumber('')
  }

  const removePerson = (oldPerson) => {
    if (window.confirm(`Delete ${oldPerson.name}?`)) {
      personService
      .remove(oldPerson.id)
      .then(
        setPersons(persons.filter(person => person.id !== oldPerson.id))
      )
    }
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
      <PersonList persons={personsToShow} onPress={removePerson}/>
    </div>
  )

}

export default App