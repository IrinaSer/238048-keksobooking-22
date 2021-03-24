import L from 'leaflet';
import { debounce } from 'lodash';
import { setFormsEnabled } from './states.js';
import { createCustomPopup } from './popup.js';
import { getData } from './api.js';
import { setOnChangeFilterRender } from './form.js';
import { addressInput} from './elements';

const START_ADDRESS = {
  x: 35.681700,
  y: 139.753882,
};

const POINTS_COUNT = 10;
const RERENDER_DELAY = 1000;

const map = L.map('map-canvas')
  .on('load', () => {
    setFormsEnabled();
  })
  .setView({
    lat: START_ADDRESS.x,
    lng: START_ADDRESS.y,
  }, 10);

const mainIconSizes = [52, 52];
const mainIconAnchors = [26, 52];
const mainPinIcon = L.icon({
  iconUrl: '../img/main-pin.svg',
  iconSize: mainIconSizes,
  iconAnchor: mainIconAnchors,
});

const mainMarker = L.marker({
  lat: START_ADDRESS.x,
  lng: START_ADDRESS.y,
}, {
  draggable: true,
  icon: mainPinIcon,
});

const otherIconsSizes = [40, 40];
const otherIconsAnchors = [20, 40];
const pinIcon = L.icon({
  iconUrl: '../img/pin.svg',
  iconSize: otherIconsSizes,
  iconAnchor: otherIconsAnchors,
});

const LAYER_IMAGE = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

const getOfferedRank = (offer, filters) => {
  const middlePrice = 10000;
  const maxPrice = 50000;
  const rankWeight = 1;

  let rank = 0;

  for (let key in filters) {
    if (key === 'price') {
      if (filters[key] === 'low' && (offer.offer[key] < middlePrice)) {
        rank += rankWeight;
      } else if (filters[key] === 'middle' && (offer.offer[key] >= middlePrice && offer.offer[key] < maxPrice)) {
        rank += rankWeight;
      } else if (filters[key] === 'high' && (offer.offer[key] >= maxPrice)) {
        rank += rankWeight;
      }
    } else if (key === 'features') {
      filters[key].forEach(feature => {
        if (offer.offer[key].includes(feature)) {
          rank += rankWeight;
        }
      });
    } else {
      if (offer.offer[key] === filters[key]) {
        rank += rankWeight;
      }
    }
  }

  return rank;
};

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
      let formattedValue = ((formattedKey === 'rooms' || formattedKey === 'guests') && value !== 'any') ?
        Number(value) : value;
      filters[formattedKey] = formattedValue;
    }

    filterValues.push(value !== 'any')
  }
  const rank = getOfferedRank(item, filters);
  return filterValues.filter(item => item).length === rank;
};

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
};

const setStartPoint = (isReset) => {
  addressInput.disabled = true;
  addressInput.value = `${START_ADDRESS.x}, ${START_ADDRESS.y}`;

  if (isReset) {
    const latLng = L.latLng(START_ADDRESS.x, START_ADDRESS.y);
    mainMarker.setLatLng(latLng);
  }
};

let markers;
markers = new L.LayerGroup().addTo(map);

L.tileLayer(
  LAYER_IMAGE, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

mainMarker.addTo(map);

mainMarker.on('moveend', (evt) => {
  const address = evt.target.getLatLng();
  const x = address.lat.toFixed(5);
  const y = address.lng.toFixed(5);

  addressInput.value = `${x}, ${y}`;
});

getData((offers) => {
  renderPoints(offers);
  setOnChangeFilterRender(debounce(() => renderPoints(offers), RERENDER_DELAY));
});

setStartPoint();

export {
  setStartPoint,
  renderPoints
};
