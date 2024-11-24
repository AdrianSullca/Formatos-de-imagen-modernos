// Aquest codi ens ajuda a mostrar informació de les imatges de manera dinàmica

const images = Array.from(document.querySelectorAll("img"));
const infoContainers = Array.from(document.querySelectorAll(".image-info"));

// Per saber la mida de la imatge en bytes, pots fer una petició fetch per
// carregar la imatge i accedir a la seva longitud mitjançant el mètode
// blob.size. Aquest procés et proporciona la mida de la imatge en bytes.

// Més info sobre Blob --> https://es.javascript.info/blob

async function getImageInfo(url) {
  return new Promise(async (resolve, reject) => {
    const img = new Image();
    img.src = url;

    img.onload = async () => {
      try {
        const response = await fetch(url);
        // blob és un tipus de dades que representa un objecte de dades binàries. En el cas de les imatges
        const blob = await response.blob();
        console.dir(blob);
        const format = url.split(".").pop();
        const dimensions = {
          width: img.width,
          height: img.height,
        };
        const alt = img.alt;
        const size = blob.size;

        resolve({ format, dimensions, alt, size });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = reject;
  });
}


function displayImageInfo(url, container) {
  getImageInfo(url)
    .then((info) => {
      const formatElement = document.createElement("p");
      formatElement.textContent = `Format: ${info.format}`;
      container.appendChild(formatElement);

      const dimensionsElement = document.createElement("p");
      dimensionsElement.textContent = `Dimensions: ${info.dimensions.width}x${info.dimensions.height}`;
      container.appendChild(dimensionsElement);

      const altElement = document.createElement("p");
      altElement.textContent = `Alt: ${info.alt}`;
      container.appendChild(altElement);

      const sizeInKB = (info.size / 1024).toFixed(2);
      const sizeElement = document.createElement("p");
      sizeElement.textContent = `Size: ${sizeInKB} KB`;
      container.appendChild(sizeElement);
    })
    .catch(console.error);
}

const container = document.querySelector("#image-info-container");

async function generateTable() {
  const tableBody = document.querySelector("#image-savings-table tbody");

  // Llistat d'imatges amb els seus formats WebP i AVIF
  const imageUrls = [
    { original: "../images/paisaje.jpg", webp: "../images/paisaje-webp.webp", avif: "../images/paisaje-avif.avif", name: "paisaje" },
    { original: "../images/animal.jpg", webp: "../images/animal-webp.webp", avif: "../images/animal-avif.avif", name: "animal" },
    { original: "../images/noche-estrellada.jpg", webp: "../images/noche-estrellada-webp.webp", avif: "../images/noche-estrellada-avif.avif", name: "noche-estrellada" },
  ];

  for (const image of imageUrls) {
    const originalInfo = await getImageInfo(image.original);
    const webpInfo = await getImageInfo(image.webp);
    const avifInfo = await getImageInfo(image.avif);

    const row = document.createElement("tr");

    // Nom Imatge
    const nameCell = document.createElement("td");
    nameCell.textContent = image.name;
    nameCell.classList.add("border", "border-gray-300", "p-2");
    row.appendChild(nameCell);

    // Mida Original
    const originalSize = (originalInfo.size / 1024).toFixed(2); // Convertir a KB
    const originalSizeCell = document.createElement("td");
    originalSizeCell.textContent = `${originalSize} KB`;
    originalSizeCell.classList.add("border", "border-gray-300", "p-2");
    row.appendChild(originalSizeCell);

    // Mida WebP i percentatge d'estalvi
    const webpSize = (webpInfo.size / 1024).toFixed(2);
    const webpSavings = ((originalInfo.size - webpInfo.size) / originalInfo.size * 100).toFixed(2); // Estalvi en percentatge
    const webpSizeCell = document.createElement("td");
    webpSizeCell.textContent = `${webpSize} KB (${webpSavings}%)`;
    webpSizeCell.classList.add("border", "border-gray-300", "p-2");
    row.appendChild(webpSizeCell);

    // Mida AVIF i percentatge d'estalvi
    const avifSize = (avifInfo.size / 1024).toFixed(2);
    const avifSavings = ((originalInfo.size - avifInfo.size) / originalInfo.size * 100).toFixed(2); // Estalvi en percentatge
    const avifSizeCell = document.createElement("td");
    avifSizeCell.textContent = `${avifSize} KB (${avifSavings}%)`;
    avifSizeCell.classList.add("border", "border-gray-300", "p-2");
    row.appendChild(avifSizeCell);

    // Afegir la fila a la taula
    tableBody.appendChild(row);
  }
}

images.forEach((img, i) => {
  displayImageInfo(img.src, infoContainers[i]);
});

generateTable();
