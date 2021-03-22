const advertForm = document.querySelector('.ad-form');
const advertFormChildren = advertForm.children;
const filterForm = document.querySelector('.map__filters');
const filterFormChildren = filterForm.children;

const setFilterFormDisabled = () => {
  filterForm.classList.add('map__filters--disabled');

  for (let field of filterFormChildren) {
    field.disabled = true;
  }
};

const setFormsDisabled = () => {
  advertForm.classList.add('ad-form--disabled');

  for (let field of advertFormChildren) {
    field.disabled = true;
  }

  setFilterFormDisabled();
};

const setFormsEnabled = () => {
  advertForm.classList.remove('ad-form--disabled');

  for (let field of advertFormChildren) {
    field.disabled = false;
  }

  filterForm.classList.remove('map__filters--disabled');

  for (let field of filterFormChildren) {
    field.disabled = false;
  }
};

setFormsDisabled();

export {
  setFormsEnabled,
  setFilterFormDisabled
}
