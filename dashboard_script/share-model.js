import { auth, db } from "https://www.roovix.com/config/firebase_config.js"; 
import { ref, get, update, set, remove } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { deletePopup, confirmPopup, noticePopup, addPopupStyles } from "https://element.roovix.com/functions/popups.js";



// Open model
document.getElementById("openProfileShareModel").addEventListener("click", function(){
    // Show the share UI (you'll need to implement this based on your UI structure)
    document.getElementById('share-model-bg').style.display = 'flex';
});

// Add event listener for close button
document.getElementById('closeShareUI').addEventListener('click', function() {
    // Hide the share UI (you'll need to implement this based on your UI structure)
    document.getElementById('share-model-bg').style.display = 'none';
});
document.getElementById('share-model-bg').addEventListener('click', function() {
    // Hide the share UI (you'll need to implement this based on your UI structure)
    document.getElementById('share-model-bg').style.display = 'none';
});

// Prevent background click from hiding modal
document.getElementById("share-modal").addEventListener('click', function(event) {
    event.stopPropagation(); // Stops the click event from reaching 'share-model-bg'
});

// Add event listener for copy button
document.getElementById('share-copy').addEventListener('click', function() {
    const linkText = document.querySelector('#share-link-text').textContent;
    navigator.clipboard.writeText(linkText)
        .then(() => {
            document.getElementById('copyBtn').textContent = 'Copied!';
            setTimeout(() => {
                document.getElementById('copyBtn').textContent = 'Copy Link';
            }, 2000);
        })
        .catch(err => {
            let notice  = noticePopup(
                "Failed to copy",
                `${err.message}`,

                ()=>{
                    document.getElementById("popup_container").style.display = "none";
                },
                ()=>{
                    document.getElementById("popup_container").style.display = "none";
                },
                document.getElementById("popup_container")
            )

            document.getElementById("popup_container").style.display = "flex";
            document.getElementById("popup_container").appendChild(notice);
        });
});


// Function to upload and get image url
async function uploadImageToCloudinary(file=null, api='391989329564552', image_preset='image_preset', folder='qr_code') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', image_preset);
    formData.append('folder', folder);
    formData.append('api_key', api);

    try {
        // Notify user to uploading
        document.getElementById("generate-qr-btn").textContent = "Uploading to Database"

        const response = await fetch('https://api.cloudinary.com/v1_1/dtmbjcbvi/image/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        throw error;
    }
}

async function uploadQrImageFromSrc(input) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(input)}&size=200x200`;

    try {
        // Notify user to generating
        document.getElementById("generate-qr-btn").textContent = "Generating Qr Code"
        // Fetch the image as a blob from the src URL
        const response = await fetch(qrUrl);
        const blob = await response.blob();

        // Convert it into a File object (so your function accepts it)
        const file = new File([blob], "qr-code.png", { type: blob.type });

        // Now upload using your Cloudinary function
        const uploadedUrl = await uploadImageToCloudinary(file);

        return uploadedUrl;
    } catch (error) {
        let notice  = noticePopup(
            "Error uploading qr code on database",
            `${error.message}`,

            ()=>{
                document.getElementById("popup_container").style.display = "none";
            },
            ()=>{
                document.getElementById("popup_container").style.display = "none";
            },
            document.getElementById("popup_container")
        )

        document.getElementById("popup_container").style.display = "flex";
        document.getElementById("popup_container").appendChild(notice);
        return;
    }
}

async function forceDownloadImage(url, filename = 'Roovix-download.png') {
    try {
        const response = await fetch(url, { mode: 'cors' });
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl); // clean up
    } catch (error) {
        let notice  = noticePopup(
            "Failed to download image",
            `${error.message}`,

            ()=>{
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
}


// try to find qr code on database
document.addEventListener("DOMContentLoaded", ()=>{
    onAuthStateChanged(auth, async (user)=>{
        const qrRef = ref(db, `users/${user.uid}/profile_qr`);
        const qrSnapshot = await get(qrRef);

        // Update model for qr on database
        const qrUpdates = {};

        if(qrSnapshot.exists()) {   
            const qrValue = qrSnapshot.val();
            document.getElementById("generate-qr-btn").style.display = "none";
            document.getElementById("qr-bg").style.display = "flex";
            document.getElementById("qr-img").src = qrValue;
            document.getElementById("qr-dowanload-ancor").addEventListener('click', ()=>{
                forceDownloadImage(qrValue, `${user.displayName}-Roovix-account-qrCode.png`)
            });
        }else {
            document.getElementById("qr-bg").style.display = "none";
            document.getElementById("generate-qr-btn").style.display = "block";
            document.getElementById("generate-qr-btn").addEventListener("click", async ()=>{
                let qrCodeImageUrl = await uploadQrImageFromSrc(document.querySelector('#share-link-text').textContent);
                
                if(qrCodeImageUrl){
                    qrUpdates[`users/${user.uid}/profile_qr`] = qrCodeImageUrl;

                    // Update user data with qrcode
                    await update(ref(db), qrUpdates).then(()=>{
                        document.getElementById("generate-qr-btn").textContent = "Generate Successful"
                        
                        setTimeout(()=>{
                            document.getElementById("generate-qr-btn").style.display = "none";
                            document.getElementById("qr-bg").style.display = "flex";
                            document.getElementById("qr-img").src = qrCodeImageUrl;
                            document.getElementById("qr-dowanload-ancor").addEventListener('click', ()=>{
                                forceDownloadImage(qrCodeImageUrl, `${user.displayName}-Roovix-account-qrCode.png`)
                            });
                        }, 2000);
                    });
                }else {
                    let notice  = noticePopup(
                        "Error generating",
                        `Qr code Image generate or upload error, Try again later.`,
        
                        ()=>{
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
            })
        }
    });
});
