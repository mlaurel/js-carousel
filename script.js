// Function to get all image files from the images directory
async function getImageFiles() {
    try {
        const response = await fetch('/images');
        const text = await response.text();
        console.log(text);
        const parser = new DOMParser();
        console.log(parser);
        const doc = parser.parseFromString(text, 'text/html');
        console.log(doc);
        const links = Array.from(doc.querySelectorAll('a'));
        console.log(links);

        // Filter for image files and get their names
        return links
            .map(link => link.href)
            .filter(href => {
                const ext = href.split('.').pop().toLowerCase();
                return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
            })
            .map(href => href.split('/').pop());
    } catch (error) {
        console.error('Error fetching images:', error);
        // Fallback to a default image if there's an error
        return ['default.jpg'];
    }
}

// Function to create and populate slides
async function initializeCarousel() {
    const slidesContainer = document.querySelector("[data-slides]");
    slidesContainer.innerHTML = ''; // Clear existing slides

    const imageFiles = await getImageFiles();

    imageFiles.forEach((image, index) => {
        const li = document.createElement('li');
        li.className = 'slide';
        if (index === 0) {
            li.dataset.active = true;
            // Uses css active class
            // li.classList.add('active');
        }

        const img = document.createElement('img');
        img.src = `/images/${image}`;
        img.alt = `Image ${index + 1}`;

        li.appendChild(img);
        slidesContainer.appendChild(li);
    });
}

// Initialize the carousel
initializeCarousel();

// Carousel navigation functionality
const buttons = document.querySelectorAll("[data-carousel-button]");

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const offset = button.dataset.carouselButton === "next" ? 1 : -1;
        const slides = button
            .closest("[data-carousel]")
            .querySelector("[data-slides]");

        const activeSlide = slides.querySelector("[data-active]");
        let newIndex = [...slides.children].indexOf(activeSlide) + offset;
        if (newIndex < 0) newIndex = slides.children.length - 1;
        if (newIndex >= slides.children.length) newIndex = 0;

        slides.children[newIndex].dataset.active = true;
        delete activeSlide.dataset.active;
        // Uses css active class
        // slides.children[newIndex].classList.add("active");
        // activeSlide.classList.remove("active");
    });
});
