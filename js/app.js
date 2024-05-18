
const imagesWrapper = document.querySelector('.iamges');
const loadMore = document.querySelector('.load-more');
const searchBox = document.querySelector('.search-box input');

const API_KEY = 'jg9pkDr4VcyOsiQbMKNDKLFbRbrvJH3OG4NRFyqwxlCWdV2P8Guw4B9y';

const PrePage = 15;
let currenPage = 1;
let searcTerm = null;

const generateHTML = imagen => {
    imagesWrapper.innerHTML += imagen.map(img =>

        `<li class="card">
            <img src="${img.src.large2x}" alt="image">
             <div class="details">
                <div class="photograper">
                   <i class="ri-camera-line"></i>
                   <span>${img.photographer}</span>
                </div>
                   <button>
                     <i class="ri-download-2-fill"></i>
                   </button>
                </div>
        </li>`

    ).join('');
};

const getImages = apiUrl => {

    loadMore.textContent = 'Cargando...';
    loadMore.classList.add('disable');

    fetch(apiUrl, {
        headers: {
            Authorization: API_KEY
        }
    }).then(res => res.json().then(data => {
        generateHTML(data.photos);
        loadMore.textContent = 'Load More';
        loadMore.classList.remove('disable');
    })).catch(() => alert('Oops Tenemos un problemita Intenta de nuevo'));


};

const loadMoreImg = () => {
    loadMore.textContent = 'Cargando...';
    loadMore.classList.add('disable');

    currenPage++;
    let apiUrl = `https://api.pexels.com/v1/curated?page=${currenPage}&per_page=${PrePage}`

    apiUrl = searcTerm ?
        `https://api.pexels.com/v1/curated?page=${currenPage}&per_page=${PrePage}`
        : apiUrl;

    getImages(apiUrl);
};

const loadSearchImage = e => {
    if (e.target.value === '') return searcTerm = null;

    if (e.key === 'Enter') {

        currenPage = 1;
        searcTerm = e.target.value;
        imagesWrapper.innerHTML = '';

        loadMore.textContent = 'Cargando...';
        loadMore.classList.add('disable');

        getImages(`https://api.pexels.com/v1/search?query=${searcTerm}&per_page=${PrePage}`)

    };
};

getImages(`https://api.pexels.com/v1/curated?page=${currenPage}&per_page=${PrePage}`);

loadMore.addEventListener('click', loadMoreImg);
searchBox.addEventListener('keyup', loadSearchImage);
