
import logo from './logo.svg';
import './App.css';
import * as React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createStore, Action, Dispatch, combineReducers, applyMiddleware, MiddlewareAPI, AnyAction } from 'redux';
import { Provider, connect } from 'react-redux';
import { Avatar, Icon, CircularProgress } from '@material-ui/core';
import { ChangeEvent, RefObject, useState } from 'react';
import { is } from '@babel/types';
import { filterContact, FilterContactAction, Filter_Contact } from './actions';
import emoji from './images/ic_emoji.svg'
import photo from "./images/ic_photo.svg"
import bigv from "./images/bigv.png"

import { spacing } from '@material-ui/system';
import thunk from 'redux-thunk';



var db
let request = window.indexedDB.open("wechat", 3)
request.onsuccess = (event) => {
  db = request.result;
  console.log("数据库打开成功")

  ///写入默认联系人数据
   let objectStore = db.transaction(['friend'], 'readwrite').objectStore('friend');
   let addFriendRequest= objectStore.add({ id: "10001", name: "王元安", avatar: "http://img5.imgtn.bdimg.com/it/u=2630241800,682426215&fm=26&gp=0.jpg" })
   addFriendRequest.onsuccess = (event) => {
    console.log('写入联系人成功');
  }

  addFriendRequest.onerror = (event) => {
    console.log('写入联系人失败');
  }

  var objectStore2 = db.transaction('friend').objectStore('friend');
  objectStore2.openCursor().onsuccess = function (event) {
    var cursor = event.target.result;

    if (cursor) {
      console.log('Id: ' + cursor.key);
      console.log('Name: ' + cursor.value.name);
      console.log('Name: ' + cursor.value.avatar);
      cursor.continue();
    } else {
      console.log('没有更多数据了！');
    }
  };
}

request.onupgradeneeded = (e) => {
  console.log("数据库升级")
  db = request.result;
  var objectStore;
  //创建联系人表
  if (!db.objectStoreNames.contains('friend')) {
    objectStore = db.createObjectStore('friend', { keyPath: 'id' });
    objectStore.createIndex('name', 'name', { unique: false });
    objectStore.createIndex('avatar', 'avatar', { unique: false });
  }
  //创建消息表
  if (!db.objectStoreNames.contains('message')) {
    objectStore = db.createObjectStore('message', { keyPath: 'id' });
    objectStore.createIndex('msgType', 'msgType', { unique: false });
    objectStore.createIndex('timeStamp', 'timeStamp', { unique: false });
    objectStore.createIndex('friendId', 'friendId', { unique: false });
    objectStore.createIndex('content', 'content', { unique: false });
  }
}





interface Friend {
  id: string,
  name: string,
  avatar: string,
  visible: boolean
}


interface TextMessageViewProps {
  message: TextMessage
}

interface ImageMessageViewProps {
  message: ImageMessage
}

const MsgStatus: React.SFC<any> = (props: any) => {
  switch (props.status) {
    case "sending": {
      return <CircularProgress size={18} />
    }
    case "success": {
      return <text>已发送</text>
    }

    case "error": {
      return <text>发送失败</text>
    }

    default: {
      return <div></div>
    }


  }
}



class TextMessageView extends React.Component<TextMessageViewProps>{
  render() {


    return <li><div className="Text-Message">
      <Avatar alt="Remy Sharp" src={this.props.message.friend.avatar} className="avatar" />
      <div className="TextMessageBox">{this.props.message.text}</div>
      <MsgStatus status={this.props.message.status} ></MsgStatus>
    </div>
    </li>
  }
}


class ImageMessageView extends React.Component<ImageMessageViewProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return <li><div className="Text-Message">
      <Avatar alt="Remy Sharp" src={this.props.message.friend.avatar} className="avatar" />
      <img src={this.props.message.image} style={{ marginLeft: "10px", width: 300, height: "400px", borderRadius: "8px" }} ></img>
    </div></li>
  }
}

class Visiblity extends React.Component<{ visible: boolean }>{
  render() {
    if (this.props.visible) {
      return this.props.children
    }
    return <div  >
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
  friend: Friend

  sendMessage: (s: string, f: Friend) => void

  sendImageMessage: (s: string, f: Friend) => void

}

class ControlPanel extends React.Component<ControlPanelProps, ControlPanelState> {


  //引用DOM组件
  inputRef = React.createRef<HTMLInputElement>();

  constructor(props: Readonly<ControlPanelProps>) {
    super(props)
    this.state = { showMoreFunction: true, inputType: false, text: "" }
    this.showOrHideMoreFunctionSection = this.showOrHideMoreFunctionSection.bind(this)
    this.switchInputType = this.switchInputType.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.sendImageMessage = this.sendImageMessage.bind(this)
    this.textChanged = this.textChanged.bind(this)
    this.sendFile = this.sendFile.bind(this)

    this.keyDown = this.keyDown.bind(this)
    this.chooseImage = this.chooseImage.bind(this)
  }

  switchInputType() {
    this.setState({ inputType: !this.state.inputType })
  }

  showOrHideMoreFunctionSection() {
    this.setState({ showMoreFunction: !this.state.showMoreFunction })
  }

  sendMessage() {
    if (this.props.sendMessage != undefined) {
      this.props.sendMessage(this.state.text, this.props.friend)
      this.setState({ text: "" })
    }
  }
  sendImageMessage(s: string | any) {
    if (this.props.sendImageMessage != undefined) {
      this.props.sendImageMessage(s, this.props.friend)
    }
  }

  textChanged(e: any) {
    this.setState({ text: e.target.value })
  }

  keyDown(e: any) {
    if (e.keyCode === 13) {
      this.sendMessage()
    }
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

  chooseImage() {

    if (this.inputRef.current != null && this.inputRef.current != undefined) {
      this.inputRef.current.click()
    }

  }






  render() {

    return <div className="Chat-Control-Panel">
      <div className="SendBox-Bar">
        <img src={emoji} className="SendBox-Icon"></img>
        <img src={photo} onClick={this.chooseImage} className="SendBox-Icon"></img>
        <img src={emoji} className="SendBox-Icon"></img>
        <img src={emoji} className="SendBox-Icon"></img>
        <div id="hidden_input">
          <input ref={this.inputRef} type="file" id="files" onChange={this.sendFile} />
        </div>
      </div>
      {/****textarea光标在左上角**/}
      <textarea className="Control-Panel-Input" value={this.state.text} onChange={this.textChanged} onKeyDown={this.keyDown}></textarea>

    </div>

  }

}

const controlPanelMapDispatchToProps = (dispatch: any) => ({
  "sendMessage": (text: string, friend: Friend) => dispatch(sendMessage({ msgType: "text", text: text, timestamp: new Date().getMilliseconds(), friend: friend }))
  , "sendImageMessage": (image: string, friend: Friend) => dispatch({ type: "sendImageMessage", message: { msgType: "image", image: image, timestamp: new Date().getMilliseconds(), friend: friend } })

})




function sendMessage(msg: TextMessage) {
  return (dispatch: Dispatch) => {

    msg.status = "sending"
    dispatch({ type: "sendMessage", message: msg })

    let addRequest = db.transaction(['message'], 'readwrite')
      .objectStore('message')
      .add({id:('${msg.friend.friendId}msg.timeStamp'), friendId: msg.friend.id, content: msg.text, timeStamp: msg.timestamp });

    addRequest.onsuccess = (event) => {
      console.log('数据写入成功');
      msg.status = "success"
      dispatch({ type: "sendMessage", message: msg })
    }

    addRequest.onerror = (event) => {
      console.log('数据写入失败');
      msg.status = "error"
      dispatch({ type: "sendMessage", message: msg })
    }




  }
}



const controlPanelMapStateToProps = (state: any) => ({
  friend: state["chatReducer"].currentChatFriend
})


const ControlPanelV = connect(controlPanelMapStateToProps, controlPanelMapDispatchToProps)(ControlPanel)


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


interface DialoguePanelProps {
  msgList: Array<Message>
}


function renderMessage(message: Message) {
  if (message.msgType == "text") {
    return <div className="Message-Wrapper"> <TextMessageView message={message as TextMessage} /> </div>
  } else if (message.msgType == "image") {
    return <div className="Message-Wrapper"> <ImageMessageView message={message as ImageMessage} /></div>
  }
}

class DialoguePanel extends React.Component<DialoguePanelProps>{

  ulRef = React.createRef<HTMLUListElement>()

  constructor(props: Readonly<DialoguePanelProps>) {
    super(props)
  }

  render() {

    return <ul ref={this.ulRef} className="Chat-List">
      {
        this.props.msgList.map((s: Message) => (
          renderMessage(s)
        ))
      }
    </ul>
  }
  componentDidUpdate() {
    if (this.ulRef.current != null) {
      //发送消息之后，滚到底部
      this.ulRef.current.scrollTop = 10000
    }

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
  status?: string //success error sending
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

interface EnterChatAction extends Action {
  friend: Friend
}




const defFriends: Friend[] = [
  { id: "000001", name: "王元安", avatar: "http://img5.imgtn.bdimg.com/it/u=2630241800,682426215&fm=26&gp=0.jpg", visible: true },
  { id: "000002", name: "李贺", avatar: "http://b-ssl.duitang.com/uploads/item/201801/14/20180114115405_hfhrf.jpg", visible: true }
]


function chatReducer(state: ChatDetailState = { friends: defFriends, messageMap: new Map() }, action: SendMesageAction | EnterChatAction | FilterContactAction) {
  switch (action.type) {
    case "sendMessage": {
      let newAction = (action as SendMesageAction)
      let textMsg = (newAction.message as TextMessage)
      if (!state.messageMap.has(textMsg.friend)) {
        state.messageMap.set(textMsg.friend, [])
      }
      let msgList = state.messageMap.get(textMsg.friend) || []
      msgList.push(newAction.message)
      let newMap = new Map()
      state.messageMap.forEach((v, key, map) => (
        newMap.set(key, v)
      ))
      let newState = Object.assign({ ...state }, { currentChat: [...msgList], messageMap: newMap })
      return newState
    }
    case "sendImageMessage": {
      let newAction = (action as SendMesageAction)
      let imageMsg = (newAction.message as ImageMessage)
      if (!state.messageMap.has(imageMsg.friend)) {
        state.messageMap.set(imageMsg.friend, [imageMsg])
      }
      let msgList = state.messageMap.get(imageMsg.friend) || []
      msgList.push(newAction.message)
      let newState = Object.assign({ ...state }, { currentChat: msgList })
      return newState
    }
    case "enterChat": {
      let newAction = (action as EnterChatAction)
      let currentChat = state.messageMap.get(newAction.friend) || []
      //console.log("enter chat" + JSON.stringify(state.messageMap.size))
      let newState = Object.assign({ ...state }, { currentChat: currentChat, currentChatFriend: newAction.friend })
      return newState
    }

    case Filter_Contact: {
      let newAction = (action as FilterContactAction)
      state.friends.forEach((item) => {
        if (item.name.match(newAction.keyword) != null) {
          item.visible = true
        } else {
          item.visible = false
        }
      })
      let newState = Object.assign({ ...state }, { friends: [...state.friends] })
      return newState
    }



    default: return state
  }
}

const myMiddleware = (api: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {
  next(action)
}

const myMiddleware2 = () => (next: Dispatch) => (action: Action) => {
  next(action)
}


interface ContactListViewProps {
  friends: Array<Friend>,
  messageMap: Map<Friend, Array<Message>>
}


function contactItem(friend: Friend, messageMap: Map<Friend, Array<Message>>) {
  let msgList = messageMap.get(friend) || []
  return <Visiblity visible={friend.visible}> <ContactItemV friend={friend} recentMsg={msgList[msgList.length - 1]} /> </Visiblity>
}

class ContactListView extends React.Component<ContactListViewProps> {
  constructor(props) {
    super(props);



  }

  render() {
    return (
      <ul className="Contact-list">
        {
          this.props.friends.map((s: Friend) => (
            <li >
              {contactItem(s, this.props.messageMap)}
            </li>
          ))
        }
      </ul>
    )

  }
}

const contatcListMapStateToProps = (state: any) => ({
  friends: state["chatReducer"].friends || [],
  messageMap: state["chatReducer"].messageMap || new Map()
})

const ContactListV = connect(contatcListMapStateToProps)(ContactListView)

interface ContactItemViewProps {
  friend: Friend
  recentMsg?: Message
  enterChat: (f: Friend) => void
}

class ContactItemView extends React.Component<ContactItemViewProps> {
  constructor(props) {
    super(props);
    this.enterChat = this.enterChat.bind(this)
  }

  enterChat() {
    this.props.enterChat(this.props.friend)
  }

  render() {


    let recentMsgText = "无消息"
    if (this.props.recentMsg == undefined) {
      recentMsgText = "无消息"
    } else if (this.props.recentMsg.msgType == "text") {
      recentMsgText = (this.props.recentMsg as TextMessage).text
    } else if (this.props.recentMsg.msgType == "image") {
      recentMsgText = "图片消息"
    }
    return <div onClick={this.enterChat} className="Contact-item">
       <div className="Contact-Avatar-Box">
        <Avatar src={this.props.friend.avatar} className="Contact-item-img"
        ></Avatar>

       <i className="Subscript-Icon">
         <img src={bigv} width="100%" height="100%"></img>
      </i>
      </div>

       
     
      <div className="Contact-item-2">
        <div className="Contact-item-3">
          <text className="Contact-item-name">{this.props.friend.name}</text>
          <text className="Contact-item-time">10:10</text>
        </div>
        <div className="Contact-item-3" style={{ alignItems:"center"}}>
        <text className="Contact-item-msg"  >{recentMsgText}</text>
        <div id="unread_msg">
           11
        </div>
        </div>
      </div>
    </div>
      ;
  }

}
const contactItemMapDispatchToProps = (dispatch: Dispatch) => ({
  "enterChat": (f: Friend) => dispatch({ type: "enterChat", friend: f })
})

const ContactItemV = connect(null, contactItemMapDispatchToProps)(ContactItemView)


interface ChatWindowViewProps {
  hasChat: boolean
  friend: Friend
}

interface ChatWindowViewState {
  showUserCard: boolean
}



class ChatWindowView extends React.Component<ChatWindowViewProps, ChatWindowViewState>{
  constructor(props) {
    super(props);
    this.showUserCard = this.showUserCard.bind(this)
    this.state = { "showUserCard": false }
  }

  showUserCard() {
    this.setState({ "showUserCard": !this.state.showUserCard })
  }

  render() {
    React.useState
    if (this.props.hasChat) {
      return <div className="Chat-Window">
        <div className="Chat-Header" onClick={this.showUserCard}>
          {this.props.friend.name}
          <Visiblity visible={this.state.showUserCard}>
            <div className="User-Card">
              <div className="User-Card-Title">
                <div className="Avatar-Box">
                  <img src={this.props.friend.avatar} className="Avatar"></img>
                  <p className="Avatar-Box-Name">  {this.props.friend.name} </p>
                </div>
              </div>
            </div>
          </Visiblity>
        </div>

        <DialoguePanelV >
        </DialoguePanelV>
        <ControlPanelV>
        </ControlPanelV>
      </div>
    } else {
      return <div className="No-chat">您还未选中或发起聊天，快去跟好友聊一聊吧</div>
    }
  }
}

const chatWindowMapStateToProps = (state: any) => ({
  hasChat: state["chatReducer"].currentChatFriend != undefined || state["chatReducer"].currentChatFriend != null,
  friend: state["chatReducer"].currentChatFriend
})

const ChatWindowViewV = connect(chatWindowMapStateToProps)(ChatWindowView)


const store = createStore(combineReducers({ chatReducer }), applyMiddleware(thunk, myMiddleware, myMiddleware2))

class App extends React.Component<{}, ChatDetailState> {

  constructor(props: Readonly<{}>) {
    super(props)
    this.keywordChanged = this.keywordChanged.bind(this)
    this.clickOuterSection = this.clickOuterSection.bind(this)
  }




  keywordChanged(e: any) {
    store.dispatch(filterContact(e.target.value))
  }

  clickOuterSection(e: any) {
    console.log("点击外部区域")
 }

  render() {
    //  store.subscribe(() => { console.log(JSON.stringify(store.getState())) })
    return (
      <Provider store={store}>
        <div className="App" onClick={this.clickOuterSection}>
          <div className="Container">
            <div className="Contact-Window">
              <div className="Profile">
                <Avatar src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=357916261,3469737759&fm=15&gp=0.jpg" ></Avatar>
                <text>廖布斯</text>
              </div>
              <div className="Search-Box">
                <input type="text" className="Search-Box-Input" onChange={this.keywordChanged} placeholder="查找联系人或群"></input>
              </div>
              <ContactListV />
            </div>
            <ChatWindowViewV></ChatWindowViewV>
          </div>
        </div>
      </Provider>


    );
  }
}

export default App;
