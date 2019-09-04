import React, { Component } from 'react'
import io from 'socket.io-client';
import Demo from './components/geo'

import ScrollToBottom from 'react-scroll-to-bottom';


let ownId = "User++" + Math.random();


let LocalHost = "online"; // "online" or "offline"
// use "offline" for local work
// use "online" to deploy 
let setHost = "";
if (LocalHost === "offline") {
    setHost = "http://localhost:8080";
}

export default class App extends Component {

    state = {
        endpoint: setHost,
        usernameInput: "",
        username: "",
        onlineObj: [],
        chatMessages: [],
        textChat: "",

        open: false,
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
                <form onSubmit={this.handleLoginSubmit}>
                    <input
                        type="text"
                        placeholder="Your Name"
                        onChange={this.handleLoginChange}
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


    handleLoginSubmit = event => {
        event.preventDefault();
        if (this.state.usernameInput !== "") {
            this.setState({
                username: this.state.usernameInput,
            })
            ///////////////
            const socket = io(this.state.endpoint);
            socket.on("connect", data => {
                socket.emit("storeClientInfo", {
                    name: this.state.username,
                    customId: ownId
                });
                socket.emit("storeChat", {
                    text: `${this.state.username} joined!`,
                    user: "Admin",
                });
            });
            socket.on("server message", data => {
                this.setState({ onlineObj: data });
            });
            socket.on("chatMessage", data => {
                /* console.log(data); */
                this.setState({ chatMessages: data });
            });
        }
    }

    handleLoginChange = event => {
        const usernameInput = event.target.value;
        this.setState({ usernameInput: usernameInput });
    };

    handleChatChange = event => {
        const chatInput = event.target.value;

        this.setState({ textChat: chatInput });


    };

    handleChatSubmit = event => {
        event.preventDefault();
        if (this.state.textChat !== "") {
            const socket = io(this.state.endpoint);
            socket.on("connect", data => {
                socket.emit("storeChat", {
                    text: this.state.textChat,
                    user: this.state.username,
                });
                this.setState({ textChat: "" });
            });


            socket.on("chatMessage", data => {
                this.setState({ chatMessages: data });
            });

        }
    }

    loadChat = () => {
        if (this.state.username !== "") {
            return (
                <div>
                    <div className="Chat">
                        <ScrollToBottom scrollToBottom className="scrolling">
                            <ul>
                                {this.state.chatMessages.slice(-50).map((item, index) => (
                                    <li key={index}>

                                        {item.user !== this.state.username ?
                                            (
                                                <div className="userNameLeft">
                                                    <div className="userLeft">{item.user}<br></br>
                                                        {item.text}</div>
                                                </div>
                                            ) : (
                                                <div className="userNameRight">
                                                    <div className="userRight">
                                                        {item.text}</div>
                                                </div>
                                            )
                                        }

                                    </li>
                                ))}
                            </ul>
                        </ScrollToBottom>
                    </div>


                    <form onSubmit={this.handleChatSubmit}>
                        <div className="ChatInput">
                            <input
                                type="text"
                                placeholder="Message"
                                onChange={this.handleChatChange}
                                value={this.state.textChat}
                                autoFocus
                            />
                            <button type="submit">
                                &#10148;	</button>
                        </div>
                    </form>


                </div>
            );
        }
    }



    toggle() {
        this.setState({
            open: !this.state.open
        });
    }


    render() {
        return (
            <div>


                <div className="login">
                    {this.formRender()}
                </div>






                                <div className="online">
                    <button onClick={this.toggle.bind(this)}>
                        {this.state.onlineObj.length} User online ☰       </button>
                    <div className={"collapse" + (this.state.open ? ' in' : '')}>
                        <div className="onlineNames">
                            <ul>
                                {this.state.onlineObj.slice(0).reverse().map(item => (
                                    <li  className="oUser" key={item.clientId}>
                                        {item.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

{/*                 <div className="online">
                    {this.state.onlineObj.length} User online
                <div className="onlineNames">
                        <ul>
                            {this.state.onlineObj.slice(0).reverse().map(item => (
                                <li className="oUser" key={item.clientId}>
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div> */}

                <div>
                    {this.loadChat()}
                </div>


                {/* <Demo /> */}
            </div>
        )
    }
}
