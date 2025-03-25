document.addEventListener("DOMContentLoaded", function () {
    const navBar = document.querySelector(".navBar");
    const toggleBtn = document.createElement("button");

    toggleBtn.classList.add("menu-toggle");
    toggleBtn.innerHTML = "☰"; // Default menu icon

    function handleMenuVisibility() {
        if (window.innerWidth <= 1024) {
            if (!document.body.contains(toggleBtn)) {
                document.body.appendChild(toggleBtn);
            }
        } else {
            if (document.body.contains(toggleBtn)) {
                document.body.removeChild(toggleBtn);
                navBar.classList.remove("open"); // Ensure nav is closed on resize
            }
        }
    }

    // Initial check
    handleMenuVisibility();

    // Recheck on window resize
    window.addEventListener("resize", handleMenuVisibility);

    // Toggle menu functionality
    toggleBtn.addEventListener("click", function () {
        navBar.classList.toggle("open");
        toggleBtn.innerHTML = navBar.classList.contains("open") ? "☰" : "☰"; // Change icon
    });
});