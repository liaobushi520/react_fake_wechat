
import logo from './logo.svg';
import './App.css';
import { type } from 'os';
import * as React from 'react';
import { stringify } from 'querystring';
import { Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { createStore, Action, Dispatch, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/styles';
import { Avatar } from '@material-ui/core';
import { log } from './test';
 
 
  

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
   
    return <li><div className="Text-Message">
      <Avatar alt="Remy Sharp" src={this.props.friend.avatar} className="avatar"  />
      <text >{this.props.text}</text>
    </div></li>
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
  ///文本框数据
  text: string

}

interface ControlPanelProps {
  sendMessage: (s: string) => void
}




class ControlPanel extends React.Component<ControlPanelProps, ControlPanelState> {

  constructor(props: Readonly<ControlPanelProps>) {
    super(props)
    this.state = { showMoreFunction: true, inputType: false, text: "" }
    this.showOrHideMoreFunctionSection = this.showOrHideMoreFunctionSection.bind(this)
    this.switchInputType = this.switchInputType.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.textChanged = this.textChanged.bind(this)
  }

  switchInputType() {
    console.log("切换输入方式")
    this.setState({ inputType: !this.state.inputType })
  }

  showOrHideMoreFunctionSection() {
    this.setState({ showMoreFunction: !this.state.showMoreFunction })
  }

  sendMessage() {
    if (this.props.sendMessage != undefined) {
      this.props.sendMessage(this.state.text)
      this.setState({ text: ""})
     }
  }

  textChanged(e: any) {
    this.setState({ text: e.target.value })
   }

  render() {
    return <div className="Control-Panel">
      <div className="Control-Panel-Header">
        <img src={logo} width="50" height="50" onClick={this.showOrHideMoreFunctionSection}></img>
        <div>
          <Visiblity visible={this.state.inputType} >  <input type="text" value={this.state.text} onChange={this.textChanged} />  </Visiblity>
          <Visiblity visible={!this.state.inputType} >    <button>按住 说话</button>  </Visiblity>
        </div>
        <img src={logo} width="50" height="50" onClick={this.switchInputType}></img>
        <Button variant="primary" onClick={this.sendMessage} className="Send-Button">发  送</Button>
      </div>

      <Visiblity visible={this.state.showMoreFunction}>
        <div>
          <Container>
            <Row>
              <Col>1 of 2</Col>
              <Col>2 of 2</Col>
            </Row>
            <Row>
              <Col>1 of 3</Col>
              <Col>2 of 3</Col>
              <Col>3 of 3</Col>
            </Row>
          </Container>

        </div>
      </Visiblity>
    </div>
  }
}


const mapDispatchToProps = (dispatch: Dispatch) => ({ "sendMessage": (text:string) => dispatch({ type: "sendMessage",message:text}) })


const ControlPanelV = connect(null, mapDispatchToProps)(ControlPanel)





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
        this.props.msgList.map((s: string) => (
          <TextMessage text={s} friend={{ name: "lzj", avatar: "http://pic4.zhimg.com/50/v2-1adce42102e226eea2e96d19c116598c_hd.jpg" }} />
        ))
      }
    </ul>
  }




}

const mapStateToProps = (state: any) => ( {
  // msgList: state["myReducer"].msgList
})


const DialoguePanelV = connect(mapStateToProps)(DialoguePanel)

interface ChatDetailState {
  msgList: Array<string>
}


interface SendMesageAction extends Action{
   message:string
}

function myReducer(state: ChatDetailState = { msgList: [] }, action: SendMesageAction) {
  switch (action.type) {
    case "sendMessage":
      state.msgList.push(action.message)
      let newState = [...state.msgList]
      console.log("fFFFF" + JSON.stringify(newState))
      return {msgList:newState}

    default: return state
  }
}

const store = createStore(myReducer)
 
class App extends React.Component<{}, ChatDetailState> {

  constructor(props: Readonly<{}>) {
    super(props)
  }

  render() {

   
    return (
      <Provider store={store}>
        <div className="App">
          <DialoguePanelV >
          </DialoguePanelV>
          <ControlPanelV>
          </ControlPanelV>
        </div>
      </Provider>


    );
  }
}

export default App;
