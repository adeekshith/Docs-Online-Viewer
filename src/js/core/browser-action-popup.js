/**
 * Created by deekshitha on 11/28/15.
 */

function restorePopupOptions () {
    // Read from saved preferences and restore options.
    //$('#toggle-enable-dov').bootstrapToggle('off');
    chrome.storage.sync.get({
        user_config: userPrefJSON_default
    }, function (items) {
        var thisUserPreferences = JSON.parse(items.user_config);
        var thisUserConfig = new UserConfig(thisUserPreferences);
        //var thisUserIsDovIconEnabled = thisUserConfig.isIconBesideDocLinksEnabled();
        if (thisUserConfig.isIconBesideDocLinksEnabled() === true) {
            $('#toggle-enable-dov').bootstrapToggle('on');
        } else {
            $('#toggle-enable-dov').bootstrapToggle('off');
        }
    });
}

document.addEventListener('DOMContentLoaded', restorePopupOptions);

$(function() {
    $('#toggle-enable-dov').change(function() {
        // Code to process toggle button goes here.
        chrome.storage.sync.get({
            user_config: userPrefJSON_default
        }, function (items) {
            var thisUserPreferences = JSON.parse(items.user_config);
            var thisUserConfig = new UserConfig(thisUserPreferences);
            //var thisUserIsDovIconEnabled = thisUserConfig.isIconBesideDocLinksEnabled();
            var currentToggleStatus = document.getElementById('toggle-enable-dov').checked;
            thisUserConfig.setIconBesideDocLinksEnable(currentToggleStatus);
            var thisUserPreferencesStr = JSON.stringify(thisUserConfig.getPreferences());
            chrome.storage.sync.set({
                user_config:thisUserPreferencesStr
            }, function () {
                // Update status to let user know options were saved.
            });
        });
    })
});

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
    // Open help page
});