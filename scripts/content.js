let isScriptEnabled = false;

function checkForCookiePopup() {
    if (isScriptEnabled) {
        // Look for an element with 'cookie' or 'consent' in its ID or class name
        const cookieElements = document.querySelectorAll('[id*="cookie"], [class*="cookie"], [id*="consent"], [class*="consent"]');
        if (cookieElements.length > 0) {
            // Capture the IDs of cookie-related elements
            for (let i = 0; i < cookieElements.length; i++) {
                try {
                    // Remove the element from the DOM
                    document.getElementById(cookieElements[i].id).remove();
                    // Send a message to the background script to increment the popup count
                    chrome.runtime.sendMessage({ incrementPopupCount: true });
                }catch(e){
                    console.log("The id "+cookieElements[i].id + " has not been found.");
                }
            }
        } else {
            console.log("No cookie popup was detected.");
        }
    }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(message) {
    if (message.toggleScript !== undefined) {
        isScriptEnabled = message.toggleScript;
        if (isScriptEnabled) {
            checkForCookiePopup();
        }
    }
});

// Check for cookie popups when the content script is loaded, but only if the script is enabled initially
chrome.runtime.sendMessage({ getScriptState: true }, function(response) {
    isScriptEnabled = response.scriptState;
    if (isScriptEnabled) {
        checkForCookiePopup();
    }
});
