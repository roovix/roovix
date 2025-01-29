const navList = document.querySelector('.navList');
const navBarToggle = document.querySelector('.navBarToggle');
const navCloseBtn = document.querySelector('.navCloseBtn');

navBarToggle.addEventListener('click', () => {
    navList.style.display = 'block';
});
navCloseBtn.addEventListener('click', () => {
    navList.style.display = 'none';
});