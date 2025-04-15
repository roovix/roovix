import { auth, db } from "https://www.roovix.com/config/firebase_config.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getDomain, formatISODate, ISoToTimeAgo } from "https://element.roovix.com/functions/app.js";
import { deletePopup, confirmPopup, noticePopup } from "https://element.roovix.com/functions/popups.js";



document.addEventListener("DOMContentLoaded", () => {
    // Wait for authentication state
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            // Redirect to login page if not logged in
            window.location.href = "login";
            return;
        }


        // Fetch user data from Firebase Realtime Database
        const userRef = ref(db, `users/${user.uid}`);
        try {
            const userData = await get(userRef);
            const userInfo = userData.val();

            // Change the page title with user name
            document.title = `Roovix - ${userInfo.username}`;

            // Update user information in the DOM
            document.getElementById("user-name").textContent = userInfo.username;
            document.getElementById("user-email").textContent = userInfo.email;
            document.getElementById("user-photo").src = userInfo.profile_picture;
            document.getElementById("joined-date").textContent = `Joined - ${formatISODate(userInfo.createdAt)}`;
            document.getElementById('post-user-image').src = userInfo.profile_picture;

            // Fetch user role
            document.getElementById("profile-role").textContent = userInfo.role.value; 

            // Update user data for edit profile
            document.getElementById("uname").value = userInfo.username;
            document.getElementById("intro").value = userInfo.bio;
            document.getElementById("interests").value = userInfo.interests;
            document.getElementById("skills").value = userInfo.skills;

            // fetch for user post 
            let postsHTML = ``;
            const userPosts = userInfo.posts;

            // Ensure userPosts is an array
            if (Array.isArray(userPosts)) {
                userPosts.forEach((post) => {
                    postsHTML += `
                    <li>
                        <a href="/hub?article_id=${post.post_id}" class="container">
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
                        <a href="/hub?article_id=${post.post_id}" class="container">
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

            // Fetch user bio
            if(userInfo.bio) {
                document.getElementById("bio-content").textContent = userInfo.bio;
            }else {
                document.getElementById("bio-content").textContent = "No intro provided.";
            }

            // Check for suer verified
            if(userInfo.verified) {
                document.querySelector(".verified-badge").classList.remove('unverified');
                document.querySelector(".avatar-img").classList.remove('unverified');
            }else{
                document.querySelector(".avatar-img").classList.add('unverified');
                document.querySelector(".verified-badge").classList.add('unverified');
            }

            // Make a profile share link for current user
            document.getElementById("share-link-text").textContent = `https://roovix.com?profile=${userInfo.username}`;

            // Update user profile pic in navbar
            document.getElementById("profile-picture-on-dashboard-nam").src = userInfo.profile_picture;
            document.getElementById("profile-picture-on-market-nam").src = userInfo.profile_picture;
            document.getElementById("profile-picture-on-settings-nam").src = userInfo.profile_picture;
            document.getElementById("profile-picture-on-support-nam").src = userInfo.profile_picture;
            

            // Show interests and skills
            const interestsList = document.getElementById('interests-list');
            const skillsList = document.getElementById('skills-list');
            
            let interestsData = userInfo.interests;
            let skillsData = userInfo.skills;

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
            if(userInfo.links) {
                let linksData = userInfo.links;
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
            if(userInfo.projects) {
                let projects = userInfo.projects;
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
            
        } catch (error) {
            let notice  = noticePopup(
                "Error getting user",
                `${error.message} or Please signed in?`,

                ()=>{
                    window.location.href = "/login"
                    document.getElementById("popup_container").style.display = "none";
                },
                ()=>{
                    document.getElementById("popup_container").style.display = "none";
                },
                document.getElementById("popup_container")
            )

            document.getElementById("popup_container").style.display = "flex";
            document.getElementById("popup_container").appendChild(notice);
        }
    });
});
