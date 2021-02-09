import getCities from "./utils/utils.js";


const selectEl = document.querySelector('#city-select');
const passwordEl = document.querySelector('#password');
const repeatPasswordEl = document.querySelector('#password-repeat');
const emailEl = document.querySelector('#email');
const acceptMailing = document.querySelector('#accept-mailing');

const popup = document.querySelector('.popup');
const popupInput = document.querySelector('.popup__input');
const changeStatusBtn = document.querySelector('.welcome__change-status');
const status = document.querySelector('.welcome__status');
const popupForm = document.querySelector('.popup__form');
const mainForm = document.querySelector('.form');
const userName = document.querySelector('.welcome__message_highlight');
const submitBlock = document.querySelector('.form__submit-block');
const lastUpdeted = submitBlock.querySelector('.form__advice');

const templateError = document.querySelector('.template-error');

const months = [
  'Января',
  'Февраля',
  'Марта',
  'Апреля',
  'Мая',
  'Июня',
  'Июля',
  'Августа',
  'Сентября',
  'Ноября',
  'Декабря'
];

const init = () =>{
  console.log(userName);
  getCities('scripts/data/cities.json').then(cities=> {
    const sortedCities = sortElements(cities);
    sortedCities.forEach(element=> {
      const html = createCityEl(element.city);
      insertCityEl(html);
    })
  });

  passwordEl.addEventListener('focusout', function(){
    const error = wrongPassword(this);
    handleError(error, this);
  })

  repeatPasswordEl.addEventListener('focusout', function(){
    const error = wrongRepeatPassword(this, passwordEl);
    handleError(error, this);
  })

  emailEl.addEventListener('focusout', function(){
    const error = wrongEmail(this);
    handleError(error, this);
  })

  changeStatusBtn.addEventListener('click', function(){
    openPopup();
  })

  popupForm.addEventListener('submit', function(e){
    e.preventDefault();
    status.textContent = popupInput.value;
    closePopup();
  })

  mainForm.addEventListener('submit', function(e){
    e.preventDefault();
    if(validateAll())
    {
      updateTime();
      console.log(createJson());
    }
  })
}

const createJson = () => {
  const obj = {
    "username":userName.textContent.trim(),
    "password":passwordEl.value,
    "status":status.textContent.trim(),
    "email":emailEl.value,
    "city":selectEl.value,
    "accept-mailing":acceptMailing.value,
    "update-time":getTime(),
  }
  const json = JSON.stringify(obj);
  return json;
}

const getTime = () => {
  const now = new Date();
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  return `${day} ${month} ${year} ${time}`
}

const updateTime = () =>{
  const time = getTime();
  lastUpdeted.textContent = `последние изменения ${time}`
}

const validateAll = () => {
  let status = true;
  validateQuery.forEach(obj=>{
    const error = obj.checker(...obj.el);
    handleError(error, obj.el[0]);
    if(error)
    {
      status = false;
    };
  })
  return status;
}


const closePopup = () => {
  popup.classList.remove('popup_show');
}

const openPopup = () => {
  popup.classList.add('popup_show');
  popupInput.value = status.textContent.trim();
}

const handleError = (error, element) => {
  if (error) {
    resetEl(element);
    setErrorMsg(element, error)
  }
  else {
    resetEl(element);
  }
}

const createErrorMsg = (error) => {
  const newErrorEl = templateError.content.cloneNode(true);
  const errorTextEl = newErrorEl.querySelector('.form__error-message');
  errorTextEl.textContent = error;
  return newErrorEl;
}

const setErrorMsg = (element, error) => {
  element.classList.add('form__input-text_wrong');
  const errorEl = createErrorMsg(error);
  insertErrorEl(errorEl,element);
}

const resetEl = (element) => {
  if(element.classList.contains('form__input-text_wrong')) {
    element.classList.remove('form__input-text_wrong');
    removeError(element);
  }
  return;
}

const removeError = (element) => {
  const container = element.closest('.form__input-container');
  container.querySelector('.form__error-message').remove();
}

const sortElements = (array) => {
  const bigCities = array.filter(city=>city.population>50000);
  const maxCity = bigCities.reduce((a, b)=>{
    const prev = parseInt(a.population);
    const cur = parseInt(b.population);
    return prev > cur ? a : b;
  })
  bigCities.sort((a, b)=>a.city>b.city);
  const maxIndex = bigCities.indexOf(maxCity);
  bigCities.splice(maxIndex,1);
  bigCities.unshift(maxCity);
  return bigCities;
}

const createCityEl = (city) => {
  const el =
  `<option>
    ${city}
  </option>`
  return el;
}

const insertErrorEl = (el, place) => {
  const container = place.closest('.form__input-container');
  container.append(el);
}

const insertCityEl = (el) => {
  selectEl.insertAdjacentHTML('beforeend',el);
}


const wrongPassword = (el) => {
  const pass = el.value;
  switch (true) {
    case (pass.length===0) :
      return 'Укажите пароль';
    case (pass.length<5) :
      return 'Используйте не менее 5 символов';
    default :
      return false;
  }
}

const wrongRepeatPassword = (el, fisrtPassEl) => {
  const secondPass = el.value
  const pass=fisrtPassEl.value;
  switch (true) {
    case (secondPass.length===0) :
      return 'Укажите пароль';
    case (secondPass!==pass) :
      return 'Пароли не совпадают';
    default :
      return false;
  }
}

const wrongEmail = (el) => {
  const email = el.value;
  const re = /\S+@\S+\.\S+/;
  switch(true) {
    case (email.length===0) :
      return 'Укажите E-mail';
    case (!re.test(email)) :
      return 'Неверный E-mail'
  }
}

const validateQuery = [
  {
    name: 'password',
    el: [passwordEl],
    checker: wrongPassword,
  },
  {
    name: 'password-repeat',
    el: [repeatPasswordEl, passwordEl],
    checker: wrongRepeatPassword,
  },
  {
    name: 'email',
    el: [emailEl],
    checker: wrongEmail,
  }
];


init();
