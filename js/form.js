import { sendData, getData } from './api.js';
import { showCreationErrorInfo, showCreationSuccessInfo } from './util.js';
import { setStartPoint, renderPoints } from './map.js';

const typeSelect = document.querySelector('#type');
const priceInput = document.querySelector('#price');
const guestSelect = document.querySelector('#capacity');
const roomsSelect = document.querySelector('#room_number');
const housingTypeFilter = document.querySelector('#housing-type');
const housingRoomsFilter = document.querySelector('#housing-rooms');
const housingPriceFilter = document.querySelector('#housing-price');
const housingGuestsFilter = document.querySelector('#housing-guests');
const housingFeaturesFilter = document.querySelector('#housing-features')

const HOUSE_PRICE_MAP = {
  bungalow: 0,
  flat: 1000,
  house: 5000,
  palace: 10000,
};

typeSelect.addEventListener('change', (evt) => {
  const houseType = evt.target.value;
  const minPrice = HOUSE_PRICE_MAP[houseType];
  priceInput.placeholder = minPrice;
  priceInput.setCustomValidity('');
});

const timeInSelect = document.querySelector('#timein');
const timeOutSelect = document.querySelector('#timeout');

const onTimeInputHandler = (evt) => {
  const time = evt.target.value;
  timeOutSelect.value = time;
}

timeInSelect.addEventListener('change', onTimeInputHandler);

const onPriceInputHandler = (evt) => {
  const price = evt.target.value;
  const minPrice = HOUSE_PRICE_MAP[typeSelect.value];

  if (price < minPrice) {
    priceInput.setCustomValidity(`Минимальная цена - ${minPrice}`);
  } else {
    priceInput.setCustomValidity('');
  }
  priceInput.reportValidity();
}

priceInput.addEventListener('change', onPriceInputHandler);

const validateGuests = () => {
  const value = Number(roomsSelect.value);
  if (value === '1' && guestSelect.value !== '1') {
    guestSelect.setCustomValidity('Рекомендуемое значение - «для 1 гостя»');
  } else if (value === '2' && (guestSelect.value !== '1' && guestSelect.value !== '2')) {
    guestSelect.setCustomValidity('Рекомендуемое значение - «для 2 гостей» или «для 1 гостя»');
  } else if (value === '3' && (guestSelect.value !== '1' && guestSelect.value !== '2' && guestSelect.value !== '3')) {
    guestSelect.setCustomValidity('Рекомендуемое значение - «для 3 гостей», «для 2 гостей» или «для 1 гостя»');
  } else if (value === '100' && guestSelect.value !== '0') {
    guestSelect.setCustomValidity('Рекомендуемое значение - «не для гостей»');
  } else {
    guestSelect.setCustomValidity('');
  }

  guestSelect.reportValidity();
}

roomsSelect.addEventListener('change', () => {
  guestSelect.setCustomValidity('');
});

guestSelect.addEventListener('change', () => {
  guestSelect.setCustomValidity('');
});

const advertForm = document.forms['ad-form'];

document.querySelector('.ad-form__submit').addEventListener('click', () => {
  validateGuests();
});

document.querySelector('.ad-form__reset').addEventListener('click', () => {
  clearForm();
});

const setUserFormSubmit = (onSuccess) => {
  advertForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const adressInput = document.querySelector('#address');
    adressInput.disabled = false;

    sendData(
      () => onSuccess(),
      () => showCreationErrorInfo(),
      new FormData(evt.target),
    );
  });
};

const filterForm = document.forms['filters'];

const clearForm = () => {
  advertForm.reset();
  filterForm.reset();
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

const setHousingTypeFilterClick = (cb) => {
  housingTypeFilter.addEventListener('change', () => {
    cb();
  });
};

const setHousingRoomsFilterClick = (cb) => {
  housingRoomsFilter.addEventListener('change', () => {
    cb();
  });
};

const setHousingPriceFilterClick = (cb) => {
  housingPriceFilter.addEventListener('change', () => {
    cb();
  });
}

const setHousingGuestsFilterClick = (cb) => {
  housingGuestsFilter.addEventListener('change', () => {
    cb();
  });
};

const setHousingFeaturesFilterClick = (cb) => {
  housingFeaturesFilter.addEventListener('change', () => {
    cb();
  });
};

export {
  setUserFormSubmit,
  onSuccess,
  setHousingTypeFilterClick,
  setHousingRoomsFilterClick,
  setHousingPriceFilterClick,
  setHousingGuestsFilterClick,
  setHousingFeaturesFilterClick
};
