import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getChatMessages, getRoomInfo } from '../../actions';

class Chat extends Component {
    roomRef = null;
    chatRef = null;

    componentDidMount() {
        const { getRoomInfo, match: { params }} = this.props;

        // console.log('Room ID"', params.room_id);

        this.roomRef = getRoomInfo(params.room_id);
        
        // console.log('DB Ref:', this.dbRef);
    }

    componentDidUpdate(prevProps) {
        const { chatId, getChatMessages } = this.props;
        if(chatId && prevProps.chatId !== chatId){
            this.chatRef = getChatMessages(chatId);
        }
    }

    componentWillUnmount() {
        if(this.roomRef) {
            this.roomRef.off();
        }
        if(this.chatRef) {
            this.chatRef.off();
        }
    }
    
    render() {
        // console.log('Chat Props: ', this.props);
        const { description, messages, title, topic } = this.props;
        const messageElements = Object.keys(messages).map(key => {
            const { name, message } = messages[key];
            return(
                <li key={key} className="collection-item">
                    <b>{name}: </b> {message}
                </li>
            );
        });

        return(
            <div>
                <div className="center">
                    <h1>{title || 'Chat Room'}</h1>
                    <h4 className="grey-text text-lighten-1">{topic}</h4>
                    <p className="grey-text text-darken-3">{description}</p>
                </div>
                <ul className="collection">
                    {messageElements}
                </ul>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return { ...state.chat };
}

export default connect(mapStateToProps, {
    getChatMessages: getChatMessages,
    getRoomInfo: getRoomInfo
})(Chat);