import React from 'react';
import logo from './logo.svg';
import './App.css';
import { type } from 'os';

interface Friend {
  name: string,
  avatar: string,

}

interface TextMessageProps {
  text: string,
  friend: Friend
}



class TextMessage extends React.Component<TextMessageProps>{

  render() {
    return <div className="Text-Message">
      <img src={this.props.friend.avatar} width="50" height="50" />
      <text >{this.props.text}</text>
    </div>
  }
}


class ControlPanel extends React.Component {

  render(){
    return <div className="Control-Panel">
           <img src={logo} width="50" height="50"></img>
        </div>
  }
   
}


const App: React.FC = () => {

  return (
    <div  >
      <ul>
     <TextMessage text="第一条消息" friend={{ name: "lzj", avatar: "http://pic4.zhimg.com/50/v2-1adce42102e226eea2e96d19c116598c_hd.jpg" }} />
   </ul>
   <ControlPanel>
  </ControlPanel>
   </div>
  );
}

export default App;
