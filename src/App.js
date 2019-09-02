import React, { Component } from 'react'
import io from 'socket.io-client';

/*   const socket = io(); */

let ownId = "User++" + Math.random();


export default class App extends Component {

  state = {
    /*     endpoint: "http://localhost:4001",
     */    
    endpoint: "",
    
        
        usernameInput: "",
        username: "",
        onlineObj: [],
    
      }

      
      
componentDidMount()
{

  const socket = io(this.state.endpoint);
  socket.on("connect", data => {
    socket.emit("storeClientInfo", {
    });
  });
  socket.on("server message", data => {
    this.setState({ onlineObj: data });
  });


/*   const socket = io(this.state.endpoint);

  socket.on('hello', ({message}) => 
  {
  alert (message)
  }

  );
  
  
  socket.on("connect", data => {
      socket.emit("storeClientInfo", {
        name: "test",
        customId: "ownId"
      });
    });
    socket.on("server message", data => {
      this.setState({ onlineObj: data });
    }); */
  
    
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
    usernameInput: ""
  })
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
      </div>

    )
  }
}
