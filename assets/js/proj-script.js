document.addEventListener('DOMContentLoaded', () => {
    const arrowEl = document.getElementById("arrow-up");

    if (arrowEl) {
        window.addEventListener('scroll', () => {
            if (window.scrollY >= 400) {
                arrowEl.style.opacity = "1";
                arrowEl.style.pointerEvents = "auto";
            } else {
                arrowEl.style.opacity = "0";
                arrowEl.style.pointerEvents = "none";
            }
        });
    }

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-quad',
            once: true
        });
    }

    // Lazy load interaction for images
    const images = document.querySelectorAll('.column img');
    images.forEach(img => {
        img.addEventListener('click', () => {
            // Future: Implement lightbox
            console.log('Image clicked:', img.src);
        });
    });
});