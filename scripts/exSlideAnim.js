document.addEventListener("DOMContentLoaded", function () {
    let exContent = document.querySelector(".ex-content");
    
    // Clone the images inside `.ex-content`
    let clone = exContent.cloneNode(true);
    
    // Append the clone directly to keep images flowing
    exContent.parentElement.appendChild(clone);
});