import React from 'react';
import logo from './logo.svg';
import './App.css';
import { type } from 'os';
 
interface Friend {
   name:string,
   avatar:string,
  
}

interface TextMessageProps{
  text:string,
  friend:Friend
}

class TextMessage extends React.Component<TextMessageProps>{

  render(){
    return <img src = {this.props.friend.avatar}></img>
  }

}


const App: React.FC = () => {
   
  return (
    <ul>

      <TextMessage   text="第一条消息"  friend={{name : "lzj",avatar :"http://pic4.zhimg.com/50/v2-1adce42102e226eea2e96d19c116598c_hd.jpg"}}/> 


    </ul>
       
  );
}

export default App;
