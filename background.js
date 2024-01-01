chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveActivityData") {
        chrome.storage.local.set({[request.key]: request.data}, function() {
            console.log('Activity data saved for', request.key, ':', request.data);
        });
    }
});
