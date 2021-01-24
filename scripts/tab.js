const tabHeader = document.querySelector('.service-header');
const tabsContent = document.querySelectorAll('.service-tab');


class Tab {
    constructor(tabHeader, tabContent) {
        this._header = tabHeader;
        this._content = tabContent;
    }

    _addEventListeners() {
        this._header.addEventListener('click', e => {
            for (let i = 0; i < this._header.children.length; i++) {
                const tab = this._header.children[i];
                const tabContent = this._content[i];

                tab.classList.remove('active');
                tabContent.classList.add('d-none');

                if (tab.contains(e.target)) {
                    tab.classList.add('active');
                    tabContent.classList.remove('d-none');
                }
            }
        });
    }

    init() {
        this._addEventListeners();
    }
}

const tab = new Tab(tabHeader, tabsContent);
tab.init();
