import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

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

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

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
    let existingPerson = persons.filter(person => person.name === newName)
    if (existingPerson.length > 0) {
      let edit = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      let oldPerson = existingPerson[0]
      if (edit) {
        personService
          .update(oldPerson.id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.filter(person => person.id !== oldPerson.id).concat(returnedPerson))
            setSuccessMessage(
              `Updated ${newName}`
            )
            setTimeout(() => {
                setSuccessMessage(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(
              `Information of ${newName} has already been removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
      setNewName('')
      setNewNumber('')
      return
    }
    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setSuccessMessage(
          `Added ${newName}`
        )
        setTimeout(() => {
            setSuccessMessage(null)
        }, 5000)
      })
      .catch(error => {
      setErrorMessage(
        `${error.response.data.error}`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      })
    setNewName('')
    setNewNumber('')
  }

  const removePerson = (oldPerson) => {
    if (window.confirm(`Delete ${oldPerson.name}?`)) {
      personService
      .remove(oldPerson.id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== oldPerson.id))
        setSuccessMessage(
          `Removed ${oldPerson.name}`
        )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
      .catch(error => {
      setErrorMessage(
        `${error.response.data.error}`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      })
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
      <Notification message={errorMessage} type={"error"}/>
      <Notification message={successMessage} type={"success"}/>
      <PersonFilter filterValue={newFilter} onChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm onSubmit={addPerson} newName={newName} newNumber={newNumber} onNameChange={handlePersonChange} onNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <PersonList persons={personsToShow} onPress={removePerson}/>
    </div>
  )

}

export default App
