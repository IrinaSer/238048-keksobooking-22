const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const DEFAULT_AVATAR = 'img/muffin-grey.svg';

const avatarChooser = document.querySelector('.ad-form__field input[type=file]');
const avatarPreview = document.querySelector('.ad-form-header__preview img');

const photoChooser = document.querySelector('.ad-form__upload input[type=file]');
const photoPreview = document.querySelector('.ad-form__photo');

const onFileLoad = (reader, preview, isAppendImg) => {
  return () => {
    if (isAppendImg) {
      preview.innerHTML = '';
      const photoImg = document.createElement('img');
      photoImg.style.width = '40px';
      photoImg.style.height = '44px';
      photoImg.style.margin = '13px auto';
      photoImg.style.display = 'block';
      photoImg.src = reader.result;
      preview.appendChild(photoImg);
    } else {
      preview.src = reader.result;
    }
  }
};

const onFileChange = (chooser, preview, isAppendImg) => {
  return () => {
    const file = chooser.files[0];
    const fileName = file.name.toLowerCase();

    const matches = FILE_TYPES.some((it) => {
      return fileName.endsWith(it);
    });

    if (matches) {
      const reader = new FileReader();

      reader.addEventListener('load', onFileLoad(reader, preview, isAppendImg));

      reader.readAsDataURL(file);
    }
  };
};

const bindFileSelection = (chooser, preview, isAppendImg) => {
  chooser.addEventListener('change', onFileChange(chooser, preview, isAppendImg));
};

const resetFilePreview = () => {
  avatarPreview.src = DEFAULT_AVATAR;
  photoPreview.innerHTML = '';
};

bindFileSelection(avatarChooser, avatarPreview);
bindFileSelection(photoChooser, photoPreview, true);

export { resetFilePreview };
