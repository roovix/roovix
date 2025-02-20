document.addEventListener("DOMContentLoaded", () => {
    const dropdowns = document.querySelectorAll(".dropdown-item");

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("mouseenter", () => {
            dropdown.querySelector("svg").style.transform = "rotate(180deg)";
        });

        dropdown.addEventListener("mouseleave", () => {
            dropdown.querySelector("svg").style.transform = "rotate(0deg)";
        });
    });
});
