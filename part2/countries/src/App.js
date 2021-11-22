import React, { useState, useEffect } from 'react'
import axios from 'axios'

const CountrySearch = ({filterValue, onChange}) => (
  <div>
  find countries <input value={filterValue} onChange={onChange}/>
  </div>
)

const CountryView = ({countries}) => {
  if (countries.length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }
  if (countries.length > 1) {
    return (
      <CountryList countries={countries}/>
    )
  }

  if (countries.length === 1) {
    return (
      <Country country={countries[0]}/>
    )
  }
  return (
    <div>
      No matches for current filter
    </div>
  )
}

const CountryList = ({countries}) => (
  <div>
    {countries.map( (country) =>
      <p key={country.name}>{country.name}</p>
    )}
  </div>
)

const Country = ({country}) => (
  <div>
    <h1>{country.name}</h1>
    capital: {country.capital} <br/>
    population: {country.population}
    <Languages languages={country.languages}/>
    <Flag source={country.flag} name={country.name}/>
  </div>
)

const Languages = ({languages}) => (
  <ul>
    {languages.map( (language) =>
      <li key={language.name}>{language.name}</li>
    )}
  </ul>
)

const Flag = ({source, name}) => (
  <img src={source} alt={name} style={{ maxWidth: 100 }}></img>
)

const App = () => {
  const [ newFilter, setNewFilter ] = useState('')
  const [ countries, setCountries ] = useState([])

  useEffect(() => {
    axios
      .get('https://restcountries.com/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const countriesToShow = !newFilter
  ? countries
  : countries.filter(country => country.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <CountrySearch  filterValue={newFilter} onChange={handleFilterChange} />
      <CountryView countries={countriesToShow}/>
    </div>
  )
}

export default App