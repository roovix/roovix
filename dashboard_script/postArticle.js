import { auth, db } from "https://www.roovix.com/config/firebase_config.js";
import { ref, set, push, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { deletePopup, confirmPopup, noticePopup, addPopupStyles } from "https://element.roovix.com/functions/popups.js";


function getYouTubeVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Add params of post-article=true when click what is on your mind
document.getElementById('open-add-new-post').addEventListener('click', function() {
    // Get the current URL
    const currentUrl = new URL(window.location);

    // Create a URLSearchParams object from the current query string
    const params = new URLSearchParams(currentUrl.search);

    // Add the 'post-article=true' parameter
    params.set('post-article', 'true');

    // Update the URL with the new query string
    currentUrl.search = params.toString();

    // Update the browser's URL (without reloading the page)
    window.history.replaceState({}, '', currentUrl);

    // Update the page
    window.location.reload();
});

// Check for url params to get post upload ui displayed
const currentUrlParams = new URLSearchParams(window.location.search);
const postArticleState = currentUrlParams.get('post-article');
if(postArticleState === "true") {
    document.querySelector("body").style.overflowY = "hidden";
    document.getElementById("article-post-bg").style.display = "flex";
}else {
    document.querySelector("body").style.overflowY = "auto";
    document.getElementById("article-post-bg").style.display = "none";
}

function removePostParamAndReload() {
    // Get the current URL
    const currentUrl = new URL(window.location);

    // Remove all query parameters
    currentUrl.search = ''; // This clears the query string

    // Update the URL without reloading the page
    window.history.replaceState({}, '', currentUrl);

    // Update the page
    window.location.reload();
}

document.getElementById('post-cancel-btn').addEventListener('click', function() {
    removePostParamAndReload();
});


document.getElementById("post-btn").addEventListener("click", async () => {
    document.getElementById("post-btn").textContent = "Posting";

    const title = document.getElementById("post-title").value.trim();
    const tags = document.getElementById("post-tags").value.trim();
    const videoUrl = document.getElementById("post-video").value.trim();
    const description = document.getElementById("textarea").value.trim();
    const errorMsg = document.getElementById("error-message");
    const videoId = getYouTubeVideoId(videoUrl);

    let errors = [];
    if (!title) errors.push("Title cannot be empty.");
    if (!tags) errors.push("Tags cannot be empty.");
    if (!description) errors.push("Description cannot be empty.");
    if (videoUrl && !videoId) errors.push("Invalid YouTube video link.");

    if (errors.length > 0) {
        errorMsg.textContent = errors.join(" \n ");
        errorMsg.style.display = "block";
        setTimeout(() => {
            errorMsg.textContent = "";
            errorMsg.style.display = "none";
        }, 6000);
        return;
    } else {
        errorMsg.style.display = "none";
    }

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userRef = ref(db, `users/${user.uid}`);
            const userSnapshot = await get(userRef);
            const userPostRef = push(ref(db, `users/${user.uid}/posts`));

            if (userSnapshot.exists()) {
                const userData = userSnapshot.val();
                if (userData.role === "admin" || userData.verified) {
                    const postRef = push(ref(db, "posters"));
                    const postPushKey = postRef.key;
                    const tagsArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag);
                    let tagsObject = {};
                    tagsArray.forEach((tag, index) => {
                        tagsObject[index + 1] = tag;
                    });

                    await set(postRef, {
                        content: {
                            title: title,
                            description: description,
                            tags: tagsObject,
                            video: videoId ? {
                                is_available: true,
                                title: "YouTube video player",
                                video_id: videoId,
                            } : {
                                is_available: false,
                            }
                        },
                        uploader: {
                            upload_date: new Date().toISOString(),
                            sponsored: false,
                            uid: user.uid,
                        }
                    });
                    
                    // Push new post data in user metadata
                    await set(userPostRef, {
                        post_id: postPushKey,
                        title: title,
                        date: new Date().toISOString()
                    });
                    
                    // confirm popup on successful upload
                    let successPopup  = confirmPopup(
                        "Uploaded",
                        "You just uploaded a new article post by your account.",

                        ()=>{
                            document.getElementById("popup_container").style.display = "none";
                            removePostParamAndReload();
                        },
                        ()=>{
                            document.getElementById("popup_container").style.display = "none";
                            removePostParamAndReload();
                        },
                        document.getElementById("popup_container")
                    )

                    document.getElementById("post-btn").textContent = "Post";
                    document.getElementById("popup_container").style.display = "flex";
                    document.getElementById("popup_container").appendChild(successPopup);

                } else {
                    let notice  = noticePopup(
                        "Error",
                        "You do not have permission to upload articles.",

                        ()=>{
                            document.getElementById("popup_container").style.display = "none";
                            removePostParamAndReload();
                        },
                        ()=>{
                            document.getElementById("popup_container").style.display = "none";
                            removePostParamAndReload();
                        },
                        document.getElementById("popup_container")
                    )

                    document.getElementById("popup_container").style.display = "flex";
                    document.getElementById("popup_container").appendChild(notice);
                }
            }
        } else {
            let notice  = noticePopup(
                "Error",
                "You must be signed in to post articles.",

                ()=>{
                    window.location.href = "/login";
                },
                ()=>{
                    document.getElementById("popup_container").style.display = "none";
                    removePostParamAndReload();
                },
                document.getElementById("popup_container")
            )

            document.getElementById("popup_container").style.display = "flex";
            document.getElementById("popup_container").appendChild(notice);
        }
    });
});


document.addEventListener("DOMContentLoaded", ()=>{
    // Add styles to popups
    addPopupStyles();
});
