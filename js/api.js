const DATA_URL = 'https://22.javascript.pages.academy/keksobooking/data';

const getData = (onSuccess) => {
  fetch(DATA_URL)
    .then((response) => response.json())
    .then((data) => {
      onSuccess(data);
    });
};

// const sendData = (onSuccess, onFail, body) => {};

export {getData};
