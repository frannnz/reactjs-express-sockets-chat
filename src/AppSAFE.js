import React, { Component } from 'react'
import io from 'socket.io-client';


let ownId = "User++" + Math.random();

export default class App extends Component {

  state = {
    endpoint: "http://localhost:8080",
    /*   endpoint: "", */


    usernameInput: "",
    username: "",
    onlineObj: [],

    textChat: "",

  }



  componentDidMount() {


      const socket = io(this.state.endpoint);


      socket.on("connect", data => {
        socket.emit("storeClientInfo", {
        });
      });
      socket.on("server message", data => {
        this.setState({ onlineObj: data });
      });
    }




  formRender = () => {

        if (this.state.username === "") {
          return (
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                onChange={this.handleInputChange}
                value={this.state.usernameInput}
                autoFocus
              />
              <button type="submit">
                ok
        </button>
            </form>
          )
        }
        else {
          return (this.state.username)
        }
      }


  handleSubmit = event => {
        event.preventDefault();
        this.setState({
          username: this.state.usernameInput,
/*       usernameInput: ""
 */    })
        ///////////////
        const socket = io(this.state.endpoint);
        socket.on("connect", data => {
          socket.emit("storeClientInfo", {
            name: this.state.username,
            customId: ownId
          });
        });
        socket.on("server message", data => {
          this.setState({ onlineObj: data });
        });

      }

  handleInputChange = event => {
        const usernameInput = event.target.value;
        this.setState({ usernameInput: usernameInput });
      };



    handleChat = event => {
      const chatInput = event.target.value;
      this.setState({ textChat: chatInput });
    };


    chatSubmit = event => {
      event.preventDefault();

      console.log("send");

      const socket = io(this.state.endpoint);


      socket.emit("storeChat", {
        name: "test"



      });



      this.setState({ textChat: "" });

    }


    render() {
      return (
        <div>

          <div className="login">
            {this.formRender()}
          </div>

          <div className="online">
            <h4>Users Online</h4>
            <ul>
              {this.state.onlineObj.slice(0).reverse().map(item => (
                <li key={item.clientId}>
                  {item.name}
                </li>
              ))}
            </ul>
          </div>

          <div>


            <form onSubmit={this.chatSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                onChange={this.handleChat}
                value={this.state.textChat}
                autoFocus
              />
              <button type="submit">
                chat
        </button>
            </form>




          </div>
        </div>

      )
    }
  }
