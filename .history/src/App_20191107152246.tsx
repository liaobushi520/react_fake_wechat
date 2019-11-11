
import logo from './logo.svg';
import './App.css';
import * as React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createStore, Action, Dispatch, combineReducers, applyMiddleware, MiddlewareAPI } from 'redux';
import { Provider, connect } from 'react-redux';
import { Avatar } from '@material-ui/core';
import { ChangeEvent } from 'react';




interface Friend {
  name: string,
  avatar: string,
}


interface TextMessageViewProps {
  message: TextMessage
}

interface ImageMessageViewProps {
  message: ImageMessage
}

class TextMessageView extends React.Component<TextMessageViewProps>{
  render() {
    return <li><div className="Text-Message">
      <Avatar alt="Remy Sharp" src={this.props.message.friend.avatar} className="avatar" />
      <div className="TextMessageBox">{this.props.message.text}</div>

    </div></li>
  }
}


class ImageMessageView extends React.Component<ImageMessageViewProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return <li><div className="Text-Message">
      <Avatar alt="Remy Sharp" src={this.props.message.friend.avatar} className="avatar" />
      <img src={this.props.message.image} width="300" height="400" ></img>
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

  sendImageMessage: (s: string) => void

}

class ControlPanel extends React.Component<ControlPanelProps, ControlPanelState> {

  constructor(props: Readonly<ControlPanelProps>) {
    super(props)
    this.state = { showMoreFunction: true, inputType: false, text: "" }
    this.showOrHideMoreFunctionSection = this.showOrHideMoreFunctionSection.bind(this)
    this.switchInputType = this.switchInputType.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.sendImageMessage = this.sendImageMessage.bind(this)
    this.textChanged = this.textChanged.bind(this)
    this.sendFile = this.sendFile.bind(this)
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
  sendImageMessage(s: string | any) {
    if (this.props.sendImageMessage != undefined) {
      this.props.sendImageMessage(s)
    }
  }

  textChanged(e: any) {
    this.setState({ text: e.target.value })
  }

  sendFile(ee: ChangeEvent) {
    let fileReader = new FileReader()
    let files = ee.currentTarget["files"]
    fileReader.readAsDataURL(files[0]);
    let f = this.sendImageMessage
    fileReader.onload = function () {
      f(this.result)
      console.log(this.result)
    }
  }


  render() {
    return <div className="Chat-Control-Panel">
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
          <input type="file" id="files" onChange={this.sendFile} />
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
      <img src={this.props.icon} width="50" height="50"></img>
      <text>{this.props.text}</text>
    </div>
  }
}




const mapDispatchToProps = (dispatch: Dispatch) => ({
  "sendMessage": (text: string) => dispatch({ type: "sendMessage", message: { msgType: "text", text: text, timestamp: 100001, friend: { name: "lzj", avatar: "" } } })
  , "sendImageMessage": (image: string) => dispatch({ type: "sendImageMessage", message: { msgType: "image", image: image, timestamp: 1000033, friend: { name: "lzj2", avatar: "" } } })

})


const ControlPanelV = connect(null, mapDispatchToProps)(ControlPanel)


interface DialoguePanelProps {
  msgList: Array<Message>
}


function renderMessage(message: Message) {
  if (message.msgType == "text") {
    return <TextMessageView message={message as TextMessage} />
  } else if (message.msgType == "image") {
    return <ImageMessageView message={message as ImageMessage} />
  }
}

class DialoguePanel extends React.Component<DialoguePanelProps>{

  constructor(props: Readonly<DialoguePanelProps>) {
    super(props)
  }
  render() {
    return <ul className="Chat-List">
      {
        this.props.msgList.map((s: Message) => (
          renderMessage(s)
        ))
      }
    </ul>
  }

}

const mapStateToProps = (state: any) => ({
  msgList: state["myReducer"].msgList
})


const DialoguePanelV = connect(mapStateToProps)(DialoguePanel)



interface Message {
  msgType: string /// "text"  "image"
  timestamp: number
}

interface ChatMessage extends Message {
  friend: Friend
}



interface TextMessage extends ChatMessage {
  text: string,
}

interface ImageMessage extends ChatMessage {
  image: string,
}


interface ChatDetailState {
  msgList: Array<Message>
}


interface SendMesageAction extends Action {
  message: Message
}

function myReducer(state: ChatDetailState = { msgList: [] }, action: SendMesageAction) {
  switch (action.type) {
    case "sendMessage":
      state.msgList.push(action.message)
      let newState = [...state.msgList]
      console.log("fFFFF" + JSON.stringify(newState))
      return { msgList: newState }

    case "sendImageMessage":
      state.msgList.push(action.message)
      let newState1 = [...state.msgList]
      return { msgList: newState1 }
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




class ContactListView extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<div className="Contact-list">
      我是左边框爱的色放GV单方事故发的好地方国家法规环境规划
  </div>)

  }
}


class ContactItem extends React.Component {


  constructor(props) {
    super(props);
  }


}



const store = createStore(combineReducers({ myReducer }), applyMiddleware(myMiddleware, myMiddleware2))

class App extends React.Component<{}, ChatDetailState> {

  constructor(props: Readonly<{}>) {
    super(props)
  }

  render() {
    store.subscribe(() => { console.log(JSON.stringify(store.getState())) })
    return (
      <Provider store={store}>
        <div className="App">

         <div className="Container">
           <div className="Contact-Window">
            <div className="Profile">
             <Avatar src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=357916261,3469737759&fm=15&gp=0.jpg" ></Avatar>
             <text>廖布斯</text>
            </div>

            <ContactListView  >
            </ContactListView>
          </div>
          
         
          <div className="Chat-Window">
            <DialoguePanelV >
            </DialoguePanelV>
            <ControlPanelV>
            </ControlPanelV>
          </div>
         </div>
        </div>
      </Provider>


    );
  }
}

export default App;
