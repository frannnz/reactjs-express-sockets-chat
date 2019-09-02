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
        chatMessages: [],
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


        if (this.state.usernameInput !== "")
        {

           
        


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
            console.log(data);

            this.setState({ chatMessages: data });
        });

}

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




    loadChat = () => {

        if (this.state.username !== "") {
            return (

                <div className="Chat">

                    <form onSubmit={this.chatSubmit}>
                        <input
                            type="text"
                            placeholder=""
                            onChange={this.handleChat}
                            value={this.state.textChat}
                            autoFocus
                        />
                        <button type="submit">
                            chat</button>
                    </form>
                    <ul>
                        {this.state.chatMessages.slice(-10).reverse().map((item, index) => (
                            <li key={index}> 
                                 <img src='https://www.123gif.de/gifs/smileys/smileys-0027.gif'></img><span className="userName">{item.user}:</span> {item.text}
                            </li>
                        ))}
                    </ul>





                </div>
            );

        }

    }

    render() {
        return (
            <div>
                <div className="login">
                    {this.formRender()}
                </div>
                <div className="online">
                    {this.state.onlineObj.length} Online
                    <ul>
                        {this.state.onlineObj.slice(0).reverse().map(item => (
                            <li key={item.clientId}>
                                {item.name}
                            </li>
                        ))}
                    </ul>
                </div>



                <div>

                    {this.loadChat()}

                </div>









                {/*                 <div>
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
                </div> */}
            </div>

        )
    }
}
