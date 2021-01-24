'use strict';

const btnMenu = document.querySelector('.menu');
const menu = document.querySelector('menu');
const btnClose = document.querySelector('.close-btn');
const menuItems = menu.querySelectorAll('ul>li>a');

class Menu {
    constructor(menu, menuItems, menuBtn, closeMenuBtn) {
        this._menu = menu;
        this._items = Array.from(menuItems);
        this._btn = menuBtn;
        this._closeBtn = closeMenuBtn;
    }

    _menuOpenCloseDesktop(xPos) {
        const start = performance.now();
        const dur = 250;
        const animId = requestAnimationFrame(function anim(time) {
            let prog = Math.floor(((time - start) / dur) ** 2 * 100);

            if (prog > 100) {
                prog = 100;
            }
            this._menu.style.transform = xPos < 0 ? `translateX(${xPos + prog}%)` : `translateX(${xPos - prog}%)`;
            if (prog < 100) {
                requestAnimationFrame(anim.bind(this));
            } else {
                cancelAnimationFrame(animId);
            }
        }.bind(this));
    }

    _menuOpenCloseMobile(xPos) {
        this._menu.style.transform = xPos < 0 ? `translateX(0%)` : `translateX(-100%)`;
    }

    _menuHandler(e) {
        if (this._btn.contains(e.target) || e.target === this._closeBtn || this._items.includes(e.target)) {
            const xPos = Math.floor((this._menu.getBoundingClientRect().x / this._menu.clientWidth) * 100);

            innerWidth < 768 ? this._menuOpenCloseMobile(xPos) : this._menuOpenCloseDesktop(xPos);
        }
    }

    init() {
        window.addEventListener('click', this._menuHandler.bind(this));
    }
}

const mn = new Menu(menu, menuItems, btnMenu, btnClose);

mn.init();
