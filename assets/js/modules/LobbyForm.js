import $ from 'jquery';
import bcrypt from 'bcryptjs';

import '../libs/hexString';

export default class LobbyForm {

    constructor() {
        this.form = $('#lobby-form');
        this.password = this.form.find('[name="password"]');
        this.passwordEnable = this.form.find('.password-enable');

        this.events();
    }

    events() {
        this.form.on('submit', this.onSubmit.bind(this));
        this.passwordEnable.on('click', this.togglePasswordField.bind(this));
    }

    onSubmit(event) {
        // event.preventDefault();
        //
        // let form = event.target;
        //
        // let password = form.password.value || false;
        //
        // this.hashPassword(password).then((hash) => {
        //     let hashedHex = $.hexEncode(hash);
        //
        //     let input = document.createElement('input');
        //
        //     input.setAttribute('type', 'hidden');
        //     input.setAttribute('name', 'token');
        //
        //     input.setAttribute('value', hash);
        //
        //     form.appendChild(input);
        //
        //     this.password.prop('disabled', true);
        //     this.passwordEnable.prop('disabled', true);
        // });


        // })
        //     .then(() => {
        //     form.submit();
        // });

    }

    togglePasswordField() {
        let disabled = this.password.prop('disabled');

        this.password.prop('disabled', !disabled);
    }

    hashPassword(password) {
        return new Promise((resolve, reject) => {
            if (!password) {
                return reject();
            }

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(hash);
                });
            });
        });
    }
}