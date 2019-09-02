import React, { Component } from 'react'
import io from 'socket.io-client';


let ownId = "User++" + Math.random();

export default class App extends Component {

    state = {
        /* endpoint: "http://localhost:8080", */
        endpoint: "",

        usernameInput: "",
        username: "",
        onlineObj: [],
        textChat: "",

        response: '',
        post: '',
        post2: '',
        responseToPost: '',

    }



    componentDidMount() {
        ////////////////////////////////////
        this.callApi()
            .then(res => this.setState({ response: res.express }))
            .catch(err => console.log(err));
        ///////////////////////////////////   
        const socket = io(this.state.endpoint);
        socket.on("connect", data => {
            socket.emit("storeClientInfo", {
            });
        });
        socket.on("server message", data => {
            this.setState({ onlineObj: data });
        });
    }


    callApi = async () => {
        const response = await fetch(`${this.state.endpoint}/api/hello`);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

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


    handleFormSubmit = async e => {


        e.preventDefault();
        const response = await fetch(`${this.state.endpoint}/api/world`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                post: this.state.post,
                post2: this.state.post2
            }),
        });
        const body = await response.text();

        this.setState({ responseToPost: body });
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

                <div>


                    <p>{this.state.response}</p>
                    <form onSubmit={this.handleFormSubmit}>
                        <p>
                            <strong>Post to Server:</strong>
                        </p>
                        <input
                            type="text"
                            value={this.state.post2}
                            onChange={e => this.setState({ post2: e.target.value })}
                        />

                        <input
                            type="text"
                            value={this.state.post}
                            onChange={e => this.setState({ post: e.target.value })}
                        />
                        <button type="submit">Submit</button>
                    </form>
                    <p>{this.state.responseToPost}</p>
                </div>



            </div>


        )
    }
}
