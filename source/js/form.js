import { sendData, getData } from './api.js';
import { showCreationErrorInfo, showCreationSuccessInfo } from './util.js';
import { setStartPoint, renderPoints } from './map.js';
import { resetFilePreview } from './image.js';

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
const advertForm = document.forms['ad-form'];
const filterForm = document.forms['filters'];
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
  const roomValue = Number(roomsSelect.value);
  const guestValue = Number(guestSelect.value) === 0 ? 100 : Number(guestSelect.value);

  if (roomValue < guestValue) {
    guestSelect.setCustomValidity(messages[roomValue - 1]);
  } else if ((roomValue === 100 && guestValue !== 100)) {
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
    if (!advertForm.checkValidity()) return;
    // если оставить поле disabled, то значение поля #address не отправится
    const addressInput = document.querySelector('#address');
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
  advertForm.reset();
  filterForm.reset();
  resetFilePreview();
  setTimeout(() => {
    getData((offers) => {
      renderPoints(offers);
    });
    setStartPoint(true);
  }, 10);
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

const setOnChangeFilterRender = (cb) => {
  filterControls.forEach(control => {
    control.addEventListener('change', () => {
      cb();
    });
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
