import { sendData, getData } from './api.js';
import { showCreationErrorInfo, showCreationSuccessInfo } from './util.js';
import { setStartPoint, renderPoints } from './map.js';
import { resetFilePreview } from './image.js';
import { advertForm, filterForm, addressInput } from './elements.js';

const HOUSE_PRICE_MAP = {
  bungalow: 0,
  flat: 1000,
  house: 5000,
  palace: 10000,
};

const typeSelect = document.querySelector('#type');
const priceInput = document.querySelector('#price');
const guestSelect = document.querySelector('#capacity');
const roomsSelect = document.querySelector('#room_number');
const housingTypeFilter = document.querySelector('#housing-type');
const housingRoomsFilter = document.querySelector('#housing-rooms');
const housingPriceFilter = document.querySelector('#housing-price');
const housingGuestsFilter = document.querySelector('#housing-guests');
const housingFeaturesFilter = document.querySelector('#housing-features');
const timeInSelect = document.querySelector('#timein');
const timeOutSelect = document.querySelector('#timeout');
const clearFormButton = document.querySelector('.ad-form__reset');

const onTypeInputHandler = (evt) => {
  const houseType = evt.target.value;
  priceInput.placeholder = HOUSE_PRICE_MAP[houseType];
  priceInput.setCustomValidity('');
};

const onTimeInputHandler = (type) => {
  return (evt) => {
    if (type === 'timeIn') {
      timeOutSelect.value = evt.target.value;
    } else {
      timeInSelect.value = evt.target.value;
    }
  }
};

const onPriceInputHandler = (evt) => {
  const price = evt.target.value;
  validatePrice(price);
};

const validatePrice = (price) => {
  const minPrice = HOUSE_PRICE_MAP[typeSelect.value];

  if (price < minPrice) {
    priceInput.setCustomValidity(`Минимальная цена - ${minPrice}`);
  } else {
    priceInput.setCustomValidity('');
  }
  priceInput.reportValidity();
};

const validateGuests = () => {
  const messages = [
    'Рекомендуемое значение - «для 1 гостя»',
    'Рекомендуемое значение - «для 2 гостей» или «для 1 гостя»',
    'Рекомендуемое значение - «для 3 гостей», «для 2 гостей» или «для 1 гостя»',
  ];
  const notForGuests = 100;
  const roomValue = Number(roomsSelect.value);
  const guestValue = Number(guestSelect.value) === 0 ? notForGuests : Number(guestSelect.value);

  if (roomValue < guestValue) {
    guestSelect.setCustomValidity(messages[roomValue - 1]);
  } else if ((roomValue === notForGuests && guestValue !== notForGuests)) {
    guestSelect.setCustomValidity('Рекомендуемое значение - «не для гостей»');
  } else {
    guestSelect.setCustomValidity('');
  }
  guestSelect.reportValidity();
};

const onUserFormSubmit = (onSuccess) => {
  return (evt) => {
    evt.preventDefault();
    validateGuests();
    const price = priceInput.value;
    validatePrice(price);
    if (!advertForm.checkValidity()) return;
    // если оставить поле disabled, то значение поля #address не отправится
    addressInput.disabled = false;

    sendData(
      () => onSuccess(),
      () => showCreationErrorInfo(),
      new FormData(evt.target),
    );
  };
};

const setUserFormSubmit = (onSuccess) => {
  advertForm.addEventListener('submit', onUserFormSubmit(onSuccess));
};

const clearForm = () => {
  const renderTimeout = 10;
  advertForm.reset();
  filterForm.reset();
  resetFilePreview();
  setTimeout(() => {
    getData((offers) => {
      renderPoints(offers);
    });
    setStartPoint(true);
  }, renderTimeout);
};

const onSuccess = () => {
  clearForm();
  showCreationSuccessInfo();
};

const filterControls = [
  housingTypeFilter,
  housingRoomsFilter,
  housingPriceFilter,
  housingGuestsFilter,
  housingFeaturesFilter,
];

const setOnChangeFilterRender = (onFilterChangeHandler) => {
  filterControls.forEach(control => {
    control.addEventListener('change', onFilterChangeHandler);
  });
};

typeSelect.addEventListener('change', onTypeInputHandler);

timeInSelect.addEventListener('change', onTimeInputHandler('timeIn'));

timeOutSelect.addEventListener('change', onTimeInputHandler('timeOut'));

priceInput.addEventListener('change', onPriceInputHandler);

roomsSelect.addEventListener('change', validateGuests);

guestSelect.addEventListener('change', validateGuests);

clearFormButton.addEventListener('click', clearForm);

export {
  setUserFormSubmit,
  onSuccess,
  setOnChangeFilterRender
};
