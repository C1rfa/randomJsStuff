const calc = document.querySelector('.calc-block');

class Calc {
    constructor(calc) {
        this.calc = calc;
        this.type = calc.querySelector('.calc-type');
        this.squr = calc.querySelector('.calc-square');
        this.day = calc.querySelector('.calc-day');
        this.count = calc.querySelector('.calc-count');
        this.total = calc.querySelector('.calc-total #total');
    }

    _countSum(price) {
        let cntVl = 1;
        let dayVl = 1;

        if (this.day.value) {
            if (this.day.value < 5) {
                dayVl *= 2;
            }
            else if (this.day.value < 10) {
                dayVl *= 1.5;
            }
        }

        if (this.count.value > 1) {
            cntVl += (this.count.value - 1) / 10;
        }

        if (this.type.options[this.type.selectedIndex].value && this.squr.value) {
            this.total.textContent = Math.round(price * +this.type.options[this.type.selectedIndex].value
                * this.squr.value * cntVl * dayVl);
        }
        else {
            this.total.textContent = 0;
        }
    }

    _onChange() {
        this._countSum(100);
        console.log(this.type.selectedIndex);

    }

    _onlyNumbers(e) {
        if (e.target.tagName !== 'SELECT') {
            const mtch = e.target.value.match(/^(0|[1-9][0-9]*)/);
            e.target.value = mtch ? mtch[0] : '';
        }
    }

    init() {
        this.calc.addEventListener('input', this._onlyNumbers);
        this.calc.addEventListener('change', this._onChange.bind(this));
    }
}

const cl = new Calc(calc);
cl.init();
