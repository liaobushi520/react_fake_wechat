import React from 'react';
import logo from './logo.svg';
import './App.css';
import { type } from 'os';
///知识点 1：可索引的类型



export type User={[friend:number]:number,name:string}


function test(user:User){
  user[1]=10
  user[2]=10
  console.log(user[5])
}

const App: React.FC = () => {
  let u:User={name:"ss"}
  test({name:"lzj",})
  

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
