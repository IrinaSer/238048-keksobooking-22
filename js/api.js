import { setFilterFormDisabled } from './states.js';

const DATA_URL = 'https://22.javascript.pages.academy/keksobooking/data';

const getData = (onSuccess) => {
  fetch(DATA_URL)
    .then((response) => response.json())
    .then((data) => {
      onSuccess(data);
    })
    .catch((err) => {
      const error = document.createElement('div');
      error.textContent = 'Не удалось загрузить объявления 😥';
      error.setAttribute('style', 'position: fixed; top: 20px; right: 20px; background: rgb(255 4 4 / 50%); padding: 16px; color: white; z-index: 1000; ');
      document.querySelector('main').appendChild(error);
      setFilterFormDisabled();
    });
};

// const sendData = (onSuccess, onFail, body) => {};

export {getData};
