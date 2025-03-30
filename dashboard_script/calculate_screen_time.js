import { auth, db } from "https://www.roovix.com/config/firebase_config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";


// Initialize element
const screenTimeCount = document.getElementById("screen-time-count");
const screenTimeUnits = document.getElementById("screen-time-unit");

// Function to convert total seconds to readable time format
function formatTime(seconds) {
    const units = [
        { label: 'y', value: 60 * 60 * 24 * 365 },   // year (in seconds)
        { label: 'M', value: 60 * 60 * 24 * 30 },    // month (in seconds)
        { label: 'w', value: 60 * 60 * 24 * 7 },     // week (in seconds)
        { label: 'd', value: 60 * 60 * 24 },         // day (in seconds)
        { label: 'h', value: 60 * 60 },              // hour (in seconds)
        { label: 'm', value: 60 },                   // minute (in seconds)
        { label: 's', value: 1 }                     // second (in seconds)
    ];

    for (const unit of units) {
        if (seconds >= unit.value) {
            const count = Math.floor(seconds / unit.value);
            return { count, unit: unit.label };
        }
    }
    return { count: 0, unit: 's' }; // default to seconds if no larger unit found
}

// Check for user logged in then calculate
onAuthStateChanged(auth, async (user) => {
if (user) {
    const userId = user.uid;
    const userRef = ref(db, `users/${userId}/screenTime`);
    const userScreenTime = await get(userRef);
    const currentScreenTime = userScreenTime.val();

    // Check if screenTime data exists
    if (currentScreenTime && typeof currentScreenTime === 'object') {
        let totalTimeSpent = 0;

        // Loop through the Firebase object and sum up the timeSpent
        for (let key in currentScreenTime) {
            if (currentScreenTime.hasOwnProperty(key)) {
                let time = currentScreenTime[key];
                totalTimeSpent += time.timeSpent; // Assuming `timeSpent` is the key storing time in seconds
            }
        }


        // Display screen time in a readable format
        const { count, unit } = formatTime(totalTimeSpent);
        screenTimeCount.textContent = `${count}`;
        screenTimeUnits.textContent = `${unit}`;

    } else {
        // Handle case when there is no screen time data
        screenTimeCount.textContent = "0";
        screenTimeUnits.textContent = "s";
    }
    } else {
        // Handle case when user is not authenticated
        screenTimeCount.textContent = "0";
        screenTimeUnits.textContent = "s";
    }
});