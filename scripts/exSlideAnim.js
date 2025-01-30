document.addEventListener("DOMContentLoaded", function () {
    let exContent = document.querySelector(".ex-content");
    exContent.innerHTML += exContent.innerHTML; // Duplicate for seamless looping
});