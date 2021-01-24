const form1 = document.querySelector('#form1');
const form2 = document.querySelector('#form2');
const form3 = document.querySelector('#form3');


class Form {
    constructor(form) {
        this.form = form;
        this.name = form.querySelector('input[name="user_name"]');
        this.phone = form.querySelector('input[name="user_phone"]');
        this.uMessage = form.querySelector('input[name="user_message"]');

        this.message = document.createElement('span');

        this.phone.value = '+7';
        this.form.append(this.message);
    }

    _clearAllInputs() {
        for (const item of this.form.querySelectorAll('input')) {
            item.value = '';
        }
    }

    _checkPhone() {
        let final = '';
        const prefix = this.phone.value.match(/^((\+[7-8]))/);
        if (prefix) {
            final += prefix[0];
            if (final.length >= 2) {
                const number = this.phone.value.slice(final.length).match(/[0-9]+/);
                final += number ? number[0].substring(0, 10) : '';
            }
        } else if (final.length < 2) {
            final = '+7';
        }
        this.phone.value = final;
    }

    _checkRus(element) {
        const mtch = element.value.match(/[\p{sc=Cyrillic} ]+/u);
        element.value = mtch ? mtch[0] : '';
    }

    _inputHandler(e) {
        if (e.target === this.phone) {
            this._checkPhone();
        } else if (e.target === this.name || e.target === this.uMessage) {
            this._checkRus(e.target);
        }
    }

    _changeMessage(type) {
        switch (type) {
        case 'success':
            this.message.textContent = 'Ваша заявка отпралена!';
            break;
        case 'error':
            this.message.textContent = 'Не удалось отправить заявку.';
            break;
        default:
            this.message.textContent = 'Ваша заявка отправлется';
            break;
        }
    }

    _sendRequest(data) {
        this._changeMessage();

        const createParams = (method, body) => {
            return {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            };
        }

        return fetch('./server.php', createParams('POST', data));
    }

    _onSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        const data = {};

        formData.forEach((value, key) => data[key] = value);

        this._sendRequest(data)
            .then(response => {
                if (response.status === 200) {
                    this._changeMessage('success');
		    this._clearAllInputs(); 
                } else {
                    throw new Error('error');
                }
            })
            .catch(exc => this._changeMessage(exc.message));
    }

    init() {
        this.form.addEventListener('input', this._inputHandler.bind(this));
        this.form.addEventListener('submit', this._onSubmit.bind(this));
    }
}

const fm1 = new Form(form1);
const fm2 = new Form(form2);
const fm3 = new Form(form3);

fm1.init();
fm2.init();
fm3.init();
