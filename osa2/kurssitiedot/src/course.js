import React from 'react';

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
      <Part key={part.id} name={part.name} numEx={part.numEx}/>);
  return (
    <div>
      {elems}
    </div>
  );
}

const Total = ({parts}) => {
  const total = parts.reduce((a, b) => ({exercises: a.exercises + b.exercises}));
  console.log(total.exercises);
  return (<p>Total {total.exercises}</p>);
}

const Course = ({course}) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  );
}

export default Course;
