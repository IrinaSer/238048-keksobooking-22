import { setFilterFormDisabled } from './states.js';
import { showAlert } from './util.js';

const MAIN_BOOKING_URL = 'https://22.javascript.pages.academy/keksobooking';
const DATA_URL = `${MAIN_BOOKING_URL}/data`;
const HTTP_METHOD = {
  post: 'POST',
};

const getData = (onSuccess) => {
  const getDataErrorMessage = 'Не удалось загрузить объявления 😥';

  fetch(DATA_URL)
    .then((response) => response.json())
    .then((data) => {
      onSuccess(data);
    })
    .catch(() => {
      showAlert(getDataErrorMessage);
      setFilterFormDisabled();
    });
};

const sendData = (onSuccess, onFail, body) => {
  const sendDataErrorMessage = 'Не удалось отправить форму. Попробуйте ещё раз';

  fetch(
    MAIN_BOOKING_URL,
    {
      method: HTTP_METHOD.post,
      body,
    },
  )
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onFail(sendDataErrorMessage);
      }
    })
    .catch(() => {
      onFail(sendDataErrorMessage);
    });
};

export { getData, sendData };
