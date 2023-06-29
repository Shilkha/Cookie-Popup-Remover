let isScriptEnabled = false;
let blockedPopupCount = 0;

// Retrieve the script state and popup count from storage
chrome.storage.sync.get(["scriptState", "blockedPopupCount"], function(data) {
    isScriptEnabled = data.scriptState !== undefined ? data.scriptState : false;
    blockedPopupCount = data.blockedPopupCount !== undefined ? data.blockedPopupCount : 0;
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.toggleScript !== undefined) {
        isScriptEnabled = message.toggleScript;
        // Store the updated script state in storage
        chrome.storage.sync.set({ scriptState: isScriptEnabled });
        // Send a message to the content script to toggle the script state
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { toggleScript: isScriptEnabled });
        });
    } else if (message.getScriptState) {
        // Send the current script state to the content script
        sendResponse({ scriptState: isScriptEnabled });
    } else if (message.incrementPopupCount) {
        // Increment the popup count and store it in storage
        blockedPopupCount++;
        chrome.storage.sync.set({ blockedPopupCount: blockedPopupCount });
    }
});
