import { auth, db } from "https://www.roovix.com/config/firebase_config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { getDomain, formatISODate } from "https://element.roovix.com/functions/app.js";

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

    // Check for suer verified
    if(userData.verified) {
      document.querySelector(".verified-badge").classList.remove('unverified');
      document.querySelector(".avatar-img").classList.remove('unverified');
    }else{
      document.querySelector(".avatar-img").classList.add('unverified');
      document.querySelector(".verified-badge").classList.add('unverified');
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

    // show links that user provided
    const linksList = document.getElementById('links-list');
    if(userData.links) {
        let linksData = userData.links;
        let linkHtml = ``;                

        // Loop inside links to fetch link one by one
        linksData.forEach((link)=>{
            // Get domain from link
            let domain = getDomain(link.url);

            linkHtml += `
                <li><a href="${link.url}" target="_blank">
                    <img class="link-icon" src="https://www.google.com/s2/favicons?sz=64&domain=${domain}" alt="${domain}">
                    <div class="link-text">${link.title} <span class="url-text">${link.url}</span></div>
                </a></li>
            `;
        });
        linksList.innerHTML = linkHtml;
    }else {
        linksList.textContent = 'No links found';
    }
    
  }else {
    alert("User data not found");
  }
}else{
  alert("User ID not provided, Invalid url..!");
}
