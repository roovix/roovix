import { auth, db } from "https://www.roovix.com/config/firebase_config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { formatISODate } from 'https://element.roovix.com/functions/app.js';


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
let urlParams = window.location.search;
let params = new URLSearchParams(urlParams);
let userId = params.get('user_id');

if(userId) {
  const userRef = ref(db, `users/${userId}`);
  const userDataSnapshot = await get(userRef);

  if (userDataSnapshot.exists()) {

    const userData = userDataSnapshot.val();

    // Update profile page with user data
    document.getElementById("user-name").textContent = userData.username;
    document.getElementById("user-email").textContent = userData.email;
    document.getElementById("joined-date").textContent = formatISODate(userData.createdAt);
    document.getElementById("user-photo").src = userData.profile_picture;
    
    
    if(userData.bio) {
      document.getElementById("bio-content").textContent = userData.bio;
    }else{
      document.getElementById("bio-content").textContent = 'No bio provided';
    }

    // Show interests and skills
    const interestsList = document.getElementById('interests-list');
    const skillsList = document.getElementById('skills-list');
    
    let interestsData = userData.interests;
    let skillsData = userData.skills;

    // Show interests
    if(interestsData) {
      interestsData = interestsData.split(',');
      interestsData.forEach((interest)=>{
        const interestItem = document.createElement('div');
        interestItem.classList= 'interest-tag';
        interestItem.textContent = interest;
        interestsList.appendChild(interestItem);
      })
    }else{
      interestsList.textContent = 'No interests found';
    }

    // Show skills
    if(skillsData) {
      skillsData = skillsData.split(',');
      skillsData.forEach((skill)=>{
        const skillItem = document.createElement('div');
        skillItem.classList='interest-tag';
        skillItem.textContent = skill;
        skillsList.appendChild(skillItem);
      })
    }else{
      skillsList.textContent = 'No skills found';
    }
  }else {
    alert("User data not found");
  }
}else{
  alert("User ID not provided, Invalid url..!");
}
