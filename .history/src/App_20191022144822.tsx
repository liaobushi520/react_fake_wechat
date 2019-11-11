import React from 'react';
import logo from './logo.svg';
import './App.css';
import { type } from 'os';
 
interface HouseItemProps{
  img:string


}

class HouseItem extends React.Component<HouseItemProps>{

  render(){
    return <img src = {this.props.img}></img>
  }

}


const App: React.FC = () => {
   
  return (
    <ul>

      <HouseItem  img= "http://image.baidu.com/search/detail?ct=503316480&z=undefined&tn=baiduimagedetail&ipn=d&word=Expected%20an%20assignment%20or%20function%20call%20and%20instead%20saw%20an%20expression&step_word=&ie=utf-8&in=&cl=2&lm=-1&st=undefined&hd=undefined&latest=undefined&copyright=undefined&cs=1352315901,3032265314&os=3216218456,3500770993&simid=4211327345,740232198&pn=35&rn=1&di=24310&ln=111&fr=&fmq=1571726879305_R&fm=&ic=undefined&s=undefined&se=&sme=&tab=0&width=undefined&height=undefined&face=undefined&is=0,0&istype=0&ist=&jit=&bdtype=0&spn=0&pi=0&gsm=0&objurl=http%3A%2F%2Fpic4.zhimg.com%2F50%2Fv2-1adce42102e226eea2e96d19c116598c_hd.jpg&rpstart=0&rpnum=0&adpicid=0&force=undefined"/> 


    </ul>
       
  );
}

export default App;
