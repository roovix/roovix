const navList = document.querySelector('.navList');
const navBarToggle = document.querySelector('.navBarToggle');
const navCloseBtn = document.querySelector('.navCloseBtn');

navBarToggle.addEventListener('click', () => {
    navList.style.display = 'block';
});
navCloseBtn.addEventListener('click', () => {
    navList.style.display = 'none';
});

// Hide nav ber when click specific defined nav item
document.getElementById('start-for-free-nav-item').addEventListener('click', () => {
    if (window.innerWidth <= 1158) {
        navList.style.display = 'none';
    }
});

// Revert responsive
window.addEventListener("resize", function () {
    let navList = document.querySelector("nav .navList");
    if (window.innerWidth >= 1158) {
        navList.style.display = "flex"; // Reset style for large screens
    } else {
        navList.style.display = ""; // Allow media queries to handle small screens
    }
});
