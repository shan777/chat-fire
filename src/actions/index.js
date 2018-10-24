import types from './types';
import { auth, db } from '../firebase';

export const createChatRoom = roomDetails => async dispatch => {
    const botMessage = {
        message: `Welcome to ${roomDetails.title}`,
        name: 'Chat-Bot'
    };

    const logKey = db.ref('/chat-logs').push().key;

    roomDetails.chatId = logKey;
    const roomRef = await db.ref('/chat-rooms').push(roomDetails);

    // console.log('Room Ref:', roomRef.key);

    await db.ref(`/chat-logs/${logKey}`).push(botMessage);

    // console.log('Log Key:', logKey);

    return roomRef.key;
}

export const getChatMessages = (chatId) => dispatch => {
    const dbRef = db.ref(`/chat-logs/${chatId}`);

    dbRef.on('value', (snapshot) => {
        // console.log('DB Snapshot: ', snapshot.val());

        dispatch({
            type: types.GET_CHAT_MESSAGES,
            messages: snapshot.val()
        });
    });

    return dbRef;
}

export const getRoomInfo = roomId => dispatch => {
    const dbRef = db.ref(`/chat-rooms/${roomId}`);

    dbRef.on('value', snapshot => {
        // console.log('Room Snapshot:', snapshot.val());

        dispatch({
            type: types.GET_ROOM_INFORMATION,
            roomInfo: snapshot.val()
        });
    }); 
    
    return dbRef;
}

export const getRoomList = () => dispatch => {
    const dbRef = db.ref('/chat-rooms');

    dbRef.on('value', snapshot => {
        dispatch({
            type: types.GET_ROOM_LIST,
            roomList: snapshot.val()
        });
        
        // console.log('Room List:', snapshot.val());
    });
}

export const sendMessage = (chatId, message) => dispatch => {
    const newMessage = {
        message,
        name: auth.currentUser.displayName
    }

    db.ref(`/chat-logs/${chatId}`).push(newMessage);
}

export const signUp = ({email, password, username}) => async dispatch => {
    try {
        await auth.createUserWithEmailAndPassword(email, password);

        const user = auth.currentUser;

        await user.updateProfile({
            displayName: username
        });

        console.log('Current User Display Name: ', auth.currentUser.displayName);

        dispatch({
            type: types.SIGN_UP,
            displayName: auth.currentUser.displayName
        });

    } catch(err) {
        console.log('Sign Up Error: ', err.message);
    }
}