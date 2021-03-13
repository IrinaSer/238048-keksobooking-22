import { transformHouseType } from './util.js';

const createCustomPopup = (data) => {
  const { author, offer } = data;
  const similarOfferTemplate = document.querySelector('#card').content.querySelector('.popup');
  const offerElement = similarOfferTemplate.cloneNode(true);

  offerElement.querySelector('.popup__title').textContent = offer.title;
  offerElement.querySelector('.popup__text--address').textContent = offer.address;
  offerElement.querySelector('.popup__text--price').textContent = `${offer.price} ₽/ночь`;
  offerElement.querySelector('.popup__type').textContent = transformHouseType(offer.type);
  if (offer.rooms && offer.guests) {
    offerElement.querySelector('.popup__text--capacity').textContent = `${offer.rooms} комнаты для ${offer.guests} гостей`;
  }
  offerElement.querySelector('.popup__text--time').textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`;
  const list = offerElement.querySelector('.popup__features');
  list.innerHTML = '';
  if (offer.features.length) {
    offer.features.forEach(feature => {
      const createdFeature = document.createElement('li');
      createdFeature.classList.add('popup__feature');
      createdFeature.classList.add(`popup__feature--${feature}`);
      list.appendChild(createdFeature);
    });
  } else {
    list.classList.add('hidden');
  }
  if (offer.description.length) {
    offerElement.querySelector('.popup__description').textContent = offer.description;
  } else {
    offerElement.querySelector('.popup__description').classList.add('hidden');
  }
  offerElement.querySelector('.popup__avatar').src = author.avatar;

  const offerPhoto = offerElement.querySelector('.popup__photos').children[0];
  offerElement.querySelector('.popup__photos').removeChild(offerPhoto);
  if (offer.photos.length) {
    offer.photos.forEach(img => {
      const photo = offerPhoto.cloneNode();
      photo.src = img;
      offerElement.querySelector('.popup__photos').appendChild(photo);
    });
  } else {
    offerElement.querySelector('.popup__photos').classList.add('hidden');
  }

  return offerElement;
}

export { createCustomPopup };
