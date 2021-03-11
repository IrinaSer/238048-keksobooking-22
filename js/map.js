/* global L:readonly */
import {setFormsEnabled} from './states.js';
import {createCustomPopup} from './popup.js';
import {getData} from './api.js'

const START_ADDRESS = {
  x: 35.681700,
  y: 139.753882,
};

const adressInput = document.querySelector('#address');
adressInput.disabled = true;
adressInput.value = `${START_ADDRESS.x}, ${START_ADDRESS.y}`;

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

getData((points) => {
  points.forEach((point) => {
    const mainMarker = L.marker({
      lat: point.location.lat,
      lng: point.location.lng,
    }, {
      icon: pinIcon,
    });

    mainMarker
      .addTo(map)
      .bindPopup(
        createCustomPopup(point), {
          keepInView: true,
        },
      );
  });
});
