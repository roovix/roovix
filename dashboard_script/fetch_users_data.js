import { auth, db } from "https://www.roovix.com/config/firebase_config.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";


function getFormattedDate() {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const date = new Date();
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}

function formatISODate(isoString) {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const date = new Date(isoString);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}

// On load
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
            
            // Update user information in the DOM
            document.getElementById("user-name").textContent = userInfo.username;
            document.getElementById("user-email").textContent = userInfo.email;
            document.getElementById("user-photo").src = userInfo.profile_picture;
            document.getElementById("joined-date").textContent = `Joined at - ${formatISODate(userInfo.createdAt)}`;
            
            if(userInfo.bio) {
                document.getElementById("bio-content").textContent = userInfo.bio;
            }else {
                document.getElementById("bio-content").textContent = "No intro provided.";
            }

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
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    });
});
