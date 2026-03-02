// Simple Alert for Buttons
function showAlert(section) {
    alert("Smoothly loading " + section + " materials... This will be linked to your PDF pages soon!");
}

// Modern Scroll Reveal Animation
document.addEventListener('DOMContentLoaded', () => {
    // Select all elements with the 'fade-in' class
    const observerOptions = {
        threshold: 0.1 // Triggers when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once it has faded in
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Apply observer to cards and headers
    const elementsToAnimate = document.querySelectorAll('.fade-in');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
});
