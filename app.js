const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const search = document.getElementById('search');
const durationInput = document.getElementById('duration');

const modalText = document.querySelector('.modal-text');
const modalWrapper = document.querySelector('.modal-wrapper');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
// const KEY = '15674931-a9d714b6e9d654524df198e00&q';
const KEY = '20271592-f508a591a792622a7d3d4da00';

// show images 
const showImages = (images) => {
  if (images.length == 0) {
    showWarning('No search result found. please try again');
    showSpnnier()
    return;
  }
  imagesArea.style.display = 'block';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
  })
  showSpnnier()
}

const getImages = (query) => {

  gallery.innerHTML = '';
  showSpnnier();
  fetch(`https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  let item = sliders.indexOf(img);

  element.classList.toggle('added');
  if (item === -1) {
    sliders.push(img);
    // console.log(sliders, sliders.length);
  }

  else {
    sliders.splice(item, 1);
    // console.log(sliders, sliders.length);
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    showWarning('Please select at least two image');
    return;
  }
  //check the duration
  const duration = document.getElementById('duration').value;
  if (duration < 0) {
    showWarning('Duration can not be Negative');
    return;
  }
  if (duration == 0) {
    showWarning('Duration can not be 0');
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';

  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

//enter key functionality
search.addEventListener('keypress', (event) => {
  if (event.key == 'Enter') {
    searchBtn.click();
  }
})

// search button event listener
searchBtn.addEventListener('click', function () {
  if (search.value.trim() == "") {
    showWarning('please enter something to search');
    return;
  }
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  getImages(search.value)
  sliders.length = 0;
})


//slider eventlistener
sliderBtn.addEventListener('click', function () {
  createSlider()
})
//showing warning 
const showWarning = (msg) => {
  modalWrapper.classList.add('modal-show');
  modalText.innerText = msg;
  document.querySelector('.modal-wrapper').addEventListener('click', (e) => {
    if (e.target.classList[0] == 'modal-close-btn' || e.target.classList[0] == 'modal-wrapper') {
      modalWrapper.classList.remove('modal-show');
      console.log(e.target);
    }
  });
}

durationInput.addEventListener('input', () => {
  if (durationInput.value < 1000 && durationInput.value > 0) {
    document.querySelector('.duration-warning').style.display = 'block';
    durationInput.style.color = '#ffc107';
  }
  else {
    durationInput.style.color = '#495057';
    document.querySelector('.duration-warning').style.display = 'none';
  }
})

const showSpnnier = () => {
  const loadingSpnnier = document.getElementById('loading-spnnier');
  loadingSpnnier.classList.toggle('d-none');
}
