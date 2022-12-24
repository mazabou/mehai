const thumbnails = document.querySelectorAll('.image');

// Create a new element to hold the larger image
const largeImageContainer = document.createElement('div');
const largeImageHeader = document.createElement('div');
largeImageContainer.style.position = 'absolute';
largeImageContainer.style.zIndex = '1';

largeImageHeader.style.position = 'absolute';
largeImageHeader.style.zIndex = '1';

// Get the body element
const body = document.body;

function handleThumbnailHover(event) {
    const thumbnail = event.target;

    const imageRect = thumbnail.getBoundingClientRect();

    console.log(`The image is positioned at (${imageRect.left}, ${imageRect.top}).`);
    const imageTop = imageRect.top;
    const imageBottom = imageRect.bottom;
    const imageLeft = imageRect.left;

    // Create a new Image object and set its src to the high resolution URL
    const highResImage = new Image();
    const url = thumbnail.src;
    const urlObject = new URL(url);
    const filename = urlObject.pathname.split('/').pop();
    console.log(filename);
    highResImage.src = 'covers-hd/' + filename;

    highResImage.style.maxWidth = '600px';
    highResImage.style.maxHeight = '600px';

    // Set the innerHTML of the large image container to the Image object
    largeImageContainer.innerHTML = highResImage.outerHTML;
    console.log(highResImage.outerHTML);
    largeImageHeader.innerHTML = `<div style="padding-bottom: 4px;"><p class="black-box">Generated using DALL·E 2</p></div><div style="padding-bottom: 4px;"><p class="black-box"><span class="bf">Prompt</span>: ${thumbnail.dataset.prompt}</p></div>`;
    console.log(largeImageHeader.innerHTML);

    // Position the large image container next to the cursor
    largeImageContainer.style.left = (imageLeft + 140) + 'px';
    largeImageHeader.style.left = (imageLeft + 140) + 'px';

    console.log(body.offsetHeight)
    console.log(document.documentElement.clientWidth)

    let imagePos = imageTop +  window.scrollY;
    console.log(imagePos)

    const maxHeight = Math.max(document.documentElement.clientWidth, body.offsetHeight);

    if (imagePos + 600 > maxHeight) {
        console.log(imagePos + 600)
            imagePos = imageBottom - 600 +  window.scrollY;
    }

    largeImageContainer.style.top = imagePos + 'px';
    largeImageHeader.style.top = imagePos - 102 + 'px';

    // Add the large image container to the document
    document.body.appendChild(largeImageContainer);
    document.body.appendChild(largeImageHeader);
}


thumbnails.forEach(thumbnail => thumbnail.addEventListener('mouseover', handleThumbnailHover))
thumbnails.forEach(thumbnail => thumbnail.addEventListener('mouseout', () => {document.body.removeChild(largeImageContainer); document.body.removeChild(largeImageHeader);}))
