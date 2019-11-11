
import logo from './logo.svg';
import './App.css';
import * as React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createStore, Action, Dispatch, combineReducers, applyMiddleware, MiddlewareAPI } from 'redux';
import { Provider, connect } from 'react-redux';
import { Avatar } from '@material-ui/core';




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
      <Avatar alt="Remy Sharp" src={this.props.friend.avatar} className="avatar" />
      <text>{this.props.text}</text>
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
      this.setState({ text: "" })
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
        <div className="Row">
          <IconText text="拍摄" icon="http://pic4.zhimg.com/50/v2-1adce42102e226eea2e96d19c116598c_hd.jpg"></IconText>
          <IconText text="相册" icon="http://pic4.zhimg.com/50/v2-1adce42102e226eea2e96d19c116598c_hd.jpg"></IconText>
          <IconText text="文件" icon="http://pic4.zhimg.com/50/v2-1adce42102e226eea2e96d19c116598c_hd.jpg"></IconText>
       </div>
      </Visiblity>
    </div>
  }
}


interface IconTextProps {
  text: string
  icon: string
  callback?: () => void
}

class IconText extends React.Component<IconTextProps, {}>{
  constructor(props: Readonly<IconTextProps>) {
    super(props)
  }

  render() {
    return <div className="IconTextContainer" onClick={this.props.callback}>
      <img src={this.props.icon}  width="50" height="50"></img>
      <text>{this.props.text}</text>
    </div>
  }
}




const mapDispatchToProps = (dispatch: Dispatch) => ({ "sendMessage": (text: string) => dispatch({ type: "sendMessage", message: text }) })


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

const mapStateToProps = (state: any) => ({
  msgList: state["myReducer"].msgList
})


const DialoguePanelV = connect(mapStateToProps)(DialoguePanel)

interface ChatDetailState {
  msgList: Array<string>
}


interface SendMesageAction extends Action {
  message: string
}

function myReducer(state: ChatDetailState = { msgList: [] }, action: SendMesageAction) {
  switch (action.type) {
    case "sendMessage":
      state.msgList.push(action.message)
      let newState = [...state.msgList]
      console.log("fFFFF" + JSON.stringify(newState))
      return { msgList: newState }

    default: return state
  }
}

const myMiddleware = (api: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {

  console.log("Middleware dispatch action")
  next(action)
}

const myMiddleware2 = () => (next: Dispatch) => (action: Action) => {
  console.log("Middleware2 dispatch action")
  next(action)
}

const store = createStore(combineReducers({ myReducer }), applyMiddleware(myMiddleware, myMiddleware2))

React.createContext(null)
class App extends React.Component<{}, ChatDetailState> {

  constructor(props: Readonly<{}>) {
    super(props)
  }

  render() {
    store.subscribe(() => { console.log(JSON.stringify(store.getState())) })
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
