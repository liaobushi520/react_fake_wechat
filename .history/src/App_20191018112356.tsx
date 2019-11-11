import React from 'react';
import logo from './logo.svg';
import './App.css';
import { type } from 'os';

export type User={name:string,[friend:number]:number}


function test(user:User){
  user[1]=9
  user[2]=10
  console.log(user[1])
}




const App: React.FC = () => {
  test({name:"lzj"})
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
