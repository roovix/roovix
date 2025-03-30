const navList = document.querySelector('.navList');
const navBarToggle = document.querySelector('.navBarToggle');
const navCloseBtn = document.querySelector('.navCloseBtn');
const darkScreenForSmallNavOpened = document.getElementById("dark-screen--small-nav-opened");

// Show nav list and dark screen when menu is toggled
navBarToggle.addEventListener('click', () => {
    navList.style.display = 'block';
    darkScreenForSmallNavOpened.style.display = 'block'; // Show dark screen
});

// Hide nav list and dark screen when close button is clicked
navCloseBtn.addEventListener('click', () => {
    navList.style.display = 'none';
    darkScreenForSmallNavOpened.style.display = 'none'; // Hide dark screen
});

// Hide nav bar when clicking specific nav item
document.getElementById('start-for-free-nav-item').addEventListener('click', () => {
    if (window.innerWidth <= 1158) {
        navList.style.display = 'none';
        darkScreenForSmallNavOpened.style.display = 'none'; // Hide dark screen when nav item clicked
    }
});

// Close nav when clicking on dark screen
darkScreenForSmallNavOpened.addEventListener('click', () => {
    navList.style.display = 'none';
    darkScreenForSmallNavOpened.style.display = 'none'; // Hide dark screen
});

// Revert nav list style on window resize
window.addEventListener("resize", function () {
    let navList = document.querySelector("nav .navList");
    if (window.innerWidth >= 1158) {
        navList.style.display = "flex"; // Reset style for large screens
        darkScreenForSmallNavOpened.style.display = 'none'; // Hide dark screen on larger screens
    } else {
        navList.style.display = ""; // Allow media queries to handle small screens
    }
});
