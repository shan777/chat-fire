import types from './types';
import { db } from '../firebase';

export const getChatMessages = () => dispatch => {
    db.ref('/').on('value', (snapshot) => {
        console.log('DB Snapshot: ', snapshot.val());
    });
}