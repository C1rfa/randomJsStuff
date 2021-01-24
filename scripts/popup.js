'use strict';

const popWindow = document.querySelector('.popup');
const popBtns = document.querySelectorAll('.popup-btn');
const popClose = popWindow.querySelector('.popup-close');

class Popup {
    constructor(popWin, popBtn, popClose) {
        this._popWin = popWin;
        this._popBtns = Array.from(popBtn);
        this._popClose = popClose;

        this._popWin.style.display = 'block';
        this._popWin.style.transform = 'translateX(-100%)';
    }


    _hideShowDesktop(xPos) {
        const start = performance.now();
        const dur = 250;
        const animId = requestAnimationFrame(function anim(time) {
            let prog = Math.floor(((time - start) / dur) ** 2 * 100);

            if (prog > 100) {
                prog = 100;
            }
            this._popWin.style.transform = xPos < 0 ? `translateX(${xPos + prog}%)` : `translateX(${xPos - prog}%)`;
            if (prog < 100) {
                requestAnimationFrame(anim.bind(this));
            } else {
                cancelAnimationFrame(animId);
            }
        }.bind(this));
    }

    _hideShowMobile(xPos) {
        this._popWin.style.transform = xPos < 0 ? `translateX(0%)` : `translateX(-100%)`;
    }

    _popupHandler(e) {
        if (e.target === this._popWin || e.target === this._popClose || this._popBtns.includes(e.target)) {
            const xPos = Math.floor((this._popWin.getBoundingClientRect().x / this._popWin.clientWidth) * 100);

            innerWidth < 768 ? this._hideShowMobile(xPos) : this._hideShowDesktop(xPos);
        }
    }

    init() {
        window.addEventListener('click', this._popupHandler.bind(this));
    }
}

const popup = new Popup(popWindow, popBtns, popClose);
popup.init();
