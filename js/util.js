const ALERT_SHOW_TIME = 5000;

const transformHouseType = (houseType) => {
  const houseTypeMap = {
    flat: 'Квартира',
    bungalow: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец',
  };

  return houseTypeMap[houseType];
};

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
};

const removeChild = (parentNode, childNode) => {
  if (Array.isArray(childNode)) {
    const closingComment = childNode[1];
    childNode = childNode[0];
    parentNode.removeChild(closingComment);
  }
  parentNode.removeChild(childNode);
};

const buildMessage = (template, selector) => {
  const main = document.querySelector('main');
  main.appendChild(template);

  const hideMessage = () => {
    removeChild(main, document.querySelector(selector));
    document.removeEventListener('click', hideMessage);
    document.removeEventListener('keydown', removeByEsc);
  };

  const removeByEsc = (evt) => {
    if (evt.key === ('Escape' || 'Esc')) {
      hideMessage();
    }
  };

  const hideErrorButton = document.querySelector('.error__button');
  if (hideErrorButton) {
    hideErrorButton.addEventListener('click', hideMessage);
  }
  document.addEventListener('click', hideMessage);
  document.addEventListener('keydown', removeByEsc);
};

const showCreationSuccessInfo = () => {
  const successTemplate = document.querySelector('#success').content.cloneNode(true);
  buildMessage(successTemplate, '.success');
};

const showCreationErrorInfo = () => {
  const errorTemplate = document.querySelector('#error').content.cloneNode(true);
  buildMessage(errorTemplate, '.error');
};

export {
  transformHouseType,
  showAlert,
  showCreationErrorInfo,
  showCreationSuccessInfo
};
