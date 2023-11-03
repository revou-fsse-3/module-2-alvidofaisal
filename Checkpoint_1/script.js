// Hamburger menu
function show() {
    document.querySelector('.hamburger').classList.
    toggle('open')
    document.querySelector('.navigation').classList.
    toggle('active')
}

// Dark mode
const body = document.querySelector('body');
const darkBtn = document.querySelector('.btn');
const darkIcon = document.querySelector('.btn__icon')

// Store the value true if the dark mode is activated or false if it's not
function store(value) {
    localStorage.setItem('darkmode', value);
}

// Indicate if the "darkmode" property exist. It loads the page as we had left it.
function load() {
    const darkmode = localStorage.getItem('darkmode');

    // If the dark mode was never activated
    if(!darkmode) {
        store(false);
        darkIcon.classList.add('fa-sun');
    } else if(darkmode == 'true') { // If the dark mode is activated
        body.classList.add('darkmode');
        darkIcon.classList.add('fa-moon');
    } else if (darkmode == 'false') { // If the dark mode exists but is disabled 
        darkIcon.classList.add('fa-sun');
    }
}

load();

darkBtn.addEventListener('click', () => {
    body.classList.toggle('darkmode');
    darkIcon.classList.add('animated');

    store(body.classList.contains('darkmode'));

    if(body.classList.contains('darkmode')){
        darkIcon.classList.remove('fa-sun');
        darkIcon.classList.add('fa-moon');
    }else {
        darkIcon.classList.remove('fa-moon');
        darkIcon.classList.add('fa-sun');
    }

    setTimeout( () => {
        darkIcon.classList.remove('animated');
    }, 500)
})



// Search images
const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadImgBtn = lightBox.querySelector(".uil-import");


// API key, paginations, searchTerm variables
const apiKey = "EZ25JRVT5XzncvDcMIsI2zcAITOHqe9obakBQgpbxfZmrNIGMjQps1xJ";
const perPage = 31;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
    // Converting received img to blob, creating its download link and downloading it
    fetch(imgURL).then(res => res.blob()).then(file => {
        const a = document.createElement("a")
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(() => alert("Failed to download image!"));
}

const showLightbox = (name, img) => {
    // Showing lightbox and setting img source, name
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    downloadImgBtn.setAttribute("data-img", img);
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";
}

const hideLightbox = () => {
    lightBox.classList.remove("show"); 
    document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
    // Making li of all fetched images and adding them to the existing image wrapper
    imagesWrapper.innerHTML += images.map(img => 
        `<li class="card" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
            <img src="${img.src.large2x}" alt="img">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
                    <i class="uil uil-import"></i>
                </button>
            </div>
        </li>`
    ).join("");
}

const getImages = (apiURL) => {
    // Fetching images by API call with authorization header
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");
    fetch(apiURL, {
        headers: { Authorization: apiKey }
    })
    .then(res => res.json())
    .then(data => {
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");
    }) 
    .catch(() => alert("Failed to load images!"));
}

const loadMoreImages = () => {
    currentPage++; // Increment currentPage by 1
    // If searchTerm has some value, then call API with search term. else call default API.
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);
}

const loadSearchImages = (e) => {
    // If the search input is empty, set the search term to null and return from here
    if(e.target.value === "") return searchTerm = null;
    // If pressed key is Enter, update the current page, search term & call the getImages
    if(e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));
