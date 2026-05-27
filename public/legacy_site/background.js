// background.js

// This allows the side panel to automatically open when the user clicks the extension icon in the toolbar.
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

chrome.runtime.onInstalled.addListener(() => {
    console.log("AURA Discharge Cockpit Extension Installed!");
});
