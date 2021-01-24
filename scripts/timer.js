'use strict';

class Timer {
    constructor(hoursElem, minutesElem, secondsElem) {
        this._hoursElem = hoursElem;
        this._minutesElem = minutesElem;
        this._secondElem = secondsElem;
    }
    _getRemainingTime(deadLine) {
        const dateNow = new Date().getTime();
        const dateStop = new Date(deadLine).getTime();
        const timeRemaining = (dateStop - dateNow) / 1000;
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining / 60) % 60);
        const seconds = Math.floor(timeRemaining % 60);
        return { hours, minutes, seconds };
    }
    _updateTimer(deadLine) {
        const intervalId = setInterval(() => {
            const remainingTime = this._getRemainingTime(deadLine);
            if (remainingTime.hours >= 0) {
                this._hoursElem.textContent = (remainingTime.hours / 10) < 1 ?
                    `0${remainingTime.hours}` : remainingTime.hours;
                this._minutesElem.textContent = (remainingTime.minutes / 10) < 1 ?
                    `0${remainingTime.minutes}` : remainingTime.minutes;
                this._secondElem.textContent = (remainingTime.seconds / 10) < 1 ?
                    `0${remainingTime.seconds}` : remainingTime.seconds;
            } else {
                this._hoursElem.textContent = '00';
                this._minutesElem.textContent = '00';
                this._secondElem.textContent = '00';
                clearInterval(intervalId);
            }
        }, 1000);
    }
    setTimerCountdown(deadLine) {
        this._updateTimer(deadLine);
    }
}

const timerHours = document.querySelector('#timer-hours');
const timerMinutes = document.querySelector('#timer-minutes');
const timerSeconds = document.querySelector('#timer-seconds');
const timer = new Timer(timerHours, timerMinutes, timerSeconds);

timer.setTimerCountdown('25 november 2020 10:00:00');
