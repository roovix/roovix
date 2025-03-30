import { auth, db } from "https://www.roovix.com/config/firebase_config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Initialize elements
const screenTimeCount = document.getElementById("screen-time-count");
const screenTimeUnits = document.getElementById("screen-time-unit");
const screenTimeMeasurement = document.getElementById("screen-time-masourment");
const screenTimeArrow = document.getElementById("screen-time-mesourment-arrow");

// Function to convert total seconds to readable time format
function formatTime(seconds) {
    const units = [
        { label: 'y', value: 60 * 60 * 24 * 365 },
        { label: 'M', value: 60 * 60 * 24 * 30 },
        { label: 'w', value: 60 * 60 * 24 * 7 },
        { label: 'd', value: 60 * 60 * 24 },
        { label: 'h', value: 60 * 60 },
        { label: 'm', value: 60 },
        { label: 's', value: 1 }
    ];

    for (const unit of units) {
        if (seconds >= unit.value) {
            const count = Math.floor(seconds / unit.value);
            return { count, unit: unit.label };
        }
    }
    return { count: 0, unit: 's' };
}

// Function to calculate percentage change
function calculatePercentageChange(current, previous) {
    if (previous === 0) return 100; // If no data for last week, assume full growth
    return ((current - previous) / previous) * 100;
}

// Check for user logged in then calculate
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userId = user.uid;
        const userRef = ref(db, `users/${userId}/screenTime`);
        const userScreenTime = await get(userRef);
        const currentScreenTime = userScreenTime.val();

        if (currentScreenTime && typeof currentScreenTime === 'object') {
            let totalTimeSpent = 0;
            let previousWeekTime = 0;
            let currentWeekTime = 0;
            let lastMonthTime = 0;
            
            const now = new Date();
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            const twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(now.getDate() - 14);
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(now.getMonth() - 1);

            for (let key in currentScreenTime) {
                if (currentScreenTime.hasOwnProperty(key)) {
                    let time = currentScreenTime[key];
                    let entryDate = new Date(time.date);
                    
                    if (entryDate >= oneMonthAgo) {
                        totalTimeSpent += time.timeSpent;
                    }
                    if (entryDate >= oneWeekAgo) {
                        currentWeekTime += time.timeSpent;
                    } else if (entryDate >= twoWeeksAgo && entryDate < oneWeekAgo) {
                        previousWeekTime += time.timeSpent;
                    }
                }
            }

            // Calculate percentage change
            const percentageChange = calculatePercentageChange(currentWeekTime, previousWeekTime);
            const formattedChange = percentageChange.toFixed(1) + "%";

            // Update UI
            const { count, unit } = formatTime(totalTimeSpent);
            screenTimeCount.textContent = `${count}`;
            screenTimeUnits.textContent = `${unit}`;
            screenTimeMeasurement.textContent = formattedChange;
            
            // Update arrow direction and color
            if (percentageChange >= 0) {
                screenTimeMeasurement.classList.add("positive");
                screenTimeMeasurement.classList.remove("negative");
                screenTimeArrow.classList.remove("fa-arrow-down");
                screenTimeArrow.classList.add("fa-arrow-up");
            } else {
                screenTimeMeasurement.classList.add("negative");
                screenTimeMeasurement.classList.remove("positive");
                screenTimeArrow.classList.remove("fa-arrow-up");
                screenTimeArrow.classList.add("fa-arrow-down");
            }
        } else {
            screenTimeCount.textContent = "0";
            screenTimeUnits.textContent = "s";
            screenTimeMeasurement.textContent = "0%";
        }
    } else {
        screenTimeCount.textContent = "0";
        screenTimeUnits.textContent = "s";
        screenTimeMeasurement.textContent = "0%";
    }
});
