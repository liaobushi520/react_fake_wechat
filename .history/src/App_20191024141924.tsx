 
import logo from './logo.svg';
import './App.css';
import { type } from 'os';
import * as React from 'react';

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

class Exchange extends React.Component<{ first: React.Component, second: React.Component, showFirst: boolean }>{

  render() {
    if (this.props.showFirst) {
      return this.props.first
    }

    return this.props.second

  }

}


class Visiblity extends React.Component<{ visible: boolean }>{



  render() {
    if (this.props.visible) {
      return this.props.children
    }
    return <div>
    </div>
  }
}


interface ControlPanelState {
  ///1:文本输入 2:语音输入
  inputType: boolean;
  ///是否展开更多功能界面
  showMoreFunction: boolean;

}

interface ControlPanelProps{
  
   sendMessage:(s:string)=>void


}


class ControlPanel extends React.Component<ControlPanelProps, ControlPanelState> {

  constructor(props: Readonly<ControlPanelProps>) {
    super(props)
    this.state = { showMoreFunction: true, inputType: false }
    this.showOrHideMoreFunctionSection = this.showOrHideMoreFunctionSection.bind(this)
    this.switchInputType = this.switchInputType.bind(this)
    this.sendMessage = this.sendMessage.bind(this)

  }

  switchInputType() {
    console.log("切换输入方式")
    this.setState({ inputType: !this.state.inputType })
  }

  showOrHideMoreFunctionSection() {
    this.setState({ showMoreFunction: !this.state.showMoreFunction })
  }

  sendMessage(){
    console.log("XXXXX")
    if(this.props.sendMessage!= undefined){
      this.props.sendMessage("发送一条消息")
    }
    
  }

  render() {
    return <div className="Control-Panel">
      <div className="Control-Panel-Header">
        <img src={logo} width="50" height="50" onClick={this.showOrHideMoreFunctionSection}></img>
        <div>
          <Visiblity visible={this.state.inputType} >  <input type="text" />  </Visiblity>
          <Visiblity visible={!this.state.inputType} >    <button>按住 说话</button>  </Visiblity>
        </div>
        <img src={logo} width="50" height="50" onClick={this.switchInputType}></img>

        <button onClick={this.sendMessage}>发送</button>
       </div>

      <Visiblity visible={this.state.showMoreFunction}>
        <div>
          <text>更多功能敬请期待！</text>
        </div>

      </Visiblity>
    </div>
  }

}

interface DialoguePanelProps {
  msgList: Array<string> 

}


class DialoguePanel extends React.Component<DialoguePanelProps>{

  constructor(props: Readonly<DialoguePanelProps>) {
     super(props)
  }

  render() {
    

    return <ul>
        { 
          this.props.msgList.map((item)=>(
          <li key={item}>   <TextMessage text="第一条消息" friend={{ name: "lzj", avatar: "http://pic4.zhimg.com/50/v2-1adce42102e226eea2e96d19c116598c_hd.jpg" }   } />  </li>
        ))
        }
    </ul>
  }

}

interface ChatDetailState{
    msgList: Array<string> 
}


class App extends React.Component<{},ChatDetailState> {
 
 constructor(props: Readonly<{}>) {
    super(props)
    this.state={msgList:[]}
  }

  sendMessage = (s:string)=>{
     console.log(s)
     const newList=[...this.state.msgList,s]
     this.setState({msgList:newList })
  }
   
  render() {
    return (
      <div className="App">
        <DialoguePanel msgList={this.state.msgList}>
        </DialoguePanel>
        <ControlPanel sendMessage={this.sendMessage}>
        </ControlPanel>
      </div>
    );
  }
}

export default App;
