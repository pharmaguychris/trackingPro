let startTime;
let timerInterval;

document.getElementById('startButton').addEventListener('click', () => {
    startTime = new Date();
    document.getElementById('startButton').disabled = true;
    document.getElementById('stopButton').disabled = false;
    
    // Start the timer
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
});

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
