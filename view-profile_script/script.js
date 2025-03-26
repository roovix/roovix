import { auth, db } from "https://www.roovix.com/config/firebase_config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Profile tab navigation
const tabBtns = document.querySelectorAll(".tab-btn");
tabBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    // Remove active class from all tab buttons
    tabBtns.forEach((tabBtn) => {
      tabBtn.classList.remove("active");
    });

    // Add active class to clicked tab button
    this.classList.add("active");

    // Hide all tab content
    const tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach((content) => {
      content.classList.remove("active");
    });

    // Show the selected tab content
    const tabId = this.getAttribute("data-tab") + "-tab";
    document.getElementById(tabId).classList.add("active");
  });
});

// When click any profile button (navigation to profile page)
document.querySelectorAll(".profile-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    // Navigate to profile page
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((navItem) => {
      navItem.classList.remove("active");
      if (navItem.getAttribute("data-page") === "profile") {
        navItem.classList.add("active");
      }
    });
    
    // Hide all pages
    const pages = document.querySelectorAll(".page");
    pages.forEach((page) => {
      page.classList.remove("active");
    });
    
    // Show profile page
    document.getElementById("profile-page").classList.add("active");
  });
});

// Fetch user profile data from Firebase Realtime Database
