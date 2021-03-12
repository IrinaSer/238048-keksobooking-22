/* global L:readonly */
/* global _:readonly */
import { setFormsEnabled } from './states.js';
import { createCustomPopup } from './popup.js';
import { getData } from './api.js';
import { setHousingTypeFilterClick, setHousingRoomsFilterClick, setHousingPriceFilterClick, setHousingGuestsFilterClick, setHousingFeaturesFilterClick } from './form.js';

const START_ADDRESS = {
  x: 35.681700,
  y: 139.753882,
};

const POINTS_COUNT = 10;
const RERENDER_DELAY = 1000;

const adressInput = document.querySelector('#address');

const map = L.map('map-canvas')
  .on('load', () => {
    setFormsEnabled();
  })
  .setView({
    lat: START_ADDRESS.x,
    lng: START_ADDRESS.y,
  }, 10);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

let markers;
markers = new L.LayerGroup().addTo(map);

const mainPinIcon = L.icon({
  iconUrl: '../img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const mainMarker = L.marker({
  lat: START_ADDRESS.x,
  lng: START_ADDRESS.y,
}, {
  draggable: true,
  icon: mainPinIcon,
});

mainMarker.addTo(map);

mainMarker.on('moveend', (evt) => {
  const adress = evt.target.getLatLng();
  const x = adress.lat.toFixed(5);
  const y = adress.lng.toFixed(5);

  adressInput.value = `${x}, ${y}`;
});

const pinIcon = L.icon({
  iconUrl: '../img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const getOfferdRank = (offer, filters) => {
  let rank = 0;
  for (let key in filters) {
    if (key === 'price') {
      if (filters[key] === 'low' && (offer.offer[key] < 10000)) {
        rank += 1;
      } else if (filters[key] === 'middle' && (offer.offer[key] >= 10000 && offer.offer[key] < 50000)) {
        rank += 1;
      } else if (filters[key] === 'high' && (offer.offer[key] >= 50000)) {
        rank += 1;
      }
    } else if (key === 'features') {
      filters[key].forEach(feature => {
        if (offer.offer[key].includes(feature)) {
          rank += 1;
        }
      });
    } else {
      if (offer.offer[key] === filters[key]) {
        rank += 1;
      }
    }
  }

  return rank;
}

const filterOffers = (item) => {
  const filters = {};
  const filterValues = [];
  const formData = new FormData(document.forms['filters']);
  for (let [key, value] of formData.entries()) {
    const formattedKey = key.replace('housing-', '');
    if (formattedKey === 'features') {
      if (!Array.isArray(filters[formattedKey])) {
        filters[formattedKey] = [];
      }
      filters[formattedKey].push(value);
    } else {
      let formattedValue = ((formattedKey === 'rooms' || formattedKey === 'guests') && value !== 'any') ? +value : value;
      filters[formattedKey] = formattedValue;
    }

    filterValues.push(value !== 'any')
  }
  const rank = getOfferdRank(item, filters);
  return filterValues.filter(item => item).length === rank;
}

const renderPoints = (offers) => {
  markers.clearLayers();

  offers
    .slice()
    .filter(filterOffers)
    .slice(0, POINTS_COUNT)
    .forEach((offer) => {
      const mainMarker = L.marker({
        lat: offer.location.lat,
        lng: offer.location.lng,
      }, {
        icon: pinIcon,
      });

      mainMarker
        .addTo(markers)
        .bindPopup(
          createCustomPopup(offer), {
            keepInView: true,
          },
        );
    });
}

const setStartPoint = (isReset) => {
  adressInput.disabled = true;
  adressInput.value = `${START_ADDRESS.x}, ${START_ADDRESS.y}`;

  if (isReset) {
    const latlng = L.latLng(START_ADDRESS.x, START_ADDRESS.y);
    mainMarker.setLatLng(latlng);
  }
}

getData((offers) => {
  renderPoints(offers);
  setHousingTypeFilterClick(_.debounce(() => renderPoints(offers), RERENDER_DELAY));
  setHousingRoomsFilterClick(_.debounce(() => renderPoints(offers), RERENDER_DELAY));
  setHousingPriceFilterClick(_.debounce(() => renderPoints(offers), RERENDER_DELAY));
  setHousingGuestsFilterClick(_.debounce(() => renderPoints(offers), RERENDER_DELAY));
  setHousingFeaturesFilterClick(_.debounce(() => renderPoints(offers), RERENDER_DELAY));
});

setStartPoint();

export {
  setStartPoint
};
