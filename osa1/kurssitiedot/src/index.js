import React from 'react';
import ReactDOM from 'react-dom';

const Header = ({course}) => {
  return (
    <h1>{course}</h1>
  );
}

const Part = ({name, numEx}) => {
  return (
    <p> {name} {numEx} </p>
  );
}

const Content = ({parts}) => {
  const elems = parts.map((part) => 
      <Part name={part.name} numEx={part.numEx}/>);
  return (
    <div>
      {elems}
    </div>
  );
}

const Total = ({parts}) => {
  const total = parts.reduce((a, b) => ({exercises: a.exercises + b.exercises}));
  console.log(total.exercises);
  return (<p>Number of exercises {total.exercises}</p>);
}

const App = () => {

  const course = {
    name: 'Half Stack application development',
    parts: [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]
  };

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
