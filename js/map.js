/* global L:readonly */
import {
  setFormsEnabled
} from './states.js';
import {
  createCustomPopup
} from './popup.js';
import {
  getData
} from './api.js';
import {
  setHousingTypeFilterClick
} from './form.js';

const START_ADDRESS = {
  x: 35.681700,
  y: 139.753882,
};

const POINTS_COUNT = 10;

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

const renderPoints = (offers, housingType) => {
  markers.clearLayers();

  offers
    .slice()
    .filter(item => {
      debugger
      if (housingType) {
        const value = document.querySelector(housingType).value;
        return item.offer.type === value;
      } else {
        return item;
      }
    })
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

getData((offers) => {
  renderPoints(offers);
  setHousingTypeFilterClick(() => renderPoints(offers, '#housing-type'));
});

const setStartPoint = (isReset) => {
  adressInput.disabled = true;
  adressInput.value = `${START_ADDRESS.x}, ${START_ADDRESS.y}`;

  if (isReset) {
    const latlng = L.latLng(START_ADDRESS.x, START_ADDRESS.y);
    mainMarker.setLatLng(latlng);
  }
}

setStartPoint();

export {
  setStartPoint
};
