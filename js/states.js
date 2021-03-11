const advertForm = document.querySelector('.ad-form');
const advertFormChilds = advertForm.children;
const filterForm = document.querySelector('.map__filters');
const filterFormChilds = filterForm.children;

const setFormsDisabled = () => {
  advertForm.classList.add('ad-form--disabled');

  for (let field of advertFormChilds) {
    field.disabled = true;
  }

  setFilterFormDisabled();
}

const setFilterFormDisabled = () => {
  filterForm.classList.add('map__filters--disabled');

  for (let field of filterFormChilds) {
    field.disabled = true;
  }
}

const setFormsEnabled = () => {
  advertForm.classList.remove('ad-form--disabled');

  for (let field of advertFormChilds) {
    field.disabled = false;
  }

  filterForm.classList.remove('map__filters--disabled');

  for (let field of filterFormChilds) {
    field.disabled = false;
  }
}

setFormsDisabled();


export { setFormsEnabled, setFilterFormDisabled }
