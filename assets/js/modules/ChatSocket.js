import $ from 'jquery';
import io from 'socket.io-client';
import Mustache from 'mustache';
import moment from 'moment';

import '../libs/deparam';


class ChatSocket {

    constructor() {
        this.socket = io();

        this.messageTemplate = $('#message-template').html();
        this.locationTemplate = $('#location-message-template').html();

        this.messages = $('#messages');
        this.locationButton = $('#send-location');
        this.messageForm = $('#message-form');
        this.messageInput = $('[name="message"]');
        this.userList = $('#users');

        this.events();
    }

    events() {
        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('disconnect', this.onDisconnect);
        this.socket.on('newMessage', this.onNewMessage.bind(this));
        this.socket.on('newLocationMessage', this.onNewLocatonMessage.bind(this));
        this.socket.on('updateUserList', this.onUpdateUserList.bind(this));

        this.messageForm.on('submit', this.onSubmitMessage.bind(this));
        this.locationButton.on('click', this.onSendLocation.bind(this));
    }

    onConnect() {
        let params = $.deparam(window.location.search);

        this.emitJoin(params)
            .then((message) => console.log(message))
            .catch((error) => {
                alert(error);
                window.location.href = '/';
            })
    }

    onDisconnect() {
        console.log('Disconnected from server.')
    }

    emitJoin(params) {
        let socket = this.socket;

        return new Promise((resolve, reject) => {
            socket.emit('join', params, (error) => {
                if (error) {
                    return reject(error)
                }

                resolve('Connected to server.');
            });
        });
    }

    emitMessage(message) {
        let socket = this.socket;

        return new Promise((resolve) => {
            socket.emit('createMessage', {
                text: message
            }, resolve);
        });
    }

    emitLocation(position) {
        let socket = this.socket;

        return new Promise((resolve) => {
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, resolve);
        });
    }

    onNewMessage(message) {
        let formattedTime = moment(message.createdAt).format('h:mm a');

        let html = Mustache.render(this.messageTemplate, {
            from: message.from,
            text: message.text,
            createdAt: formattedTime
        });

        this.messages.append(html);
        this.scrollToBottom();
    }

    onNewLocatonMessage(message) {
        let formattedTime = moment(message.createdAt).format('h:mm a');

        let html = Mustache.render(this.locationTemplate, {
            from: message.from,
            url: message.url,
            createdAt: formattedTime
        });

        this.messages.append(html);
        this.scrollToBottom();
    }

    onSubmitMessage(event) {
        event.preventDefault();
        let input = this.messageInput;

        let message = input.val();

        this.emitMessage(message).then(() => input.val(''));
    }

    onSendLocation() {
        let that = this;

        that.locationButton.attr('disabled', 'disabled').text('Sending location...');

        that.getLocation()
            .then((position) => that.emitLocation(position))
            .catch((error) => alert(error))
            .then(() => that.locationButton.removeAttr('disabled').text('Send location'));
    }

    onUpdateUserList(users) {
        let ol = $('<ol></ol>');

        users.forEach((user) => {
            let li = $('<li></li>');
            ol.append(li.text(user));
        });

        this.userList.html(ol);
    }

    getLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                return reject('Geolocation not supported by your browser.');
            }

            navigator.geolocation.getCurrentPosition(
                (position) => resolve(position),
                () => reject('Unable to fetch location'));
        });
    }

    scrollToBottom() {
        let newMessage = this.messages.children('li:last-child');

        let clientHeight = this.messages.prop('clientHeight');
        let scrollTop = this.messages.prop('scrollTop');
        let scrollHeight = this.messages.prop('scrollHeight');
        let newMessageHeight = newMessage.innerHeight();
        let lastMessageHeight = newMessage.prev().innerHeight();

        if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
            this.messages.scrollTop(scrollHeight);
        }
    }
}

export default ChatSocket;