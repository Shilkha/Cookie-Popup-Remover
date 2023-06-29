// Update the checkbox state and blocked popup count label based on the script state and count retrieved from storage
chrome.storage.sync.get(["scriptState", "blockedPopupCount"], function(data) {
    const toggleSwitch = document.getElementById('toggleSwitch');
    toggleSwitch.checked = data.scriptState || false;

    const counterLabel = document.getElementById('counterLabel');
    counterLabel.textContent = `Blocked Popups: ${data.blockedPopupCount || 0}`;
});

// Send a message to the background script when the switch is toggled
document.getElementById('toggleSwitch').addEventListener('change', function() {
    const isChecked = this.checked;
    chrome.runtime.sendMessage({ toggleScript: isChecked });
});
