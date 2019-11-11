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

      <HouseItem  img= "http://pic4.zhimg.com/50/v2-1adce42102e226eea2e96d19c116598c_hd.jpg"/> 


    </ul>
       
  );
}

export default App;
