let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

document.customForm.reset();

const timer = (seconds) => {
  // clear any existing timers
  clearInterval(countdown);

  // Method 1: using setInterval() however that's shown to be unreliable
  // with certain browser when scrolling as the timer will pause for a
  // moment and therefore the timer is no longer accurate.
  // setInterval(function() {
  //   console.log(seconds--);
  // }, 1000);

  // Method 2:
  //#1. get when timer starts
  const now = Date.now(); // in milliseconds
  //#2. get time timer will run for
  const then = now + (seconds * 1000); // convert seconds to milliseconds

  // Display time once immediately passing initial 'seconds' argument
  displayTimeLeft(seconds);

  displayEndTime(then);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    // stop/clear countdown once time left reaches 0
    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }

    // Display time again every second within setInterval() passing 'timesLeft' argument
    displayTimeLeft(secondsLeft);
  }, 1000);
};

const displayTimeLeft = (seconds) => {
  let hours = 0;
  let minutes;
  let remainderSeconds;
  if (seconds > 3600) {
    hours = Math.floor(seconds / 3600);
    remainderSeconds = seconds % 3600;
    minutes = Math.floor(remainderSeconds / 60);
    remainderSeconds = remainderSeconds % 60;
  } else {
    minutes = Math.floor(seconds / 60);
    remainderSeconds = seconds % 60;
  }

  const display = `${hours > 0 ? (hours + ':') : ''}${(hours > 0) && (minutes < 10) ? ('0' + minutes) : minutes}:${remainderSeconds < 10 ? ('0' + remainderSeconds) : remainderSeconds}`;
  timerDisplay.textContent = display; // update the DOM
  document.title = `Time left: ${display}`; // update the browser tab
  //console.log({hours, minutes, remainderSeconds});
};

const displayEndTime = (timestamp) => {
  const end = new Date(timestamp);
  const hour = end.getHours() > 12 ? end.getHours() - 12 : end.getHours(); // convert 24h to 12h
  const mins = end.getMinutes();
  //console.log(end, end.getHours());

  endTime.textContent = `Be back by: ${hour}:${mins < 10 ? ('0' + mins) : mins} ${(end.getHours() > 12) || (end.getHours() === 12 && end.getMinutes() > 0) ? 'PM' : 'AM'}`;
};

function startTimer() {
  const seconds = parseInt(this.dataset.time);

  timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));

document.customForm.addEventListener('submit', function(e) {
  e.preventDefault();

  if (isNaN(this.minutes.value)) {
    this.reset();
    return;
  }

  timer(this.minutes.value * 60);
});