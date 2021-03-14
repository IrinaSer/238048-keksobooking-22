const MAX_NUMBER = 100000; // Number.MAX_SAFE_INTEGER;
const ALERT_SHOW_TIME = 5000;

function checkValues(a, b) {
  const errorText = {
    negative: 'Диапазон может быть только положительный!',
    incorrectRange: 'Значение «до» меньшее, чем значение «от»!',
    incorrectValues: 'Введите минимум 2 значения',
  };
  let error = '';

  if (typeof a !== 'number' || typeof b !== 'number') {
    error = errorText.incorrectValues;
  } else if (a < 0 || b < 0) {
    error = errorText.negative;
  } else if (a > b) {
    error = errorText.incorrectRange;
  }

  return error;
}

function getRandomInt(start, end) {
  const error = checkValues(start, end);
  if (error.length > 0) {
    throw new Error(error);
  }

  if (start === end) return start;
  let result = start + Math.random() * (end + 1 - start);
  return Math.floor(result);
}

function getRandomFloat(start, end, simbolsAfterComma) {
  let error = '';
  let result;

  if (!simbolsAfterComma) {
    error = 'Укажите количество знаков после запятой!';
  } else {
    error = checkValues(start, end);
  }
  if (error.length > 0) {
    throw new Error(error);
  }
  result = start + Math.random() * (end - start);
  if (start === end) result = start;
  return result.toFixed(simbolsAfterComma);
}

const getRandomArrayElement = (elements) => {
  return elements[getRandomInt(0, elements.length - 1)];
};

const createRandomArray = (elements, isUnique) => {
  let length = getRandomInt(1, elements.length - 1);
  const result = [];

  if (isUnique) {
    for (let i = 0; i < length; i++) {
      result.push(elements[i]);
    }
  } else {
    length = getRandomInt(1, 10);
    for (let i = 0; i < length; i++) {
      result.push(getRandomArrayElement(elements));
    }
  }
  return result;
};

const transformHouseType = (houseType) => {
  const houseTypeMap = {
    flat: 'Квартира',
    bungalow: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец',
  };

  return houseTypeMap[houseType];
}

const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.position = 'fixed';
  alertContainer.style.top = '20px';
  alertContainer.style.right = '20px';
  alertContainer.style.background = 'rgb(255 4 4 / 50%)';
  alertContainer.style.padding = '16px';
  alertContainer.style.color = 'white';
  alertContainer.style.zIndex = 1000;
  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
}

const removeChild = (parentNode, childNode) => {
  if (Array.isArray(childNode)) {
    const closingComment = childNode[1];
    childNode = childNode[0];
    parentNode.removeChild(closingComment);
  }
  parentNode.removeChild(childNode);
}

const buildMessage = (template, selector) => {
  const main = document.querySelector('main');
  main.appendChild(template);

  const hideMessage = () => {
    removeChild(main, document.querySelector(selector));
    document.removeEventListener('click', hideMessage);
    document.removeEventListener('keydown', removeByEsc);
  }

  const removeByEsc = (evt) => {
    if (evt.key === ('Escape' || 'Esc')) {
      hideMessage();
    }
  }
  const hideErrorButton = document.querySelector('.error__button');
  if (hideErrorButton) {
    hideErrorButton.addEventListener('click', hideMessage);
  }
  document.addEventListener('click', hideMessage);
  document.addEventListener('keydown', removeByEsc);
}

const showCreationSuccessInfo = () => {
  const successTemplate = document.querySelector('#success').content.cloneNode(true);
  buildMessage(successTemplate, '.success');
}

const showCreationErrorInfo = () => {
  const errorTemplate = document.querySelector('#error').content.cloneNode(true);
  buildMessage(errorTemplate, '.error');
}

export {
  MAX_NUMBER,
  getRandomFloat,
  getRandomInt,
  getRandomArrayElement,
  createRandomArray,
  transformHouseType,
  showAlert,
  showCreationErrorInfo,
  showCreationSuccessInfo
};
