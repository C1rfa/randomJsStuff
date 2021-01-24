'use strict';

//Buttons
const startBtn = document.querySelector('#start');
const resetBtn = document.querySelector('#cancel');
const incomePlusBtn = document.querySelector('.income_add');
const expensesPlusBtn = document.querySelector('.expenses_add');

//Deposit
const depositCheck = document.querySelector('#deposit-check');
const depositBan = document.querySelector('.deposit-bank');
const depositAmount = document.querySelector('.deposit-amount');
const depositPercent = document.querySelector('.deposit-percent');

//Поля дополнительного дохода
const additionalIncomeItems = document.querySelectorAll('.additional_income-item');

//Результирующие поля
const budgetMonthValue = document.querySelector('.budget_month-value');
const budgetDayValue = document.querySelector('.budget_day-value');
const expensesMonthValue = document.querySelector('.expenses_month-value');
const additionalIncomeValue = document.querySelector('.additional_income-value');
const additionalExpensesValue = document.querySelector('.additional_expenses-value');
const totalIncomePeriodValue = document.querySelector('.income_period-value');
const targetMonthValue = document.querySelector('.target_month-value');

//Поля без возможности дублирования
const salaryInput = document.querySelector('.salary-amount');
const additioanlexpensesInput = document.querySelector('.additional_expenses-item');
const targetAmount = document.querySelector('.target-amount');
const periodSelect = document.querySelector('.period-select');

//Коллекции дублирующихся полей
const expensesItems = document.getElementsByClassName('expenses-items');
const incomeItems = document.getElementsByClassName('income-items');

const allSumsPh = document.querySelectorAll('input[placeholder="Сумма"]');

class AppData {
    constructor() {
        this.money = 0;
        this.income = {};
        this.addIncome = [];
        this.expenses = {};
        this.addExpenses = [];
        this.deposit = false;
        this.percentDeposit = 0;
        this.moneyDeposit = 0;
        this.mission = 0;
        this.budgetDay = 0;
        this.budgetMonth = 0;
        this.expensesMonth = 0;
    }

    checkNumb(e) {
        const match = e.target.value.match(/[0-9]+/);
        match ? e.target.value = match[0] : e.target.value = '';
    }

    checkMoney (e) {
        e.target.value.trim() ? startBtn.disabled = false : startBtn.disabled = true;
    }

    percentCheck(e) {
        const match = e.target.value.match(/[0-9]+/);
        !match ? e.target.value = '0' : +match[0] > 100 ? e.target.value = 100 :  e.target.value = match[0]
    }

    periodTitleChange () {
        const periodTitle = document.querySelector('.period-amount');
        
        periodTitle.textContent = periodSelect.value;
        totalIncomePeriodValue.value = this.calcPeriod(); 
    }

    depositChangePercent() {
        const selectedIndex = this.value;

        if (selectedIndex === 'other') {
            depositPercent.style.display = 'inline-block';
            depositPercent.value = '0';
        } 
        else {
            depositPercent.style.display = 'none';
            depositPercent.value = selectedIndex;
        }
    }

    disableInputs (val) {
        const leftInputs = document.querySelectorAll('.data input[type="text"]');

        //Отключаем кнопки
        incomePlusBtn.disabled = val;
        expensesPlusBtn.disabled = val;
    
        //Отключаем поля слева
        leftInputs.forEach(item => item.disabled = val);
    
        //Меняем кнопки старт/ресет
        val ? startBtn.style.display = 'none' : startBtn.style.display = 'block';
        val ? resetBtn.style.display = 'block' : resetBtn.style.display = 'none';
    }

    start() {
        this.money = +salaryInput.value;
    
        this.getExpInc('expenses');
        this.getExpInc('income');


        this.getAddExpInc('expenses', additioanlexpensesInput.value.split(','));
        this.getAddExpInc('income', Array.from(additionalIncomeItems).map(item => item.value));

        this.getInfoDeposit();
    
        this.getBudget();
    
        this.showResult();
    
        this.disableInputs(true);
    }

    reset() {
        const allInputs = document.querySelectorAll('input[type="text"]');
        const periodTitle = document.querySelector('div .period-amount');

        //Удаляем слушателей
        this._removeEventListenrs();
    
        //Зануляем свойства объекта
        for (let key in this) {
            switch (typeof this[key]) {
                case 'number':
                    this[key] = 0;
                    break;
                case 'boolean':
                    this[key] = false;
                    break;
                case 'object': 
                    Array.isArray(this[key]) ? this[key] = [] : this[key] = {};
                    break;
            }
        }
    
        //Откатываем UI 
        expensesPlusBtn.style.display = 'block';
        incomePlusBtn.style.display = 'block';

        depositCheck.checked = false;
        depositBan.style.display = 'none';
        depositAmount.style.display = 'none';
        depositPercent.style.display = 'none';

        periodTitle.textContent = '1';
        periodSelect.value = 1;


        for (let i = expensesItems.length - 1; i > 0; i--) {
            expensesItems[i].remove();
        }
    
        for (let i = incomeItems.length - 1; i > 0; i--) {
            incomeItems[i].remove();
        }        
    
        allInputs.forEach(item => item.value = '');
    
        //Анлокаем поля
        this.disableInputs(false);
    
        //Добавляем слушателей
        this._addEventListeners();
    }

    showResult() {
        budgetMonthValue.value = this.budgetMonth;
        budgetDayValue.value = this.budgetDay;
        expensesMonthValue.value = this.expensesMonth;
        additionalExpensesValue.value = this.addExpenses.join(', ');
        additionalIncomeValue.value = this.addIncome.join(', ');
    
        targetMonthValue.value = this.getTargetMonth();
        totalIncomePeriodValue.value = this.calcPeriod();
    }

    addBlock(e) {
        const blockName = e.target.classList[1].slice(0,-4);
        const clonedItem = blockName === 'expenses' ? expensesItems[0].cloneNode(true) : incomeItems[0].cloneNode(true);
        const title = clonedItem.querySelector(`.${blockName}-title`);
        const amount = clonedItem.querySelector(`.${blockName}-amount`);

        title.value = '';
        amount.value = '';
    
        amount.addEventListener('input', (e) => {
            const match = e.target.value.match(/[0-9]+/);
            match ? e.target.value = match[0] : e.target.value = '';
        });
    
        blockName === 'expenses' ? expensesItems[0].parentNode.insertBefore(clonedItem, expensesPlusBtn) 
            : incomeItems[0].parentNode.insertBefore(clonedItem, incomePlusBtn);

        if(clonedItem.parentNode.childElementCount === 5) {
            blockName === 'expenses' ? expensesPlusBtn.style.display = 'none' : incomePlusBtn.style.display = 'none';
        }
        
    }

    getExpInc(itemName) {
        const items = itemName === 'expenses' ? expensesItems : incomeItems;
        
        for(let item of items) {
            const name = item.querySelector(`.${itemName}-title`).value;
            const amount = item.querySelector(`.${itemName}-amount`).value;
    
            if(name.trim()) {
                itemName === 'expenses' ? this.expenses[name] = +amount : this.income[name] = +amount;
            }
        }
        
    }

    getAddExpInc(itemName, itemList) {
        itemList.forEach(item => {
            if (item.trim()) {
                itemName === 'expenses' ? this.addExpenses.push(item.trim()) : this.addIncome.push(item.split());
            }
        });
    }

    getBudget() {
        const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
    
        
        for (let key in this.expenses) {
            this.expensesMonth += this.expenses[key];
        }
    
        for (let key in this.income) {
            this.money += this.income[key];
        }
        
        this.budgetMonth = this.money - this.expensesMonth + monthDeposit;
        this.budgetDay = Math.ceil(this.budgetMonth / 30);
    }

    getTargetMonth() {
        this.mission = targetAmount.value;
        return Math.ceil(this.mission / this.budgetMonth);
    }

    calcPeriod() {
        return this.budgetMonth * +periodSelect.value;
    }

    getInfoDeposit() {
        if (this.deposit) {
            this.percentDeposit = depositPercent.value;
            this.moneyDeposit = depositAmount.value;
        }
    }

    depositHandler() {
        const showDepositField = (display) => {
            depositBan.style.display = display;
            depositAmount.style.display = display;

            depositAmount.value = '';
            depositBan.value = '';
        };

        if (depositCheck.checked) {
            showDepositField('inline-block');
            this.deposit = true;
            depositBan.addEventListener('change',this.depositChangePercent);
            depositPercent.addEventListener('input', this.percentCheck);
        } 
        else {
            depositPercent.style.display = 'none';

            showDepositField('none'); 
            this.deposit = false;
            depositBan.removeEventListener('change',this.depositChangePercent);
            depositPercent.removeEventListener('input', this.percentCheck);
        }
    }

    init() {
        this._startHandler = this.start.bind(this);
        this._resetHandler = this.reset.bind(this);
        this._periodSelectHandler = this.periodTitleChange.bind(this);
        this._depositCheckHandler = this.depositHandler.bind(this);

        this._addEventListeners();
    }

    _addEventListeners() {
        startBtn.disabled = 'true';
    
        startBtn.addEventListener('click', this._startHandler);
        resetBtn.addEventListener('click', this._resetHandler);

        periodSelect.addEventListener('input', this._periodSelectHandler);
        depositCheck.addEventListener('click', this._depositCheckHandler);

        expensesPlusBtn.addEventListener('click', this.addBlock);
        incomePlusBtn.addEventListener('click', this.addBlock);
        
        salaryInput.addEventListener('input', this.checkMoney);        
    
        allSumsPh.forEach( item => {
            item.addEventListener('input', this.checkNumb);
        });
    }

    _removeEventListenrs() {
        startBtn.disabled = 'false';

        startBtn.removeEventListener('click', this._startHandler);
        resetBtn.removeEventListener('click', this._resetHandler);

        periodSelect.removeEventListener('input', this._periodSelectHandler);
        periodSelect.removeEventListener('input', this._periodSelectHandler);

        depositBan.removeEventListener('change',this.depositChangePercent);
        depositPercent.removeEventListener('input', this.percentCheck);
       
        expensesPlusBtn.removeEventListener('click', this.addBlock);
        incomePlusBtn.removeEventListener('click', this.addBlock);
        
        salaryInput.removeEventListener('input', this.checkMoney);

    
        allSumsPh.forEach( item => {
            item.removeEventListener('input', this.checkNumb);
        });
    }

}

const appData = new AppData();
appData.init();