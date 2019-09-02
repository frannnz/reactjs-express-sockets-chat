import React, { Component } from 'react'
import socketIOClient from "socket.io-client";


console.clear();
let ownId = "User++" + Math.random();

export class App extends Component {

  state = {
    endpoint: "http://localhost:8080",
    endpoint: "",

    
    usernameInput: "",
    username: "",
    onlineObj: [],

  }

  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      username: this.state.usernameInput,
      usernameInput: ""
    })
    ///////////////
    const socket = socketIOClient(this.state.endpoint);
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



  componentDidMount() {
    const socket = socketIOClient(this.state.endpoint);
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


  render() {

    if (this.state.onlineObj.length !== 0) {
      console.log(this.state.onlineObj);
    }


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
      </div>
    )
  }
}

export default App