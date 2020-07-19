import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const StatisticLine = ({text, value}) => {
  return (<tr><td>{text} {value}</td></tr>)
}

const Statistics = ({good, neutral, bad, total, average, positive}) => {
  const body = (good === 0 && neutral === 0 && bad === 0) ?
    <p>No feeback given</p> :
      <div>
        <h2>Statistics</h2>
        <table>
        <tbody>
        <StatisticLine text="good" value={good}/>
        <StatisticLine text="neutral" value={neutral}/>
        <StatisticLine text="bad" value={bad}/>
        <StatisticLine text="total" value={total()}/>
        <StatisticLine text="average" value={average()}/>
        <StatisticLine text="positive" value={positive()}/>
        </tbody>
        </table>
      </div>
  return (
    body
  )
}

const Button = ({fnc, text}) => {
  return (
    <button onClick={() => fnc()}>{text}</button>
  );
}

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const increaseByOne = (counter, setCounter) => setCounter(counter + 1)
  const incG = () => increaseByOne(good, setGood)
  const incN = () => increaseByOne(neutral, setNeutral)
  const incB = () => increaseByOne(bad, setBad)
  const total = () => good + neutral + bad
  const average = () => (good * 1 + neutral * 0 + bad * (-1)) / total()
  const positive = () => good / total()

  return (
    <div>
    <h2>Give feedback</h2>
    <Button fnc={incG} text="good"/>
    <Button fnc={incN} text="neutral"/>
    <Button fnc={incB} text="bad"/>
    <Statistics good={good} neutral={neutral} bad={bad} total={total}
    average={average} positive={positive}/>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
