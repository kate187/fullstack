import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Country = ({country, weather}) => (
      <div>
      <img src={country.flag} alt="flag" width="200" height="160"/>
      <h5>{country.name}</h5>
      <h5>capital: {country.capital}</h5>
      <h5>Weather: good</h5>
      <h5>Feels like: {weather.feelslike}</h5>
      </div>
)

const matchedCountries_ = (countries, match) => {
    return countries.filter((country) =>
      match.test(country.name));
}

const CountryList = ({countries, num, match, setMatch, weather}) => (
  <div>
  <h2>Countries</h2>
  <ul>
  {
    num === 1 ?
    countries.filter((country) =>
      (match.test(country.name)))
    .map((country, i) =>
      <Country key={i} country={country} weather={weather}/>
    )
    :
    (num < 10) ?
    countries.filter((country, i) =>
      (match.test(country.name)))
    .map((country, i) =>
      <div key={i}>
      <h5>{country.name}</h5>
      <button type="button" className="btn btn-primary"
      onClick={() => setMatch(new RegExp(country.name, "i"))}>Show</button>
      </div>
    ) :
    <div>
    <h5>Too many</h5>
    </div>
  }
  </ul>
  </div>
)

const SearchForm = ({handleSearchChange, search, addSearch}) => (
    <form className="form">
    <input type="text" className="form-control"
    onChange={handleSearchChange}
    value={search} placeholder="Search" />
    <button type="button" className="btn btn-primary"
    onClick={addSearch}>Search</button>
    </form>
)

const App = () => {
  const [countries, setCountries] = useState([]);
  const [match, setMatch]   = useState(new RegExp('nothing'));
  const [search, setSearch] = useState('');
  const [weather, setWeather] = useState('');

  useEffect(() => {
    console.log('effect');
    let url = 'http://restcountries.eu/rest/v2';
    axios.get(url)
    .then(response => {
      console.log('promise fulfilled');
      setCountries(response.data);
    });
  }, []);

  const addSearch = (event) => {
    event.preventDefault();
    setMatch(new RegExp(search, "i"));
    setSearch('');
  }

  const handleSearchChange = (event) => {
    console.log(event.target.value);
    setSearch(event.target.value);
  }

  const matchedCountries = matchedCountries_(countries, match);
  const num = matchedCountries.length;
  const key = process.env.REACT_APP_API_KEY;
  const weather_url = ('http://api.weatherstack.com/current?access_key=' +
    key + '&query=') + (num === 1 ? matchedCountries[0].capital : 'no_capital');

  console.log(weather_url);
  console.log(key);

  useEffect(() => {
    console.log('weather');

    axios.get(weather_url)
    .then(response => {
      console.log(response.data);
      setWeather(response.data);
    });
  }, [weather_url]);

  console.log(num);

  return (
    <div>
    <SearchForm
      handleSearchChange={handleSearchChange}
      search={search}
      addSearch={addSearch}
    />
    <CountryList
      countries={countries}
      num={num}
      match={match}
      setMatch={setMatch}
      weather={weather}
    />
    </div>
  );
}

export default App;
