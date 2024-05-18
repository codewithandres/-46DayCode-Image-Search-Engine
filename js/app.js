// Selecciona el contenedor de imágenes en el DOM
const imageWrapper = document.querySelector(".images");
// Selecciona el campo de búsqueda en el DOM
const searchInput = document.querySelector(".search input");
// Selecciona el botón de cargar más en el DOM
const loadMoreBtn = document.querySelector(".gallery .load-more");
// Selecciona el lightbox en el DOM
const lightbox = document.querySelector(".lightbox");
// Selecciona el botón de descarga de imagen en el lightbox
const downloadImgBtn = lightbox.querySelector(".uil-import");
// Selecciona el botón de cerrar en el lightbox
const closeImgBtn = lightbox.querySelector(".close-icon");

// Clave API para la autenticación con el servicio de imágenes
const apiKey = "jg9pkDr4VcyOsiQbMKNDKLFbRbrvJH3OG4NRFyqwxlCWdV2P8Guw4B9y";
// Número de imágenes por página
const perPage = 15;
// Página actual en la paginación
let currentPage = 1;
// Término de búsqueda actual, null si no hay búsqueda
let searchTerm = null;

// Función asíncrona para descargar imágenes
const downloadImg = async (imgUrl) => {
    try {
        // Intenta obtener la imagen desde la URL
        const res = await fetch(imgUrl);
        // Convierte la respuesta en un blob
        const blob = await res.blob();
        // Crea un enlace para descargar el blob
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        // Nombra el archivo con el timestamp actual
        a.download = new Date().getTime();
        // Inicia la descarga
        a.click();
    } catch {
        // Alerta si la descarga falla
        alert("Failed to download image!");
    };
};

// Función para mostrar el lightbox con la imagen y el nombre del fotógrafo
const showLightbox = (name, img) => {
    // Establece la imagen y el nombre en el lightbox
    lightbox.querySelector("img").src = img;
    lightbox.querySelector("span").innerText = name;
    // Guarda la URL de la imagen en el botón de descarga
    downloadImgBtn.setAttribute("data-img", img);
    // Muestra el lightbox y deshabilita el scroll del cuerpo
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
};

// Función para ocultar el lightbox
const hideLightbox = () => {
    // Oculta el lightbox y habilita el scroll del cuerpo
    lightbox.classList.remove("show");
    document.body.style.overflow = "auto";
}

// Función para generar el HTML de las imágenes y agregarlas al contenedor
const generateHTML = (images) => {
    // Agrega cada imagen al contenedor con su estructura HTML
    imageWrapper.innerHTML += images.map(img =>
        `<li class="card">
            <img onclick="showLightbox('${img.photographer}', '${img.src.large2x}')" src="${img.src.large2x}" alt="img">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloadImg('${img.src.large2x}');">
                    <i class="uil uil-import"></i>
                </button>
            </div>
        </li>`
    ).join("");
};

// Función asíncrona para obtener imágenes desde la API
const getImages = async (apiURL) => {
    // Desenfoca el campo de búsqueda y muestra el estado de carga
    searchInput.blur();
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");

    try {
        // Realiza la petición a la API con la clave API
        const res = await fetch(apiURL, {
            headers: {
                Authorization: apiKey
            }
        });
        // Convierte la respuesta en JSON y genera el HTML
        const data = await res.json();
        generateHTML(data.photos);
        // Restablece el texto y estado del botón de cargar más
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");
    } catch {
        // Alerta si la carga de imágenes falla
        alert("Failed to load images!");
    };
};

// Función para cargar más imágenes al hacer clic en el botón correspondiente
const loadMoreImages = () => {
    // Incrementa la página actual y construye la URL de la API
    currentPage++;
    let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    // Si hay un término de búsqueda, usa la URL de búsqueda
    apiUrl = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiUrl;
    // Obtiene las imágenes con la nueva URL
    getImages(apiUrl);
}

// Función para cargar imágenes basadas en la búsqueda
const loadSearchImages = (e) => {
    // Si el campo de búsqueda está vacío, no hace nada
    if (e.target.value === "") return searchTerm = null;
    // Si se presiona Enter, reinicia la paginación y obtiene las imágenes
    if (e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imageWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=1&per_page=${perPage}`);
    }
}

// Inicializa la carga de imágenes
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
// Agrega eventos a los botones y campos
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeImgBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));
