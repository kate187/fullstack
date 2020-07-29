require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
//app.use(logger);

//app.use(morgan('tiny'));
morgan.token('body', function (req) { return JSON.stringify(req.body); });
// Source https://stackoverflow.com/questions/51409771/logging-post-body-size-using-morgan-when-request-is-received
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

const Person = require('./models/person');

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;
  console.log('running here');

  const person = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
      res.json(updatedPerson);
    })
    .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  if(!body.name) {
    return res.status(400).json({
      error: 'name missing'
    });
  }
  if(!body.number) {
    return res.status(400).json({
      error: 'number missing'
    });
  }

  const name = String(body.name);

  Person.find({name: name}).then(persons => {
    if(persons.length > 0) {
      //app.put('asd');
      console.log(persons);
      return res.status(400).json({
        error: 'The name already exists.'
      });
    } else {
      console.log(name + ' does not exist');
    }

    const nPerson = new Person({
      name: name,
      number: body.number,
      //date: new Date(),
      //id: generateId()
    });

    nPerson.save().then(savedPerson => savedPerson.toJSON())
      .then(savedAndFormattedPerson => {
        res.json(savedAndFormattedPerson);
      })
      .catch(error => next(error));
  });

});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if(person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if(error.name === 'ValidationError') {
    return response.status(400).json({error: error.message});
  }

  next(error);
};

app.use(errorHandler);

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    const date = new Date();
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Phonebook has info for ' + persons.length + ' people.'
    + '\n' + date);

  });
});

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/persons/', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
