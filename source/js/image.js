const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const DEFAULT_AVATAR = 'img/muffin-grey.svg';

const avatarChooser = document.querySelector('.ad-form__field input[type=file]');
const avatarPreview = document.querySelector('.ad-form-header__preview img');

const photoChooser = document.querySelector('.ad-form__upload input[type=file]');
const photoPreview = document.querySelector('.ad-form__photo');

const onFileChange = (chooser, preview, isAppendImg) => {
  return () => {
    const file = chooser.files[0];
    const fileName = file.name.toLowerCase();

    const matches = FILE_TYPES.some((it) => {
      return fileName.endsWith(it);
    });

    if (matches) {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        if (isAppendImg) {
          preview.innerHTML = '';
          const photoImg = document.createElement('img');
          photoImg.setAttribute('style', 'width: 40px; height: 44px; margin: 13px auto; display: block;');
          photoImg.src = reader.result;
          preview.appendChild(photoImg);
        } else {
          preview.src = reader.result;
        }
      });

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
