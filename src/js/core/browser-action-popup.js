/**
 * Created by deekshitha on 11/28/15.
 */

function restorePopupOptions () {
    // Read from saved preferences and restore options.
}

document.addEventListener('DOMContentLoaded', restorePopupOptions);

$(function() {
    $('#toggle-enable-dov').change(function() {
        // Code to process toggle button goes here.
    })
})

document.getElementById('browser-action-preferences').addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
        // New way to open options pages, if supported (Chrome 42+).
        chrome.runtime.openOptionsPage();
    } else {
        // Reasonable fallback.
        window.open(chrome.runtime.getURL('../html/options.html'));
    }
});

document.getElementById('browser-action-popup-help').addEventListener('click', function(){
    $('#toggle-enable-dov').bootstrapToggle('off');
    document.getElementById("browser-action-preferences").textContent= "asdfg";
    document.getElementById("browser-action-popup-help").textContent="PrefChangedHelp";
});