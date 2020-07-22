import React, { useState, useEffect } from 'react';
import personService from './personService';

const Notification = ({ msg, style}) => {

  if(msg === null) {
    return null;
  }

  return (
    <div style={style}>
    {msg}
    </div>
  );
}

const SubmitForm = ({handleNameChange, handleNumberChange,
  addPerson, newName, number}) => (
  <div className="container">
  <form className="form">
  <div className="form-group">
  <input type="text" className="form-control"
  onChange={handleNameChange}
  value={newName} placeholder="Name" />
  </div>
  <div className="form-group">
  <input type="text" className="form-control"
  onChange={handleNumberChange}
  value={number} placeholder="number"/>
  </div>
  <button type="button" className="btn btn-primary"
  onClick={addPerson}>Add</button>
  </form>
  </div>
);

const SearchForm = ({handleSearchChange, addSearch, search}) => (
  <form className="form">
  <input type="text" className="form-control"
  onChange={handleSearchChange}
  value={search} placeholder="Search" />
  <button type="button" className="btn btn-primary"
  onClick={addSearch}>Search</button>
  </form>
);

const Phonebook = ({persons, match, deletePerson}) => (
  <div>
  <h2>Phonebook</h2>
  <ul>
  {
    persons.filter((person) =>
      match.test(person.name))
    .map((person, i) =>
      <div key={i}>
      <h5>{person.name}</h5>
      <h5>{person.number}</h5>
      <button
      onClick={(e) => deletePerson(e, person)}
      className='btn btn-danger'>
      Del
      </button>
      </div>
    )
  }
  </ul>
  </div>
)

const App = () => {

const messageStyle = {
  color: 'green',
  fontSize: '20px',
  bordeStyle: 'solid',
  borderRadius: '5px',
  padding: '10px',
  marginBottom: '10px'
}

const errorStyle = {
  color: 'red',
  fontSize: '20px',
  bordeStyle: 'solid',
  borderRadius: '5px',
  padding: '10px',
  marginBottom: '10px'
}

  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [number, setNumber] = useState('');
  const [match, setMatch]   = useState(new RegExp('[sS]*'));
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [style, setStyle] = useState(messageStyle);

  useEffect(() => {
    personService.getAll()
    .then(initialPersons => {
      setPersons(initialPersons);
    })
  }, []);

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  }
    
  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNumber(event.target.value);
  }

  const addPerson = (event) => {
    event.preventDefault();

    var result = persons.find(person => {
      return person.name === newName;
    });

    const personObject = {
      name: newName,
      number: number
    };

    if(result !== undefined) {
      let r = window.confirm("set new number for " + newName + "?");

      if(r === false)
        return;

      personService.update(result.id, personObject)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id !== result.id
          ? person : returnedPerson))
      }).catch(error => {
        setStyle(errorStyle);
        setMessage(`${result.name} had been deleted`);
        setTimeout(() => {
          setMessage(null)
          setStyle(messageStyle);
        }, 5000);
        console.log('Tried to delete non existing entry from server');
        return;
      });

      setMessage(`${result.name}'s number was updated`);
      setTimeout(() => {
        setMessage(null)
      }, 5000);

      setNewName('');
      setNumber('');
      return;
    }
      
    setMessage(`${personObject.name} was added`);
    setTimeout(() => {
      setMessage(null)
    }, 5000);
    personService.create(personObject)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson));
    })

    setNewName('');
    setNumber('');
  }

  const deletePerson = (event, person) => {
    event.preventDefault();

    let r = window.confirm('Sure you want to del ' + person.name + '?');

    if(r === true) {
      personService.deletePer(person.id)
      .then(request => {
        let idx = persons.indexOf(person);
        console.log('idx ' + idx);

        if(idx === -1)
          return;

        const nPersons = persons.filter((per) => per !== person);
        setPersons([...nPersons]);

        setMessage(`${person.name} was deleted`);
        setTimeout(() => {
          setMessage(null)
        }, 5000);
      });
    }
  }

  const addSearch = (event) => {
    event.preventDefault();
    setMatch(new RegExp(search));
    setSearch('');
  }

  const handleSearchChange = (event) => {
    console.log(event.target.value);
    setSearch(event.target.value);
  }

  return (
    <div>
    <Notification msg={message} style={style}/>
    <Phonebook persons={persons} match={match} deletePerson={deletePerson}/>
    <SearchForm handleSearchChange={handleSearchChange}
    addSearch={addSearch}
    search={search}
    />
    <SubmitForm handleNameChange={handleNameChange} 
    handleNumberChange={handleNumberChange}
    addPerson={addPerson}
    newName={newName}
    number={number}
    />
    <h2>Numbers</h2>
    </div>
  )
};

export default App;
