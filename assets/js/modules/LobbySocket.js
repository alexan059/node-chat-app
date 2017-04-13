import $ from 'jquery';
import io from 'socket.io-client';
import selectize from 'selectize';
import _ from 'lodash';

class LobbySocket {

    constructor() {
        this.socket = io('/lobby');

        this.onCreate();
    }

    onCreate() {
        let $select = $('[name="room"]');
        let $selectize = $select.selectize({
            create: true,
            sortField: 'text'
        });
        let selectize = $selectize[0].selectize;

        this.selectRoom = $select;
        this.selectizeRoom = selectize;

        this.events();
    }

    events() {
        this.socket.on('updateRoomList', this.updateRoomList.bind(this));

        let selectize = this.selectizeRoom;
        selectize.on('focus', () => selectize.clear(true));
    }

    updateRoomList(rooms) {
        let roomOptions = _.map(rooms, (room) => {
            return {
                value: room,
                text: room
            }
        });

        let selected = this.selectRoom.val();
        let selectize = this.selectizeRoom;

        selectize.clearOptions();
        selectize.addOption(roomOptions);
        selectize.refreshOptions(false);
        selectize.createItem(selected);

    }

}

export default LobbySocket;