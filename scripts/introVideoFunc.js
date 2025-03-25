document.addEventListener("DOMContentLoaded", function () {
    let videoPopup = document.getElementById("videoPopup");
    let closeButton = document.getElementById("closeVideo");
    let videoPopupOpen = document.getElementById("videoPopupOpen");
    let video = document.getElementById("intro_video");

    // Open the popup & play video
    videoPopupOpen.addEventListener("click", function () {
        videoPopup.style.display = "flex"; // Show popup
        video.play(); // Play video
    });

    // Close the popup & pause video
    closeButton.addEventListener("click", function () {
        video.pause(); // Pause video
        video.currentTime = 0; // Reset video to start
        videoPopup.style.display = "none"; // Hide popup
    });
});