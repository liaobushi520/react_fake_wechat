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

class Exchange extends React.Component<{first:React.Component,second:React.Component,showFirst:boolean}>{
   
       render(){
           if(this.props.showFirst){
             return this.props.first
           }

           return this.props.second

       }

}


class  Visiblity extends React.Component<{visible:boolean}>{
    


 render(){
     if(this.props.visible){
         return this.props.children
     }
    return <div>
             </div>
  }  
}


interface ControlPanelState {
    ///1:文本输入 2:语音输入
    inputType:boolean;
    ///是否展开更多功能界面
    showMoreFunction:boolean ;

}


class ControlPanel extends React.Component<{},ControlPanelState> {

  constructor(props: Readonly<{}>){
     super(props)
     this.state={showMoreFunction:true,inputType:false}
     this.showOrHideMoreFunctionSection= this.showOrHideMoreFunctionSection.bind(this)
     this.switchInputType= this.switchInputType.bind(this)
  }

  switchInputType(){
      console.log("切换输入方式")
      this.setState( {inputType:!this.state.inputType})
  }

  showOrHideMoreFunctionSection(){
       this.setState( {showMoreFunction:!this.state.showMoreFunction})
  }

  render(){
    return <div className="Control-Panel">
           <div>
             <img src={logo} width="50" height="50"  onClick={this.showOrHideMoreFunctionSection}></img>
            <div>
             <Visiblity  visible={this.state.inputType} >  <input type="text"/>  </Visiblity>  
             <Visiblity  visible={!this.state.inputType} >    <button>按住 说话</button>  </Visiblity>  
             </div>

             
           </div>
           <img src={logo} width="50" height="50"  onClick={this.switchInputType}></img>


           
           
            <Visiblity visible={this.state.showMoreFunction}>
             
            <div>
              <text>更多功能敬请期待！</text>
            </div>

            </Visiblity>
          </div>
  }
   
}


const App: React.FC = () => {

  return (
    <div  className="App">
      <ul>
     <TextMessage text="第一条消息" friend={{ name: "lzj", avatar: "http://pic4.zhimg.com/50/v2-1adce42102e226eea2e96d19c116598c_hd.jpg" }} />
   </ul>
   <ControlPanel>
  </ControlPanel>
   </div>
  );
}

export default App;
