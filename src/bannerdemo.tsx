import * as React from 'react';
//一定要导入css文件
import './App.css';
import { RefObject } from 'react';
export default class BannnerDemo extends React.Component {

    ref = React.createRef<HTMLDivElement>()
    timer: NodeJS.Timeout | undefined;


    constructor(props) {
        super(props)
    }

    componentWillMount() {
        this.timer = setInterval(() => {
            let firstElement, lastElement;
           
           if (this.ref.current != null) {
                firstElement = this.ref.current.firstElementChild;
                lastElement = this.ref.current.lastElementChild;
            }

            let activeElement = document.getElementsByClassName("Active")[0]

            if (activeElement != null) {
               
                let preElement: Element = activeElement.previousElementSibling || lastElement
                if (preElement != null) {
                    preElement.setAttribute("class", "Swiper-Item  Swiper-Item-Pre Swiper-Item-Transition")
                }

                //让之前的激活元素变得不激活
                activeElement.setAttribute("class", "Swiper-Item  Swiper-Item0  Swiper-Item-Transition")
                let nextElement: Element = activeElement.nextElementSibling || firstElement

                nextElement.setAttribute("class", "Swiper-Item Swiper-Item1  Active Swiper-Item-Transition")
                let rightElement = nextElement.nextElementSibling || firstElement

                rightElement.setAttribute("class", "Swiper-Item Swiper-Item2 Swiper-Item-Transition")
                let p = rightElement.nextElementSibling == null ? firstElement : rightElement.nextElementSibling
                setTimeout(() => {
                    p.setAttribute("class", "Swiper-Item Swiper-Item3")
                }, 500)
           }
        }, 3000)
    }

    componentWillUnmount() {
        if (this.timer != null) {
              clearInterval(this.timer);
         }
    }



    render() {

        return <div className="Page-Control" >
            <div className="Swiper-Container">
                <div className="Banner">
                    <div className="Swiper" ref={this.ref}  >
                        <div className="Swiper-Item0 Swiper-Item"   >
                            <img className="Banner-Image" src="https://pic.xiami.net/images/common/uploadpic/30/1574046537430.jpg?x-oss-process=image/quality,q_80/crop,y_30,h_360"></img>
                        </div>
                        <div className="Swiper-Item1   Swiper-Item  Active">
                            <img className="Banner-Image" src="https://pic.xiami.net/images/common/uploadpic/91/1574047334091.jpg?x-oss-process=image/quality,q_80/crop,y_30,h_360"></img>
                        </div>

                        <div className="Swiper-Item2 Swiper-Item">
                            <img className="Banner-Image" src="https://pic.xiami.net/images/common/uploadpic/10/1574413636710.jpg?x-oss-process=image/quality,q_80/crop,y_30,h_360"></img>
                        </div>
                        <div className="Swiper-Item3 Swiper-Item " >
                            <img className="Banner-Image" src="https://pic.xiami.net/images/common/uploadpic/54/1573792049354.png?x-oss-process=image/quality,q_80/crop,y_30,h_360"></img>
                        </div>

                        <div className="Swiper-Item3 Swiper-Item" >
                            <img className="Banner-Image" src="https://pic.xiami.net/images/common/uploadpic/68/1573792006068.jpg?x-oss-process=image/quality,q_80/crop,y_30,h_360"></img>
                        </div>

                        <div className="Swiper-Item3 Swiper-Item" >
                            <img className="Banner-Image" src="https://pic.xiami.net/images/common/uploadpic/80/1574567089280.png?x-oss-process=image/quality,q_80/crop,y_30,h_360"></img>
                        </div>
                   </div>
                </div>
                <div className="Swiper-Shade"  >

                    <div className="Swiper-Shade-Wrapper">

                        <div className="Swiper-Shade-Left">

                        </div>

                        <div className="Swiper-Shade-Middle">

                        </div>

                        <div className="Swiper-Shade-Right">

                        </div>


                    </div>


                </div>

            </div>
            <audio controls={true} src="https://s128.xiami.net/845/6845/168118/2074204_1529581769105.mp3?ccode=xiami_web_web&amp;expire=86400&amp;duration=134&amp;psid=ac879e32aa845c6eccc05f6f30ca877e&amp;ups_client_netip=180.168.34.146&amp;ups_ts=1574668759&amp;ups_userid=86677830&amp;utid=gRndEezL1FUCAcuc24qbR1GW&amp;vid=2074204&amp;fn=2074204_1529581769105.mp3&amp;vkey=Bb474c65f111cdcd91359073ab751c5ff"></audio>
        </div>




    }

}

