const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

// show images
const showImages = (images) => {
  toggleSpinner("loading-spinner-search");
  imagesArea.style.display = "block";
  gallery.innerHTML = "";
  // show gallery title
  galleryHeader.style.display = "flex";
  images.forEach((image) => {
    let div = document.createElement("div");
    div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
  });
};

const getImages = (query) => {
  fetch(
    `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
  )
    .then((response) => response.json())
    .then((data) => showImages(data.hits))
    .catch((err) => console.log(err));
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle("added");

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders.splice(item, 1);
  }
};
var timer;
const createSlider = () => {
  toggleSpinner("loading-spinner-slider");
  // check slider image length
  if (sliders.length < 2) {
    alert("Select at least 2 image.");
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  document.querySelector(".main").style.display = "block";
  // hide image area
  imagesArea.style.display = "none";

  // Duration per slide
  function getDuration() {
    const durationInput = document.getElementById("duration");
    let duration = 1000;

    if (durationInput.value > 1000) {
      duration = durationInput.value;
    } else if (typeof durationInput.value !== "number") {
      alert(
        "Duration is reset to default: 1000ms (1sec). Duration should be a valid number and at least 1000ms (1sec)."
      );
      duration = 1000;
    }
    return duration;
  }

  sliders.forEach((slide) => {
    let item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
  });
  changeSlide(0);
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, getDuration());
};

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};

// Spinner event handler in between loading image list and slider
function toggleSpinner(id) {
  const element = document.getElementById(id);
  element.classList.toggle("d-none");
}

// Search event listeners and elements
const search = document.getElementById("search");

function handleSearch() {
  document.querySelector(".main").style.display = "none";
  clearInterval(timer);
  toggleSpinner("loading-spinner-search");
  getImages(search.value);
  sliders.length = 0;
}

searchBtn.addEventListener("click", handleSearch);

// Enter keypress event for search inputs
search.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
  e.stopPropagation();
});

// Slider event listeners and elements
const imageList = document.querySelector(".images");

function handleSlider() {
  toggleSpinner("loading-spinner-slider");
  createSlider();
}

sliderBtn.addEventListener("click", handleSlider);

// Enter keypress event to create slider
document.addEventListener("keypress", (e) => {
  e.key === "Enter" ? handleSlider() : null;
});
