document.addEventListener("DOMContentLoaded", function () {
    const navBar = document.querySelector(".navBar");
    const toggleBtn = document.createElement("button");
    const icon = document.createElement("i");
    const darkScreenForNavOpened = document.getElementById("dark-screen-small-nav-opened");

    toggleBtn.classList.add("menu-toggle");
    icon.classList.add("fas", "fa-bars"); // Default Font Awesome menu icon
    toggleBtn.appendChild(icon);

    function handleMenuVisibility() {
        if (window.innerWidth <= 1024) {
            if (!document.body.contains(toggleBtn)) {
                document.body.appendChild(toggleBtn);
            }
            // Adjust icon based on the current menu state
            if (navBar.classList.contains("open")) {
                icon.classList.replace("fa-bars", "fa-times"); // Show 'X' icon when menu is open
            } else {
                icon.classList.replace("fa-times", "fa-bars"); // Show menu icon when menu is closed
            }
        } else {
            if (document.body.contains(toggleBtn)) {
                document.body.removeChild(toggleBtn);
                navBar.classList.remove("open"); // Ensure nav is closed on resize
                darkScreenForNavOpened.style.display = "none"; // Hide dark screen on resize
                icon.classList.replace("fa-times", "fa-bars"); // Reset to menu icon
            }
        }
    }

    // Initial check on load
    handleMenuVisibility();

    // Recheck visibility on window resize
    window.addEventListener("resize", handleMenuVisibility);

    // Toggle menu functionality
    toggleBtn.addEventListener("click", function () {
        navBar.classList.toggle("open");
        if (navBar.classList.contains("open")) {
            icon.classList.replace("fa-bars", "fa-times"); // Change to 'X' icon
            darkScreenForNavOpened.style.display = "block"; // Show dark screen
        } else {
            icon.classList.replace("fa-times", "fa-bars"); // Change back to menu icon
            darkScreenForNavOpened.style.display = "none"; // Hide dark screen
        }
    });

    // Close nav bar when clicking on dark screen
    darkScreenForNavOpened.addEventListener("click", function () {
        navBar.classList.remove("open");
        darkScreenForNavOpened.style.display = "none"; // Hide dark screen
        icon.classList.replace("fa-times", "fa-bars"); // Change to menu icon
    });
});
