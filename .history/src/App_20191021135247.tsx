import React from 'react';
import logo from './logo.svg';
import './App.css';
import { type } from 'os';
///知识点 1：可索引的类型


//可索引类型
export type User={ name:number,[friend:string]:number}
function test(user:User){
  user[1]=10
  user[2]=10
  user["ss"]=111
  console.log(user["name"]+"ddd")
}
 
// || &&
function test1(){
  let v
  let s=v || {"name":11} //
  let s0= {"name":11}||v //
  let ss=  {"name":11}&&{"age":10}//{"age":10}
  let sss=v && {"name":111}
  console.log(s0)
}

//箭头函数  
const test3=(p1?:any)=>(p2?:any)=>{ 
  console.log("箭头函数"+p1+p2) ;
  return "fff";
}
class Car {




}





const App: React.FC = () => {
  let u:User={name:110}
  //test({name:102,})
  //test1()
 console.log( test3("p1")(11))

  

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
