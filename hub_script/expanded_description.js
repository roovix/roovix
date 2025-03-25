function toggleText(event) {
    event.preventDefault(); // Prevent link from reloading the page
    const text = document.getElementById("description");
    const link = document.getElementById("seeMore");

    if (text.classList.contains("expanded")) {
        text.classList.remove("expanded");
        link.innerText = "See more";
    } else {
        text.classList.add("expanded");
        link.innerText = "See less";
    }
}