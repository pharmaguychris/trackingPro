let startTime;
let timerInterval;
let activityName;

document.getElementById('activityInput').addEventListener('keypress', function(event) {
    if (event.keyCode === 13) { // 13 is the keycode for Enter
        event.preventDefault();
        startTimer();
    }
});

document.getElementById('startButton').addEventListener('click', startTimer);

function startTimer() {
    activityName = document.getElementById('activityInput').value;
    if (activityName.trim() === "") {
        alert("Please enter an activity name.");
        return;
    }

    startTime = new Date();
    document.getElementById('startButton').disabled = true;
    document.getElementById('stopButton').disabled = false;

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

document.getElementById('stopButton').addEventListener('click', () => {
    clearInterval(timerInterval);
    let endTime = new Date();
    let duration = (endTime - startTime) / 1000; // Duration in seconds

    document.getElementById('startButton').disabled = false;
    document.getElementById('stopButton').disabled = true;

    // Send data to background.js to save it
    chrome.runtime.sendMessage({
        action: "saveActivityData",
        key: activityName,
        data: duration
    });
});

document.getElementById('stopButton').addEventListener('click', () => {
    let userConfirmed = confirm("Do you want to finish this activity?");
    if (userConfirmed) {
        // User clicked 'OK' to finish the activity
        clearInterval(timerInterval);
        let endTime = new Date();
        let duration = (endTime - startTime) / 1000; // Duration in seconds

        document.getElementById('startButton').disabled = false;
        document.getElementById('stopButton').disabled = true;

        // Send data to background.js to save it
        chrome.runtime.sendMessage({
            action: "saveActivityData",
            key: activityName,
            data: duration
        });
        chrome.runtime.sendMessage({ action: "getAllActivities" }, function(response) {
            displayAllActivities(response.allActivities);
        });
    } else {
        // User clicked 'Cancel' to continue the activity
        // Do nothing, let the timer continue
    }
});

function displayAllActivities(allActivities) {
    let displayArea = document.getElementById('allActivities');
    displayArea.innerHTML = '<h3>All Activities</h3>';

    for (let activity in allActivities) {
        let activityDuration = allActivities[activity];
        displayArea.innerHTML += `<p>${activity}: ${activityDuration} seconds</p>`;
    }
}
function updateTimer() {
    let currentTime = new Date();
    let elapsed = currentTime - startTime; // time in milliseconds
    let hours = Math.floor(elapsed / 3600000);
    let minutes = Math.floor((elapsed % 3600000) / 60000);
    let seconds = Math.floor(((elapsed % 360000) % 60000) / 1000);

    document.getElementById('timer').textContent = 
        String(hours).padStart(2, '0') + ':' +
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0');
}
