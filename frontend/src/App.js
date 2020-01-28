import scrollToComponent from 'react-scroll-to-component';
import React from 'react';
import logo from './logo.png';
import './App.css';
import worldMap from './world.svg';
import mapMarker from './map-marker.png'
import annyang from "annyang"
import MediaHandler from "./mediaHandler"
import openSocket from 'socket.io-client';
import Peer from "simple-peer"
const socket = openSocket('http://localhost:8000');
const video = document.querySelector('video')


let client = {}
let currentFilter
//get stream
let abc = navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        socket.emit('NewClient')
        video.srcObject = stream
        video.play()


        //used to initialize a peer
        function InitPeer(type) {
            let peer = new Peer({ initiator: (type == 'init') ? true : false, stream: stream, trickle: false })
            peer.on('stream', function (stream) {
                CreateVideo(stream)
            })
            //This isn't working in chrome; works perfectly in firefox.
            // peer.on('close', function () {
            //     document.getElementById("peerVideo").remove();
            //     peer.destroy()
            // })
            peer.on('data', function (data) {
                let decodedData = new TextDecoder('utf-8').decode(data)
                let peervideo = document.querySelector('#peerVideo')
                peervideo.style.filter = decodedData
            })
            return peer
        }

        //for peer of type init
        function MakePeer() {
            client.gotAnswer = false
            let peer = InitPeer('init')
            peer.on('signal', function (data) {
                if (!client.gotAnswer) {
                    socket.emit('Offer', data)
                }
            })
            client.peer = peer
        }

        //for peer of type not init
        function FrontAnswer(offer) {
            let peer = InitPeer('notInit')
            peer.on('signal', (data) => {
                socket.emit('Answer', data)
            })
            peer.signal(offer)
            client.peer = peer
        }

        function SignalAnswer(answer) {
            client.gotAnswer = true
            let peer = client.peer
            peer.signal(answer)
        }

        function CreateVideo(stream) {
            CreateDiv()

            let video = document.createElement('video')
            video.id = 'peerVideo'
            video.srcObject = stream
            video.setAttribute('class', 'embed-responsive-item')
            document.querySelector('#peerDiv').appendChild(video)
            video.play()
            //wait for 1 sec
            setTimeout(() => SendFilter(currentFilter), 1000)

            video.addEventListener('click', () => {
                if (video.volume != 0)
                    video.volume = 0
                else
                    video.volume = 1
            })

        }

        function SessionActive() {
            document.write('Session Active. Please come back later')
        }

        function SendFilter(filter) {
            if (client.peer) {
                client.peer.send(filter)
            }
        }

        function RemovePeer() {
            document.getElementById("peerVideo").remove();
            document.getElementById("muteText").remove();
            if (client.peer) {
                client.peer.destroy()
            }
        }

        socket.on('BackOffer', FrontAnswer)
        socket.on('BackAnswer', SignalAnswer)
        socket.on('SessionActive', SessionActive)
        socket.on('CreatePeer', MakePeer)
        socket.on('Disconnect', RemovePeer)

    })
    .catch(err => document.write(err))

    function CreateDiv() {
      let div = document.createElement('div')
      div.setAttribute('class', "centered")
      div.id = "muteText"
      document.querySelector('#peerDiv').appendChild(div)
      
  }



class LandingPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected : "false", 
      hasMedia: false,
      otherUserId: null,
    }
    this.peers = {};

    this.mediaHandler = new MediaHandler();
    this.setTrue = this.setTrue.bind(this)
   

  }

  

  setTrue() {
    this.setState({selected : "true"})
  }

  componentDidMount() {
    if (annyang) {
      // Let's define a command.
      var commands = {
        'hong kong': () => scrollToComponent(this.test, { offset: 0, align: 'middle', duration: 2000, ease:'inCirc'})
        
      };
     
      // Add our commands to annyang
      annyang.addCommands(commands);
     
      // Start listening.
      annyang.start();
    }
    
    // this.mediaHandler.getPermissions()
    //     .then((stream) => {
    //       // console.log(stream)
    //         this.setState({hasMedia: true});
    //         // this.user.stream = stream;

    //         try {
    //             this.myVideo.srcObject = stream;
    //         } catch (e) {
    //             this.myVideo.src = URL.createObjectURL(stream);
    //         }

    //         this.myVideo.play();
    //     })
  }


  render () {
    return (
      <div className="App">
        <header className="App-header">
          <div className={this.state.selected}>
            <div>
              {/* <video className="my-video" ref={(ref) => {this.myVideo = ref;}}></video>
              <video className="user-video" ref={(ref) => {this.userVideo = ref;}}></video> */}
          <div className ="select-country-text" >Select A Country</div>
          <div className="select-country-text-2">(use your voice to select country)</div>
          </div>
            <div className="world-map-container">
              <img src={worldMap} alt="world map" className="world-map" />
              <div className = "speech-bubble"> You Are Here</div>
              <span className ="dot"></span>
              <div className="hong-kong">
                <div className="wrapper">Hong Kong</div>
                <img className = "map-marker-hong-kong"src={mapMarker} ></img>
              </div>
            </div>
          </div>
          <div>
          <div className="bottom-container">
            <img src={logo} className={"App-logo-"+ this.state.selected} alt="logo" />
            
          </div>
                <div className="friend-text">Say Hello To Your New Friend!</div>
                <section className="test" ref={(section) => { this.test = section; }}></section>
                <div className="translate">
                <img src={logo} className={"App-logo-2"} alt="logo" />
                <span className={"popuptext-true"} id="myPopup">
                Here Are Some Common Phrases You Can Say! 
                <br></br>
                <br></br>
                Hello my name is (your name) nice to meet you! <br></br>
                Nín hǎo, wǒ jiào (your name) hěn gāoxìng rènshì nín!
                </span>
                </div>
          </div>
        </header>
          
      </div>
  );
 }
}

export default LandingPage;
