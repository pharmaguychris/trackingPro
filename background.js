// background.js
let activityDurations = {};

// Listener for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveActivityData") {
        // Handling activity data saving
        let activity = request.key;
        let duration = request.data;

        // Check if activity already exists and accumulate duration
        if (activityDurations[activity]) {
            activityDurations[activity] += duration;
        } else {
            activityDurations[activity] = duration;
        }

        // Save the updated data to local storage
        chrome.storage.local.set({ 'activityDurations': activityDurations }, function() {
            console.log('Activity duration updated');
        });

    } else if (request.action === "getAllActivities") {
        // Fetching all stored activities and their durations
        chrome.storage.local.get('activityDurations', function(result) {
            if (result.activityDurations) {
                activityDurations = result.activityDurations;
            }
            sendResponse({ allActivities: activityDurations });
        });
        return true; // Indicates to Chrome that the response is asynchronous
    }
});
