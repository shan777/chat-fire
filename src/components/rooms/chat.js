import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { getChatMessages, getRoomInfo, sendMessage } from '../../actions';
import Input from '../general/input';

class Chat extends Component {
    roomRef = null;
    chatRef = null;

    componentDidMount() {
        const { getRoomInfo, match: { params }} = this.props;

        // console.log('Room ID"', params.room_id);

        this.roomRef = getRoomInfo(params.room_id);
        
        // console.log('DB Ref:', this.dbRef);
        console.log('Log Ref:', this.logRef);

    }

    scrollToBottom() {
        this.logRef.scrollTop = this.logRef.scrollHeight;
    }

    componentDidUpdate(prevProps) {
        const { chatId, getChatMessages } = this.props;
        if(chatId && prevProps.chatId !== chatId){
            this.chatRef = getChatMessages(chatId);
        }
        
        this.scrollToBottom();
    }

    componentWillUnmount() {
        if(this.roomRef) {
            this.roomRef.off();
        }
        if(this.chatRef) {
            this.chatRef.off();
        }
    }
    
    handleSendMessage = ({message}) => {
        // console.log('Send Message:', message);

        const { chatId, sendMessage, reset } = this.props;

        if(chatId) {
            console.log('Chat ID: ', chatId);
            sendMessage(chatId, message);
            reset();
        }


    }

    render() {
        // console.log('Chat Props: ', this.props);
        const { description, messages, title, topic, handleSubmit } = this.props;

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

                <ul ref={e => this.logRef = e} className="collection chat-log">
                    {messageElements}
                </ul>
                <form className="row" onSubmit={handleSubmit(this.handleSendMessage)}>
                    <div className="col s10">
                        <Field name="message" label="Message" component={Input}/>
                    </div>
                    <div className="col s2 center-align">
                        <button className="btn orange send-button">Send</button>
                    </div>
                </form>
            </div>
        );
    }
}

Chat = reduxForm({
    form: 'chat-message'
})(Chat);

function mapStateToProps (state) {
    return { ...state.chat };
}

export default connect(mapStateToProps, {
    getChatMessages: getChatMessages,
    getRoomInfo: getRoomInfo,
    sendMessage: sendMessage
})(Chat);