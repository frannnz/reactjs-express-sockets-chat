import React, { Component } from 'react';



class App extends Component {
    state = {
        response: '',
        post: '',
        post2: '',
        responseToPost: '',
    };

    componentDidMount() {
        this.callApi()
            .then(res => this.setState({ response: res.express }))
            .catch(err => console.log(err));


    }

    callApi = async () => {
        const response = await fetch('http://localhost:8080/api/hello');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        return body;
    };



    handleSubmit = async e => {


        e.preventDefault();
        const response = await fetch('http://localhost:8080/api/world', {
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
            <div className="App">
                <p>{this.state.response}</p>
                <form onSubmit={this.handleSubmit}>
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
        );
    }
}

export default App;