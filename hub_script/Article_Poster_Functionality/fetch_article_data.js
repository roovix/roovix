const poster_container = document.getElementById('poster-results');
import { auth, db } from "https://www.roovix.com/config/firebase_config.js";
import { ref, set, get, onValue, child, update, remove, push, limitToFirst, query, orderByKey, startAfter } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Function to get the current user
function getCurrentUser() {
    const getCurrentUserUid = auth.currentUser;
    if(!getCurrentUserUid) {
        return { uid: null };
    }else{
        return getCurrentUserUid;
    }
}

// Click listener for share button
document.addEventListener("click", function (event) {
    const button = event.target.closest(".share-container"); // Target specific share button
    if (button) {
        const articleElement = button.closest(".action-1").querySelector(".comment-container");
        const articleId = articleElement ? articleElement.getAttribute("data-article-id") : null;

        if (articleId) {
            shareContent(`Stay Ahead of the Curve with Roovix's Latest Insights!`, `/hub?article_id=${articleId}`, articleId);
        }
    }

    // Check for uploader name click
    const uploaderName = event.target.closest(".name-container");
    if (uploaderName) {
        const uploader_name = uploaderName.querySelector(".uploader-name");
        let user_uid = uploader_name.getAttribute("data-user-id");
        if(getCurrentUser().uid === user_uid){
            window.location.href = `/dashboard?user_id=${user_uid}`;
        }else{
            window.location.href = `/view-profile?user_id=${user_uid}`;
        }
    }
});

// Share Function
function shareContent(title, url, articleId) {
    if(getCurrentUser().uid) {
        if (navigator.share) {
            navigator.share({ title: title, url: url })
                .then(() => {
                    // Save share data to database
                    saveToDatabase(getCurrentUser().uid, articleId);
                })
                .catch((error) => console.error("Error sharing:", error));
        } else {
            alert("Sharing is not supported on this browser.");
        }
    }else{
        // Open login page because user not signed in
        window.location.href = "/login";
    }
}


async function saveToDatabase(uid, articleId) {
    // Use push to add data to a new entry under 'shares' for that article
    const sharesRef = ref(db, `posters/${articleId}/shares`);  // Define the correct path for 'shares'
    await push(sharesRef, {
        userId: uid,
        timestamp: new Date().toISOString()
    });
}


function timeAgo(isoString) {
    const now = new Date();
    const past = new Date(isoString);
    const seconds = Math.floor((now - past) / 1000);

    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }
    }
    return "Just now";
}

// Function to generate article posters
function generatePosters(poster, data_key){
        let poster_HTML = `
                <div class="poster-bg" id="poster-${data_key}">
                    <div class="header">
                    <div class="uploader">
                            <div class="container-left">
                                <div class="logo">
                                    <img src="${poster.uploader.profile_picture}" alt="Uploader Profile Picture">
                                </div>
                                <div class="details">
                                    <div class="name-container">
                                        <span data-user-id="${poster.uploader.uid}" class="name uploader-name">${poster.uploader.username}</span>
                                        ${checkUploaderBadge()}
                                    </div>
                                    
                                    ${checkSponsoredWithUploadDate()}

                                </div>
                            </div>
                            <div class="container-right">
                                <svg class="dot-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M222.72-391.52q-36.63 0-62.68-25.99Q134-443.5 134-480q0-36.96 25.99-62.72 25.99-25.76 62.49-25.76 36.73 0 62.88 25.76 26.16 25.76 26.16 62.44 0 36.67-26.08 62.72-26.09 26.04-62.72 26.04Zm257.56 0q-36.67 0-62.72-25.99-26.04-25.99-26.04-62.49 0-36.96 25.99-62.72 25.99-25.76 62.49-25.76 36.96 0 62.72 25.76 25.76 25.76 25.76 62.44 0 36.67-25.76 62.72-25.76 26.04-62.44 26.04Zm257.4 0q-36.79 0-63-25.99-26.2-25.99-26.2-62.49 0-36.96 26.2-62.72 26.21-25.76 63-25.76 36.8 0 62.56 25.76Q826-516.96 826-480.28q0 36.67-25.76 62.72-25.76 26.04-62.56 26.04Z"/></svg>
                            </div>
                        </div>
                    </div>
                    <div class="content">
                        <div class="content-header">
                            <span class="title">${poster.content.title}</span>
                            
                            <span class="tags"> ${fetchRagsFromDb()}</span>
                        </div>
                        <div class="content-body">

                        ${checkVideoIsAvailable()}
                            
                            <div class="content-description">
                                <span class="description" id="description">
                                    ${processContent(poster.content.description)}
                                </span>
                                <div class="see_more_button_bg">
                                    <a href="#" class="no-actions-in-this-see-more-in-future-will-be-update"></a>
                                </div>
                            </div>

                        </div>
                        <div class="content-footer">
                        
                        ${comment_ui(data_key)}

                            <!-- Files download section functionality -->
                            ${filesForPoster()}

                        </div>
                    </div>
                </div>
    `;

    // Code block functionality start
    function processContent(content) {
        // Split the content by code blocks (delimited by triple backticks)
        const contentParts = content.split('```');
        
        let processedContent = '';
        
        contentParts.forEach((part, index) => {
            if (index % 2 === 0) {
                // Process image links inside ```` (double backticks)
                part = part.replace(/``(.*?)``/g, (match, p1) => {
                    return `<img class="image-block" src="${p1.trim()}" alt="Roovix Article Image">`;
                });
                
                processedContent += part;
            } else {
                const code = part.trim();
                if (code) {
                    const firstWord = code.split(' ')[0];
                    const codeWithoutLanguage = code.substring(firstWord.length).trim();
                    
                    processedContent += `
                        <div class="code-block">
                            <div class="action">
                                <span class="code-name">${firstWord}</span>
                                <button class="copy-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                        <path d="M379.78-233.78q-44.3 0-75.15-30.85-30.85-30.85-30.85-75.15v-466.44q0-44.3 30.85-75.15 30.85-30.85 75.15-30.85h346.44q44.3 0 75.15 30.85 30.85 30.85 30.85 75.15v466.44q0 44.3-30.85 75.15-30.85 30.85-75.15 30.85H379.78Zm0-106h346.44v-466.44H379.78v466.44Zm-186 292q-44.3 0-75.15-30.85-30.85-30.85-30.85-75.15v-572.44h106v572.44h452.44v106H193.78Zm186-292v-466.44 466.44Z"/>
                                    </svg> <span class="copy-btn-text">Copy code</span>
                                </button>
                            </div>
                            <pre class="line-numbers"><code class="language-${firstWord} code">${codeWithoutLanguage}</code></pre>
                        </div>
                    `;
                }
            }
        });
        
        return processedContent;
    }                
    // Function to copy code to clipboard
    function copyCode(event) {
        const codeElement = event.target.closest('.code-block').querySelector('.code');
        const copyBtnText = event.target.closest('.code-block').querySelector('.copy-btn-text');
        const textToCopy = codeElement.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyBtnText.textContent = "Copied";
            setTimeout(() => {
                copyBtnText.textContent = "Copy code";
            }, 1000);
        }).catch(err => {
            console.log("Failed to copy!");
        });
    }

    // Function to add event listeners to all copy buttons
    function addCopyListeners() {
        // Delegate event listener to the parent container of the copy buttons
        document.addEventListener('click', function(event) {
            if (event.target.closest('.copy-btn')) {
                copyCode(event);
            }
        });
    }

    // Add copy code btn event listener
    addCopyListeners();
    // Code block function end


    // Check for uploader badge start
    function checkUploaderBadge() {
        let badge_HTML = ``;
        if(poster.uploader.verified){
            badge_HTML = `<span class="badge"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm94-278 226-226-56-58-170 170-86-84-56 56 142 142Z"/></svg></span>`;
        }

        return badge_HTML;
    }
    // Check for uploader badge end


    // Check for video is available start
    function checkVideoIsAvailable() {
        let video_HTML = ``;
        if(poster.content.video.is_available){
            video_HTML = `
                <div class="video">
                    <iframe width="100%" class="video-frame"
                        src="https://www.youtube.com/embed/${poster.content.video.video_id}"
                        title="${poster.content.video.title}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            `;
        }

        return video_HTML;
    }
    // Check for video is available end


    // Files functionality start

    function filesForPoster() {
        if (poster.files) {
            let files_show = '';

            // Loop through the `poster.files` object to create download links for each file
            for (const file_key in poster.files) {
                const file = poster.files[file_key];

                // Create the file download link
                const file_tag = document.createElement("a");
                file_tag.href = file.file_link;

                if(file.download){
                    file_tag.download = file.file_name; // Add download attribute
                }

                // Create the file tag content with the name and download icon
                file_tag.innerHTML = `
                    <span>${file.file_name}</span> 
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                        <path d="M480-326.78 252.87-553.91l74.65-75.53L427-529.39v-289.83h106v289.83l99.48-100.05 74.65 75.53L480-326.78Zm-233.22 186q-44.3 0-75.15-30.85-30.85-30.85-30.85-75.15v-120h106v120h466.44v-120h106v120q0 44.3-30.85 75.15-30.85 30.85-75.15 30.85H246.78Z"/>
                    </svg>
                `;

                // Append the file link to the `files_show` string
                files_show += file_tag.outerHTML;
            }

            // Base structure for the file section
            const files_HTML = `
                <div class="action-2">
                    <div class="title">
                        <h1>Files</h1>
                        <div class="file-section-underline">________________________________________________________</div>
                    </div>
                    <div id="files-container" class="files">
                        ${files_show}  <!-- This will be populated with actual file links -->
                    </div>
                </div>
            `;

            // Optionally, return the final HTML if you need to use it elsewhere
            
            return files_HTML;
        }else {
            return '';
        }
    }            

    // Files functionality end


    // Comment ui start
    function comment_ui(data_key) {
        let comment_HTML = ``;
        let total_comments = 0;

        // Loop to count total comment
        for(const comment_key in poster.comments) {
            const comment = poster.comments[comment_key];

            // Update the comment count
            total_comments += 1;
        }

        comment_HTML = `
            <div class="action-1">
                <div data-article-id="${data_key}" class="comment-container">
                    <div class="comment-count">
                        <span>${total_comments}</span>
                        <span>Comments</span>
                    </div>
                    <svg class="comment-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M912.22-45.52 747.13-210.61h-411.3q-44.31 0-75.16-30.85-30.84-30.84-30.84-75.15v-40h430.39q44.3 0 75.15-30.85 30.85-30.84 30.85-75.15v-269.26h40q44.3 0 75.15 30.85 30.85 30.85 30.85 75.15v580.35ZM153.78-522.18l20.44-20.43h406v-265.87H153.78v286.3Zm-106 254.05v-540.35q0-44.3 30.85-75.15 30.85-30.85 75.15-30.85h426.44q44.3 0 75.15 30.85 30.85 30.85 30.85 75.15v265.87q0 44.31-30.85 75.15-30.85 30.85-75.15 30.85h-363.4L47.78-268.13Zm106-274.48v-265.87 265.87Z"/></svg>
                </div>
                <div class="share-container">
                    <svg class="share-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M682.23-60.78q-57.32 0-97.4-39.95-40.09-39.94-40.09-97.01 0-5.43 2.43-22.91L285.39-372.78q-17.69 14.43-39.77 22.65-22.08 8.22-47.32 8.22-57.3 0-97.41-40.24t-40.11-97.72q0-57.48 40.11-97.85t97.41-40.37q25.13 0 47.83 8.5t40.96 23.5l259.52-151q-1.44-5.87-1.65-12.08-.22-6.22-.22-12.53 0-57.3 40.12-97.41t97.43-40.11q57.32 0 97.41 40.12 40.08 40.12 40.08 97.44 0 57.31-40.11 97.4t-97.41 40.09q-26.47 0-49.62-9.07-23.16-9.06-41.42-25.19L333.96-509.7q2 7.6 2.5 14.65.5 7.05.5 15.33 0 8.29-.79 15.92-.78 7.63-2.78 15.19l256.7 148.74q18.26-16.7 41.78-26.33 23.51-9.63 50.39-9.63 57.3 0 97.41 40.24t40.11 97.72q0 57.48-40.12 97.28-40.12 39.81-97.43 39.81Zm-.32-100.35q15.66 0 26.59-10.7t10.93-26.52q0-15.82-10.85-26.48-10.85-10.65-26.88-10.65-15.56 0-26.09 10.94-10.52 10.93-10.52 26.24 0 15.3 10.58 26.23 10.59 10.94 26.24 10.94ZM198.35-442.26q15.82 0 27.04-10.82 11.22-10.81 11.22-26.8t-11.22-26.92q-11.22-10.94-27.04-10.94-15.82 0-26.52 10.82-10.7 10.81-10.7 26.8t10.7 26.92q10.7 10.94 26.52 10.94Zm483.91-282.26q15.31 0 25.96-10.59t10.65-26.24q0-15.65-10.59-26.58-10.59-10.94-26.24-10.94-15.65 0-26.58 10.85-10.94 10.85-10.94 26.89 0 15.56 11.22 26.08 11.22 10.53 26.52 10.53Zm.57 526.22ZM198.87-480Zm483.39-281.7Z"/></svg>
                </div>
            </div>
        `;

        return comment_HTML;
    }
    // Comment ui end


    // Comments section start

    // Add event listener to dynamically handle button clicks
    document.addEventListener('click', function (event) {
        if (event.target.closest('.comment-container')) {
            const articleId = event.target.closest('.comment-container').dataset.articleId;
            openAndFetchComments(articleId);
        }
    });

    /**
     * Fetches and displays comments for a specific article
     * @param {string} article_id - The ID of the article to fetch comments for
     */
    async function openAndFetchComments(article_id) {
        try {
            // Show comment UI
            document.getElementById('comment-view-bg').style.display = 'block';
            document.querySelector('.main-body').classList.add('comment-ui-active');
            
            // Clear previous comments and show loading state
            document.querySelector('#comment-view').innerHTML = `
                <div class="comments-loading">
                    <p>Loading comments...</p>
                </div>
            `;

            const commentsRef = ref(db, `posters/${article_id}/comments`);
            const commentsSnapshot = await get(commentsRef);

            // Prepare the base comment section HTML that will always be shown
            const commentSectionHTML = `
                <div class="comment-header">
                    <div class="comment-title-bg">
                        <span id="comments-count">0 Comments</span>
                    </div>
                    <div class="comment-send-bg">
                        <input maxlength="2500" autocomplete="off" type="text" 
                            id="comment-input" placeholder="Write a comment...">
                        <button id="comment-send-btn">Comment</button>
                    </div>
                </div>
                <div id="comment-list"></div>
            `;

            // Set up the comment UI structure
            document.querySelector('#comment-view').innerHTML = commentSectionHTML;

            // Handle empty comments case
            if (!commentsSnapshot.exists()) {
                document.getElementById('comment-list').innerHTML = `
                    <div class="no-comments">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <p>No comments yet</p>
                        <p class="subtext">Be the first to share your thoughts!</p>
                    </div>
                `;
            } else {
                // Process and display comments
                const comments = commentsSnapshot.val();
                let commentsHTML = "";
                let commentCount = 0;

                for (const comment_key in comments) {
                    const commentData = comments[comment_key];
                    commentCount++;
                    
                    try {
                        const commentByRef = ref(db, `users/${commentData.comment_by}`);
                        const userSnapshot = await get(commentByRef);
                        const userData = userSnapshot.val();

                        commentsHTML += `
                            <div class="comments-item">
                                <div class="comment-user-bg">
                                    <img src="${userData?.profile_picture || 'default-user.png'}" 
                                        alt="${userData?.username || 'User'} profile picture"
                                        onerror="this.src='default-user.png'">
                                </div>
                                <div class="comment-content">
                                    <div class="comment-by">
                                        <a href="view-profile?user_id=${commentData.comment_by}" 
                                        class="comment-username">
                                            @${userData?.username || 'Unknown User'}
                                        </a>
                                        <span class="comment-time-ago">${timeAgo(commentData.date)}</span>
                                    </div>
                                    <div class="comment-text">
                                        <span>${commentData.comment}</span>
                                        <div class="comment-actions">
                                            <button class="like-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                                    <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                                                </svg>
                                            </button>
                                            <button class="reply-btn">Reply</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    } catch (error) {
                        console.error("Error fetching user data:", error);
                        // Fallback comment display if user data fails to load
                        commentsHTML += `
                            <div class="comments-item">
                                <div class="comment-user-bg">
                                    <img src="default-user.png" alt="User profile picture">
                                </div>
                                <div class="comment-content">
                                    <div class="comment-text">
                                        <span>${commentData.comment}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                }

                // Update comments count and list
                document.getElementById('comments-count').textContent = `${commentCount} ${commentCount === 1 ? 'Comment' : 'Comments'}`;
                document.getElementById('comment-list').innerHTML = commentsHTML;
            }

            // Attach event listeners
            document.getElementById('comment-send-btn').addEventListener('click', () => postComment(article_id));
            
            // Input change listener for UI animation
            const commentInput = document.getElementById('comment-input');
            const commentBtn = document.getElementById('comment-send-btn');
            
            commentInput.addEventListener('input', (e) => {
                commentBtn.classList.toggle('active', e.target.value.trim() !== "");
            });
            
            // Focus the input field when comments load
            commentInput.focus();

        } catch (error) {
            console.error("Error fetching comments:", error);
            document.querySelector('#comment-view').innerHTML = `
                <div class="comments-error">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p>Failed to load comments</p>
                    <button class="retry-btn" onclick="openAndFetchComments('${article_id}')">Try Again</button>
                </div>
            `;
        }
    }

    // Hide the comment section UI
    document.getElementById('close-comment-view').addEventListener('click', () => {
        document.getElementById('comment-view-bg').style.display = 'none';  
        document.querySelector('.main-body').classList.remove('comment-ui-active');            
    });

    // Post a new comment
    async function postComment(article_id) {
        const commentInput = document.getElementById('comment-input');
        const commentText = commentInput.value.trim();

        if (!commentText) return;

        try {
            // Disable the button during submission
            const commentBtn = document.getElementById('comment-send-btn');
            commentBtn.disabled = true;
            commentBtn.textContent = 'Posting...';

            const currentUID = getCurrentUser();
            const userId = currentUID.uid;
            const userRef = ref(db, `users/${userId}`);
            const userSnapshot = await get(userRef);
            const userData = userSnapshot.val();

            if (!userData) {
                window.location.href = '/login';
                return;
            }

            const newCommentKey = push(child(ref(db), `posters/${article_id}/comments`)).key;
            const commentData = {
                comment: commentText,
                comment_by: userId,
                date: new Date().toISOString(),
            };

            const updates = {};
            updates[`posters/${article_id}/comments/${newCommentKey}`] = commentData;

            await update(ref(db), updates);

            // Check if we're currently showing the "no comments" state
            const noCommentsElement = document.querySelector('.no-comments');
            if (noCommentsElement) {
                // Remove the "no comments" UI
                noCommentsElement.remove();
                
                // Initialize an empty comments list if needed
                if (document.getElementById('comment-list').children.length === 0) {
                    document.getElementById('comment-list').innerHTML = '';
                }
            }

            // Add the new comment to the UI
            const commentHTML = `
                <div class="comments-item new-comment">
                    <div class="comment-user-bg">
                        <img src="${userData.profile_picture || 'default-user.png'}" 
                            alt="${userData.username || 'User'} profile picture"
                            onerror="this.src='default-user.png'">
                    </div>
                    <div class="comment-content">
                        <div class="comment-by">
                            <a href="view-profile?user_id=${userId}" class="comment-username">
                                @${userData.username || 'Unknown User'}
                            </a>
                            <span class="comment-time-ago">Just now</span>
                        </div>
                        <div class="comment-text">
                            <span>${commentData.comment}</span>
                            <div class="comment-actions">
                                <button class="like-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                        <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                                    </svg>
                                </button>
                                <button class="reply-btn">Reply</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Add new comment at the top of the list
            document.getElementById('comment-list').insertAdjacentHTML('afterbegin', commentHTML);

            // Update comments count
            const commentsCountElement = document.getElementById('comments-count');
            const currentCount = parseInt(commentsCountElement.textContent) || 0;
            commentsCountElement.textContent = `${currentCount + 1} ${currentCount + 1 === 1 ? 'Comment' : 'Comments'}`;

            // Clear input field and reset button
            commentInput.value = "";
            commentBtn.disabled = false;
            commentBtn.textContent = 'Comment';
            commentBtn.classList.remove('active');

            // Highlight the new comment temporarily
            const newComment = document.querySelector('.new-comment');
            if (newComment) {
                newComment.style.animation = 'highlight 2s';
                setTimeout(() => {
                    newComment.classList.remove('new-comment');
                    newComment.style.animation = '';
                }, 2000);
            }

        } catch (error) {
            console.error("Error posting comment:", error);
            alert("Failed to post comment. Please try again.");
            document.getElementById('comment-send-btn').disabled = false;
            document.getElementById('comment-send-btn').textContent = 'Comment';
        }
    }
    // Comments section end



    // Check sponsored with upload date start
    function checkSponsoredWithUploadDate(){
        let sponsored_HTML = ``;

        if(poster.uploader.sponsored) {
            sponsored_HTML = `
                <div class="upload-date-container">
                    <span class="upload-date-sponsore">
                        <span class="upload-date">${timeAgo(poster.uploader.upload_date)}</span>
                        <span class="upload-sponsored">Sponsored</span>
                    </span>
                    <span class="world-icon">
                        <i class="fa-solid fa-earth-asia"></i>
                    </span>
                </div>   
            `;
        }else {
            sponsored_HTML = `
            <div class="upload-date-container">
                <span class="upload-date-sponsore">
                    <span class="upload-date">${timeAgo(poster.uploader.upload_date)}</span>
                </span>
            </div>   
        `;
        }

        return sponsored_HTML;
    }
    // Check sponsored with upload date end


    // Fetch tags from db start
    function fetchRagsFromDb() {
        let tags_HTML = ``;

        // loops for fetch tags one by one
        for(const tag_id in poster.content.tags) {
            const tag = poster.content.tags[tag_id];
            
            const createTagEL = document.createElement('span');
            createTagEL.classList.add('tag');
            createTagEL.textContent = `#${tag}`;

            tags_HTML += createTagEL.outerHTML;
        }

        return tags_HTML;
    }
    // Fetch tags from db end


    // Append the poster on the container
    poster_container.innerHTML += poster_HTML;
}

// On load fetch posters
let lastFetchedKey = null; // Store the last fetched poster key to fetch the next 10 posters
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const articlesRef = ref(db, 'posters');

        // Initially hide the end of article view
        document.getElementById("end-of-article").style.display = "none";
        
        // Set a limit for the number of posters to load (for example, 10)
        const limit = 10;

        // Fetch the first 10 posters
        await fetchPosters(limit);

    } catch (error) {
        console.error('Error fetching posters:', error);
    } finally {
        // Hide the searching animation and show the end of article view
        document.getElementById("searching_anim").style.display = "none";
        document.getElementById("end-of-article").style.display = "flex";
    }
});

// Function to fetch posters
async function fetchPosters(limit) {
    try {
        const articlesRef = ref(db, 'posters');
        
        // If we have previously fetched a key, start from there to fetch the next 10 posts
        let limitedArticlesRef = articlesRef;
        if (lastFetchedKey) {
            limitedArticlesRef = query(articlesRef, orderByKey(), startAfter(lastFetchedKey), limitToFirst(limit));
        } else {
            limitedArticlesRef = query(articlesRef, limitToFirst(limit));
        }

        // Fetch the data
        const snapshot = await get(limitedArticlesRef);
        if (!snapshot.exists()) {
            console.log("No more articles available!");
            document.getElementById("end-of-article").style.display = "none";
            return;
        }

        const article_data = snapshot.val();
        const total_posts = Object.keys(article_data).length;
        
        let posters_loaded = 0;

        // Check for an article id in URL params
        const poster_id_on_url = new URLSearchParams(window.location.search).get('article_id');
        if (poster_id_on_url) {
            // Fetch and display the specific poster
            generatePosters(article_data[poster_id_on_url], poster_id_on_url);
            Prism.highlightAll();
            // Prevent further posters from being loaded if article_id exists in the URL
            document.getElementById("end-of-article").innerHTML = `<a href="/hub">View More Articles</a>`; // Hide the end view
        } else {
            // Fetch and display the limited number of posters
            for (const data_key in article_data) {
                if (article_data.hasOwnProperty(data_key)) {
                    const poster = article_data[data_key];
                    generatePosters(poster, data_key);
                    posters_loaded += 1;
                }
            }

            // Update the last fetched key for pagination
            lastFetchedKey = Object.keys(article_data)[posters_loaded - 1];

            // Apply code syntax highlighting for code blocks
            Prism.highlightAll();
        }

    } catch (error) {
        console.error('Error fetching posters:', error);
    }
}

// Function to check if the end of the article is in view
function checkEndIfInView() {
    const endOfArticleViewTarget = document.getElementById('end-of-article');
    const rect = endOfArticleViewTarget.getBoundingClientRect();
    
    // Check if the element is fully in the viewport
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        return true;
    }
    return false;
}

let isFetching = false;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !isFetching) {
            // If article_id exists, prevent further fetching
            const poster_id_on_url = new URLSearchParams(window.location.search).get('article_id');
            if (!poster_id_on_url) {
                isFetching = true; // Prevent multiple requests at the same time
                fetchPosters(10); // Fetch next 10 posters
                setTimeout(() => { isFetching = false; }, 2000); // Allow new fetch after 2 seconds
            }
        }
    });
}, { threshold: 1.0 });

// Start observing the end of article element
const endOfArticleViewTarget = document.getElementById('end-of-article');
observer.observe(endOfArticleViewTarget);
