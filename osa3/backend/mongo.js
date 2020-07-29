const mongoose = require('mongoose');

if(process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];
const dbname = 'phonebook-app';

const url = 
  `mongodb+srv://user_person:${password}@cluster0.dta1l.mongodb.net/${dbname}?retryWrite=true&w=majority`

console.log("going to connect");
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true});
console.log("connect ok");

const personSchema = new mongoose.Schema({
  name: String, number: String
});

const Person = mongoose.model('Person', personSchema);
const alen = process.argv.length;

if(alen === 5) {

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  });

  person.save().then(response => {
    console.log('person saved!');
    mongoose.connection.close();
  });
}

if(alen === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person);
    });
    mongoose.connection.close();
  })
}

if(alen !== 3 && alen !== 5)
  console.log('supply name, pnr for params');
