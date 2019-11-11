
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
  id: string,
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
  msgList: state["chatReducer"].currentChat || []
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
  friends: Friend[],
  messageMap: Map<Friend, Array<Message>>
  currentChatFriend?: Friend
  currentChat?: Array<Message>
}


interface SendMesageAction extends Action {
  message: Message
}

interface EnterChatAction extends Action{
    friend:Friend
}



const defFriends: Friend[] = [{ id: "000001", name: "王元安", avatar: "http://b-ssl.duitang.com/uploads/item/201509/25/20150925110828_iMnGx.jpeg" }]


///js map key只能是number string 
function chatReducer(state: ChatDetailState = { friends: defFriends, messageMap: new Map() }, action: SendMesageAction|EnterChatAction) {
  switch (action.type) {
    case "sendMessage": {
      let newAction=(action as SendMesageAction)
      let textMsg = (newAction.message as TextMessage)
      if (!state.messageMap.has(textMsg.friend)) {
        console.log("no have")
        state.messageMap.set(textMsg.friend, [textMsg])
      }
      console.log("before" + state.messageMap.size)
      let msgList = state.messageMap.get(textMsg.friend) || []
      msgList.push(newAction.message)
      let newState = Object.assign({ currentChat: msgList }, state)
      console.log("after" + JSON.stringify(newState))
      return newState
    }
    case "sendImageMessage": {
      let newAction=(action as SendMesageAction)
      let imageMsg = (newAction.message as ImageMessage)
      if (!state.messageMap.has(imageMsg.friend)) {
        console.log("no have")
        state.messageMap.set(imageMsg.friend, [imageMsg])
      }
      let msgList = state.messageMap.get(imageMsg.friend) || []
      msgList.push(newAction.message)
      let newState = Object.assign({ currentChat: msgList }, state)
      console.log("fFFFF" + JSON.stringify(newState))
      return newState
    }
    case "enterChat":{
      let newAction=(action as EnterChatAction)
      let newState = Object.assign({ currentChat:state.messageMap.get(newAction.friend), currentChatFriend:newAction.friend }, state)
      return newState
    }

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


interface ContactListViewProps {
  friends:Array<Friend>,
}

class ContactListView extends React.Component<ContactListViewProps> {
  constructor(props) {
    super(props);
  }
  render() {
    return (<div className="Contact-list">
      <ul>
        {
          this.props.friends.map((s: Friend) => (
            <ContactItemV friend={s} />
          ))
        }
      </ul>
    </div>)

  }
}

const contatcListMapStateToProps = (state: any) => ({
  friends: state["chatReducer"].friends || []
})

const ContactListV = connect(contatcListMapStateToProps)(ContactListView)

interface ContactItemViewProps {
  friend: Friend
}

class ContactItemView extends React.Component<ContactItemViewProps> {

  
  constructor(props) {
    super(props);
    this.enterChat=this.enterChat.bind(this)
  }

   enterChat(){

  }

  render() {
    return <div onClick={this.enterChat}>
      <Avatar src={this.props.friend.avatar}></Avatar>
    </div>;
  }

}

const contactItemMapDispatchToProps = (dispatch: Dispatch) => ({
  "enterChat": (f: Friend) => dispatch({ type: "enterChat",  friend:f })
})

const ContactItemV = connect(null, contactItemMapDispatchToProps)(ContactItemView)




const store = createStore(combineReducers({ chatReducer }), applyMiddleware(myMiddleware, myMiddleware2))

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

              <div className="Search-Box">
                <input type="text" className="Search-Box-Input"></input>
              </div>
               <ContactListV/>

               
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
