import { auth, db } from "https://www.roovix.com/config/firebase_config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getDomain, formatISODate, ISoToTimeAgo, isValidUID, isValidUsername } from "https://element.roovix.com/functions/app.js";

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


// If user searching for a username
if(!isValidUID(userId) && isValidUsername(userId)) {
  // Fetch for uid of this username
  const userRefForUId = ref(db, `user_uname/${userId}`);
  const usernameDataSnapshot = await get(userRefForUId);
  if(usernameDataSnapshot.exists()) {
    userId = usernameDataSnapshot.val().uid;
  }else {
    alert("Invalid username or user id..!!");
    window.location.replace('/dashboard');
  }
}

if(userId) {

  // Check authentication state
  onAuthStateChanged(auth, (user) => {
      if (user) {
          const currentUserId = user.uid;
          
          if (userId === currentUserId) {
              // If user_id matches, redirect to dashboard.html
              window.location.href = "dashboard";
          }
      }
  });

  const userRef = ref(db, `users/${userId}`);
  const userDataSnapshot = await get(userRef);

  if (userDataSnapshot.exists()) {

    const userData = userDataSnapshot.val();

    // Update profile page with user data
    document.getElementById("user-name").textContent = userData.username;
    document.getElementById("user-email").textContent = userData.email;
    document.getElementById("joined-date").textContent = formatISODate(userData.createdAt);
    document.getElementById("user-photo").src = userData.profile_picture;

    // Change the title according user
    document.title = `Roovix Profile · ${userData.username}`;

    // Make a profile share link for current user
    document.getElementById("share-link-text").textContent = `https://roovix.com?profile=${userData.username}`;

    // Fetch user role
    document.getElementById("profile-role").textContent = userData.role.value; 


    // fetch for user post 
    let postsHTML = ``;
    const userPosts = userData.posts;

    // Ensure userPosts is an array
    if (Array.isArray(userPosts)) {
        userPosts.forEach((post) => {
            postsHTML += `
            <li>
                <a href="/hub.html?article_id=${post.post_id}" class="container">
                    <div class="right">
                        <span class="title">${post.title}</span>
                        <span class="upload-date">${ISoToTimeAgo(post.date)}</span>
                    </div>
                </a>
            </li>
            `;
        });
    } else if (userPosts && typeof userPosts === 'object') {
        // If it's an object, convert it to an array
        const postsArray = Object.values(userPosts);
        postsArray.forEach((post) => {
            postsHTML += `
            <li>
                <a href="/hub.html?article_id=${post.post_id}" class="container">
                    <div class="right">
                        <span class="title">${post.title}</span>
                        <span class="upload-date">${ISoToTimeAgo(post.date)}</span>
                    </div>
                </a>
            </li>
            `;
        });
    } else {
        postsHTML = `
        <div class="no-post-container">
            <div id="no-post-icon" class="icon"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h360v80H200v560h560v-360h80v360q0 33-23.5 56.5T760-120H200Zm120-160v-80h320v80H320Zm0-120v-80h320v80H320Zm0-120v-80h320v80H320Zm360-80v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/></svg></div>
            <span>No post available</span>
          </div>
        `;
    }            
    document.getElementById("posts-list").innerHTML = postsHTML;
    
    
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

    // Show projects list
    const projectList = document.getElementById("project-content-list");
    if(userData.projects) {
        let projects = userData.projects;
        let projectHtml = ``;

        // Loop inside projects to fetch project one by one
        projects.forEach((project)=>{
            projectHtml += `
                <a href="${project.url}" class="content-item">
                    <div class="content-thumbnail">
                        <img src="image_assets/success_right.webp" alt="">
                    </div>
                    <div class="content-details">
                        <div class="content-title">${project.title}</div>
                        <div class="content-tags">${project.tag_line}</div>
                    </div>
                    <div class="content-time">${ISoToTimeAgo(project.date)}</div>
                </a>
            `;
        });
        projectList.innerHTML = projectHtml;
    }else {
        projectList.innerHTML = `<span class="no-project-source-found">No sources found..!!</span>`;
    }
    
  }else {
    alert("User data not found");
  }
}else{
  alert("User ID not provided, Invalid url..!");
}


// open post popup
const openPostBtn = document.getElementById("open-posts");
const postPopupBg = document.getElementById("post-container-bg");
const popupCloseBtn = document.getElementById("post-popup-close-btn");
openPostBtn.addEventListener("click", ()=> {
  if(postPopupBg.style.display === 'none') {
    postPopupBg.style.display = 'flex';
  }else {
    postPopupBg.style.display = 'none';
  }
})
popupCloseBtn.addEventListener("click", ()=> {
  if(postPopupBg.style.display === 'none') {
    postPopupBg.style.display = 'flex';
  }else {
    postPopupBg.style.display = 'none';
  }
})
postPopupBg.addEventListener("click", ()=> {
  postPopupBg.style.display = 'none';
})
document.querySelector(".post-container").addEventListener("click", (e)=>{
  e.stopPropagation();
});
