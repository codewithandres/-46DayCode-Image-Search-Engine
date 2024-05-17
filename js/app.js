
const imagesWrapper = document.querySelector('.iamges');
const loadMore = document.querySelector('.load-more');

const API_KEY = 'jg9pkDr4VcyOsiQbMKNDKLFbRbrvJH3OG4NRFyqwxlCWdV2P8Guw4B9y';

const PrePage = 15;
let currenPage = 1;

const generateHTML = imagen => {
    imagesWrapper.innerHTML += imagen.map(img =>

        `<li class="card">
             <img src="${img.src.large2x}" alt="image">
             <div class="details">
                <div class="photograper">
                   <i class="ri-camera-line"></i>
                   <span>${img.photographer}</span>
                </div>
                   <button><i class="ri-download-2-fill"></i></button>
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
    }).then(res => res.json().then(data => generateHTML(data.photos)));

    loadMore.textContent = 'Load More';
    loadMore.classList.remove('disable')
};

const loadMoreImg = () => {
    currenPage++;
    let apiUrl = `https://api.pexels.com/v1/curated?page=${currenPage}&per_page=${PrePage}`
    getImages(apiUrl);
};

getImages(`https://api.pexels.com/v1/curated?page=${currenPage}&per_page=${PrePage}`);
loadMore.addEventListener('click', loadMoreImg);