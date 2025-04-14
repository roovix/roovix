import { auth, db } from "https://www.roovix.com/config/firebase_config.js"; 
import { ref, get, update, set, remove } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

function showInputError(element, message) {
    if (!element) return;
    element.textContent = message;
    element.classList.add("show");
    setTimeout(() => {
        element.classList.remove("show");
    }, 5000);
}

function updateProfileInfo() {
    const updateBtn = document.getElementById("profile-edit-update");
    const originalBtnText = updateBtn.textContent;

    const usernameField = document.getElementById("uname");
    const introField = document.getElementById("intro");
    const interestsField = document.getElementById("interests");
    const skillsField = document.getElementById("skills");

    const usernameErr = document.getElementById("edit-uname-err");
    const introErr = document.getElementById("edit-intro-err");
    const interestsErr = document.getElementById("edit-interests-err");
    const skillsErr = document.getElementById("edit-skills-err");

    [usernameErr, introErr, interestsErr, skillsErr].forEach(err => {
        if (err) {
            err.textContent = "";
            err.classList.remove("show");
        }
    });

    const newUsername = usernameField.value.trim();
    const intro = introField.value.trim();
    const interests = interestsField.value.trim();
    const skills = skillsField.value.trim();

    if (newUsername.length < 3 || newUsername.length > 20) {
        showInputError(usernameErr, "Username must be 3–20 characters.");
        usernameField.focus();
        return;
    }
    if (intro.length > 250) {
        showInputError(introErr, "Intro must be within 250 characters.");
        introField.focus();
        return;
    }
    if (interests.length > 100) {
        showInputError(interestsErr, "Interests must be within 100 characters.");
        interestsField.focus();
        return;
    }
    if (skills.length > 100) {
        showInputError(skillsErr, "Skills must be within 100 characters.");
        skillsField.focus();
        return;
    }

    updateBtn.disabled = true;
    updateBtn.textContent = "Updating...";

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            alert("User not authenticated.");
            updateBtn.disabled = false;
            updateBtn.textContent = originalBtnText;
            return;
        }

        const uid = user.uid;
        const userRef = ref(db, `users/${uid}`);
        const userUnameRef = ref(db, "user_uname");
        const currentUnameSnapshot = await get(userRef);
        const oldUsername = currentUnameSnapshot.val().username;

        try {
            const usernameSnapshot = await get(ref(db, `user_uname/${newUsername}`));
            if (usernameSnapshot.exists() && newUsername !== oldUsername) {
                showInputError(usernameErr, "This username is already taken.");
                updateBtn.disabled = false;
                updateBtn.textContent = originalBtnText;
                return;
            }

            // Prepare update object
            const updates = {};
            updates[`users/${uid}/username`] = newUsername;
            updates[`users/${uid}/intro`] = intro;
            updates[`users/${uid}/interests`] = interests;
            updates[`users/${uid}/skills`] = skills;

            // Set new username node with same email & uid
            const oldUserUnameData = await get(ref(db, `user_uname/${oldUsername}`));
            if (oldUserUnameData.exists()) {
                const { email, uid: sameUid } = oldUserUnameData.val();
                updates[`user_uname/${newUsername}`] = { email, uid: sameUid };
            }

            // Remove old username node if changed
            if (oldUsername !== newUsername) {
                updates[`user_uname/${oldUsername}`] = null;
            }

            await update(ref(db), updates);

            alert("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to update profile: " + error.message);
        } finally {
            updateBtn.disabled = false;
            updateBtn.textContent = originalBtnText;
        }
    });
}


document.getElementById("profile-edit-update").addEventListener('click', ()=>{
    updateProfileInfo();
});