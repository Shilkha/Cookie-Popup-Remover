// Update the checkbox state and blocked popup count label based on the script state and count retrieved from storage
function updateUI() {
    chrome.storage.sync.get(["scriptState", "blockedPopupCount"], function(data) {
        const toggleSwitch = document.getElementById('toggleSwitch');
        toggleSwitch.checked = data.scriptState || false;

        const counterLabel = document.getElementById('counterLabel');
        counterLabel.textContent = `Blocked Popups: ${data.blockedPopupCount || 0}`;
    });
}

// Send a message to the background script when the switch is toggled
document.getElementById('toggleSwitch').addEventListener('change', function() {
    const isChecked = this.checked;
    chrome.runtime.sendMessage({ toggleScript: isChecked });
});

// Send a message to the background script to reset the blockedPopupCount
document.getElementById('resetButton').addEventListener('click', function() {
    chrome.runtime.sendMessage({ resetPopupCount: true });
});

// Update the UI when the popup is opened
updateUI();

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(message) {
    if (message.countResetComplete) {
        // Update the UI after the count is reset
        updateUI();
    }
});
