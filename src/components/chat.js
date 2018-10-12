import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getChatMessages } from '../actions';

class Chat extends Component {
    componentDidMount() {
        this.props.getChatMessages();
    }

    render() {
        return(
            <div>
                <h1 className="center">Chat Room</h1>
            </div>
        );
    }
}

export default connect(null, {
    getChatMessages: getChatMessages
})(Chat);