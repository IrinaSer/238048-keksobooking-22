import { setFilterFormDisabled } from './states.js';
import { showAlert } from './util.js';

const MAIN_BOOKING_URL = 'https://22.javascript.pages.academy/keksobooking';
const DATA_URL = `${MAIN_BOOKING_URL}/data`;

const getData = (onSuccess) => {
  fetch(DATA_URL)
    .then((response) => response.json())
    .then((data) => {
      onSuccess(data);
    })
    .catch(() => {
      showAlert('Не удалось загрузить объявления 😥');
      setFilterFormDisabled();
    });
};

const sendData = (onSuccess, onFail, body) => {
  fetch(
    MAIN_BOOKING_URL,
    {
      method: 'POST',
      body,
    },
  )
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onFail('Не удалось отправить форму. Попробуйте ещё раз');
      }
    })
    .catch(() => {
      onFail('Не удалось отправить форму. Попробуйте ещё раз');
    });
};

export { getData, sendData };
