import {io} from 'socket.io-client';
import {baseURLSocket} from '../constants/api';

const socket = io(baseURLSocket, {
  transports: ['websocket'],
  jsonp: false,
});

export default socket;
