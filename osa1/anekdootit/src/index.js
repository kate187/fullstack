import React, {useState } from 'react';
import ReactDOM from 'react-dom'

const App = (props) => {
  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState({0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5:0});

  const nSelect = () => {
    let idx = Math.floor(Math.random() * props.anecdotes.length);
    console.log(idx);
    setSelected(idx);
  };

  const vote = (idx) => {
    const copy = {...points};
    copy[idx]++;
    setPoints(copy);
  };

  const mostVoted = (votes) => {

    let curr = 0;
    let idx = 0;
    let highest = 0;

    for(let i = 0; i < 6; ++i) {
      let str = '' + i;
      curr = votes[str];
    
      if(curr > highest){
        idx = i;
        highest = curr;
      }
    }

    return idx;
  }

  let mvIdx = mostVoted({...points});
  console.log(mvIdx);

  return (
    <div>
    <h2>Anecdote of the day</h2>
    <p>{props.anecdotes[selected]}</p>
    <p>has {points[selected]} votes</p>
    <button onClick={() => nSelect()}>
    next anecdote</button>
    <button onClick={() => vote(selected)}>
    vote</button>
    <h2>With most votes</h2>
    <p>{props.anecdotes[mvIdx]}</p>
    <p>has {points[mvIdx]} votes</p>
    </div>
  )
}

const anecdotes = [
'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)
