const typeSelect = document.querySelector('#type');
const priceInput = document.querySelector('#price');
const guestSelect = document.querySelector('#capacity');
const roomsSelect = document.querySelector('#room_number');
document.querySelector('#title').value = 'Милая, уютная квартирка в центре Токио'; //TODO
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

timeInSelect.addEventListener('change', (evt) => {
  const time = evt.target.value;
  timeOutSelect.value = time;
});

priceInput.addEventListener('change', (evt) => {
  const price = evt.target.value;
  const minPrice = HOUSE_PRICE_MAP[typeSelect.value];

  if (price < minPrice) {
    priceInput.setCustomValidity(`Минимальная цена - ${minPrice}`);
  } else {
    priceInput.setCustomValidity('');
  }
  priceInput.reportValidity();
});

const validateGuests = () => {
  const value = roomsSelect.value;
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

const orderForm = document.querySelector('.ad-form');

document.querySelector('.ad-form__submit').addEventListener('click', () => {
  validateGuests();
});

const setUserFormSubmit = () => {
  orderForm.addEventListener('submit', () => {
    const adressInput = document.querySelector('#address');
    adressInput.disabled = false;
  });
};

setUserFormSubmit();
