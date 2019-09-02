import React, { Component } from 'react'
import io from 'socket.io-client';

/*   const socket = io("http://localhost:8080/");
 */  const socket = io();


export default class App extends Component {

componentDidMount()
{




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
    });
  
    


}
  render() {
    return (
      <div>
        Hello
      </div>
    )
  }
}
