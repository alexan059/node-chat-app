import io from 'socket.io-client';

class LobbySocket {

    constructor() {
        this.socket = io('/lobby');
    }

}

export default LobbySocket;