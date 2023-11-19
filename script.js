'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2023-11-17T23:36:17.929Z',
    '2023-11-18T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account3 = {
  owner: 'Abbas Gure',
  movements: [5120, 34100, -1150, -7290, -3210, -13000, 85200, -30],
  interestRate: 0.1,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2023-11-17T23:36:17.929Z',
    '2023-11-18T10:51:36.790Z',
  ],
  currency: 'SAR',
  locale: 'ar-eg',
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDates = (date, locale) => {
  //method to calculate number of days passed in whole number
  const calcDaysPassed = (day1, day2) =>
    //1000ms in one second, 60 sec in one min, 60 min in one hr, 24 hr in a day
    Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));

  //pass day 2 and day 1 dates into method and assign to value
  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7 && daysPassed > 1) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, '0'); //Padstart used when day number is less than 10, pad number with 0 at the front
    // const month = `${date.getMonth() + 1}`.padStart(2, '0'); //same thing here
    // const year = date.getFullYear();

    // return `${day}/${month}/${year}`;

    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const currDate = new Date(acc.movementsDates[i]);

    //format we want Day/Month/Year

    const displayDate = formatMovementDates(currDate, acc.locale);

    const formattedMovements = formatCurrency(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMovements}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const formatCurrency = (val, locale, curr) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: curr,
  }).format(val);
};
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);
  // labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
//Setting up Logout Timer
const startLogoutTimer = () => {
  const tiktok = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const secs = String(time % 60).padStart(2, 0);
    //with each callback call print the remaining time in the UI
    labelTimer.textContent = `${min}:${secs}`;

    //when time reaches 0
    if (time === 0) {
      //when we reach 0 seconds, stop timer and log out user
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    //decrease time
    time--;
  };
  //Set time to 5 mins
  let time = 600;
  tiktok();
  //Call timer every second (1000ms)
  const timer = setInterval(tiktok, 1000);

  return timer;
  
};

///////////////////////////////////////
// Event handlers , timer is set to global variable so when people log into another account it can be reset
let currentAccount, timer;

//Lets fake being logged in for now so we can edit easier
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;


const ResetTimer = () => {
  
}
//////////////////////////////////////
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //getting date and time using experimental API
    const now = new Date();

    //gonna externally set locale and options variables that are required in the intl.datetimeformat();
    const options = {
      year: 'numeric',
      day: 'numeric',
      month: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };

    //originally was using navigator.langauge for locale value but switched to current accounts locale value
    const locale = currentAccount.locale;

    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      now
    );

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer ) clearInterval(timer); timer = startLogoutTimer(); 
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add Transfer Date to date transfer array
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    //reset timer
  clearInterval(timer); timer = startLogoutTimer(); 
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    //Add loan Date to date transfer array
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';

  //reset timer
  clearInterval(timer); timer = startLogoutTimer(); 
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';

  //reset timer
  clearInterval(timer); timer = startLogoutTimer(); 
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURE NOTES

// console.log(23 === 23.0);

/* ways to convert string to number */
//conversion using Number()
// console.log(Number(23));
//conversion using + before number even if string will make it into number since '+' has built in converter
// console.log(+'23');

//parsing - via Number.parseInt() which will parse and present the number value
//e.g. in example below it returns 23.
// console.log(Number.parseInt('23sdads'));

//you also are recommended to include the radix, basically to point out if using base - '10' or binart base '2'.
// console.log(Number.parseInt('23sdads',10));

//keep in mind parseInt/parseFloat are global methods and can be called without Number()
//We also know how to do maths.random() *(max number) + 1
/* Math rounding methods that exist:
  .round()
  .ceil()
  .floor()
  .trunc()
  

  another method to round a number is toFixed() however it will return number as a string unless you add '+' sign
    */

/** The reason toFixed and these methods work such way with numbers is because number that is primitive
 *
 * primitives dont have methods so js has to do boxing (transform primitive to number object and do operations on it, once finished it returns it to primitive)
 */

//quirky stuff you can do with underscore
// const burgercostincents = 25_99;
// this will still console.log() as 2599 despite me having put the _ it is not read in it

/** Date
 *
 * methods that exist:
 * getfullyear()
 * getmonth()
 * getdate()
 * getday()[this returns the day of the week e.g. thursday is day 4]
 * getHours()
 * getMinutes()
 * getSeconds()
 * getTime() get the amount of time in milliseconds that has passed since january first 1970 (when this was probably created)
 *
 * Methods above all have set methods.
 * toISOString() - the iso string which is the international standard of dates in code
 * 
 * 




  How we originally created our labelDate
    //current date and time
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, '0'); //Padstart used when day number is less than 10, pad number with 0 at the front
    const month = `${now.getMonth() + 1}`.padStart(2, '0'); //same thing here
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, '0');
    const min = `${now.getMinutes()}`.padStart(2, '0');

    //format we want Day/Month/Year

    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
 */

//we will use this to create the currency
// const number = 123123.123123;
// const options = {
//   style: 'currency',
//   currency: 'SAR',
// };
// console.log('US: ', new Intl.NumberFormat('en-US', options).format(number));
// console.log('GB: ', new Intl.NumberFormat('en-GB', options).format(number));
// console.log('Saudi: ', new Intl.NumberFormat('ar-SY', options).format(number));
