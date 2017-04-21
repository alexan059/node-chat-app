import $ from 'jquery';
import io from 'socket.io-client';
import _ from 'lodash';
import swal from 'sweetalert2';
import 'selectize';

import '../libs/deparam';

const errors = {
    invalid: 'Name and room are not valid.',
    user_exists: 'User already exists in this room.'
};

class LobbySocket {

    constructor() {
        this.showErrors(); // Show errors first

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
            };
        });

        let selected = this.selectRoom.val();
        let selectize = this.selectizeRoom;

        selectize.clearOptions();
        selectize.addOption(roomOptions);
        selectize.refreshOptions(false);
        selectize.createItem(selected);

    }

    showErrors() {
        let params = $.deparam(window.location.search);

        if (params.error) {
            let error = errors[params.error] || 'Something went wrong. Please try again.';

            swal({
                text: error,
                onClose: () => window.location.href = '/'
            });
        }
    }

}

export default LobbySocket;