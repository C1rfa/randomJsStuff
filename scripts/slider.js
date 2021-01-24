const slide = document.querySelectorAll('.portfolio-item');
const btn = document.querySelectorAll('.portfolio-btn');
const slider = document.querySelector('.portfolio-content');


class Slider {
    constructor(slide, slider, btn) {
        this._currentSlide = 0;
        this._slides = slide;
        this._dots = [];
        this._slider = slider;
        this._btns = Array.from(btn);
    }

    _addDotes() {
        const dotCont = document.createElement('ul');
        dotCont.classList.add('portfolio-dots');

        for (let i = 0; i < this._slides.length; i++) {
            const dot = document.createElement('li');
            this._dots.push(dot);

            dot.classList.add('dot');
            dotCont.appendChild(dot);
        }
        this._dots[this._currentSlide].classList.add('dot-active');

        slider.insertAdjacentElement('beforeend', dotCont);
    }

    _changeSlide(index) {
        this._dots[this._currentSlide].classList.remove('dot-active');
        this._slides[this._currentSlide].classList.remove('portfolio-item-active');

        this._currentSlide = index;

        this._dots[this._currentSlide].classList.add('dot-active');
        this._slides[this._currentSlide].classList.add('portfolio-item-active');
    }

    _startSlider() {
        this._interval = setInterval(() => {
            this._changeSlide((this._currentSlide + 1) % this._slides.length);
        }, 2000);
    }

    _stopSlider() {
        clearInterval(this._interval);
    }

    _sliderClickHandler(e) {
        e.preventDefault();
        if (e.target.matches('#arrow-right')) {
            this._changeSlide((this._currentSlide + 1) % this._slides.length);
        } else if (e.target.matches('#arrow-left')) {
            this._changeSlide(Math.abs((this._slides.length + this._currentSlide - 1) % this._slides.length));
        } else if (this._dots.includes(e.target)) {
            this._changeSlide(this._dots.indexOf(e.target));
        }
    }

    _sliderHoverHandler(e) {
        if (this._btns.includes(e.target) || this._dots.includes(e.target)) {
            if (e.type === 'mouseover') {
                this._stopSlider();
            } else {
                this._startSlider();
            }
        }
    }

    init() {
        this._addDotes();
        this._startSlider();
        this._slider.addEventListener('click', this._sliderClickHandler.bind(this));
        this._slider.addEventListener('mouseover', this._sliderHoverHandler.bind(this));
        this._slider.addEventListener('mouseout', this._sliderHoverHandler.bind(this));
    }
}

const sld = new Slider(slide, slider, btn);
sld.init();
