/**
 * Created by deekshitha on 11/28/15.
 */
"use strict";


function textFileLoad(url) {
    // Create new promise with the Promise() constructor;
    // This has as its argument a function
    // with two parameters, resolve and reject
    return new Promise(function(resolve, reject) {
        // Standard XHR to load json
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'text';
        // When the request loads, check whether it was successful
        request.onload = function() {
            if (request.status === 200) {
                // If successful, resolve the promise by passing back the request response
                resolve(request.responseText);
            } else {
                // If it fails, reject the promise with a error message
                reject(Error('Give file didn\'t load successfully; error code:' + request.statusText));
            }
        };
        request.onerror = function() {
            // Also deal with the case when the entire request fails to begin with
            // This is probably a network error, so reject the promise with an appropriate message
            reject(Error('There was a network error.'));
        };
        // Send the request
        request.send();
    });
}


function getDefPrefsRestorePopupOptions () {
    textFileLoad(chrome.extension.getURL("data/user-preferences-default.json")).then(function(response) {
        // The first runs when the promise resolves, with the request.reponse
        // specified within the resolve() method.
        restorePopupOptions(response);
        // The second runs when the promise
        // is rejected, and logs the Error specified with the reject() method.
    }, function(Error) {
        console.log(Error);
    });
}


function restorePopupOptions (userPrefDefaultJsonStr) {
    // Read from saved preferences and restore options.
    //$('#toggle-enable-dov').bootstrapToggle('off');
    chrome.storage.sync.get({
        user_config: userPrefDefaultJsonStr
    }, function (items) {
        let thisUserPreferences = JSON.parse(items.user_config);
        let thisUserConfig = new UserConfig(thisUserPreferences);
        //var thisUserIsDovIconEnabled = thisUserConfig.isIconBesideDocLinksEnabled();
        if (thisUserConfig.isIconBesideDocLinksEnabled() === true) {
            $('#toggle-enable-dov').bootstrapToggle('on');
        } else {
            $('#toggle-enable-dov').bootstrapToggle('off');
        }
    });
}

document.addEventListener('DOMContentLoaded', getDefPrefsRestorePopupOptions);


function getDefPrefsUpdateToggleOptions () {
    textFileLoad(chrome.extension.getURL("data/user-preferences-default.json")).then(function(response) {
        // The first runs when the promise resolves, with the request.reponse
        // specified within the resolve() method.
        updateToggleOptions(response);
        // The second runs when the promise
        // is rejected, and logs the Error specified with the reject() method.
    }, function(Error) {
        console.log(Error);
    });
}


function updateToggleOptions(userPrefDefaultJsonStr) {
    // Code to process toggle button goes here.
    let userToggleEnableStatus = document.getElementById('toggle-enable-dov').checked;
    chrome.storage.sync.get({
        user_config: userPrefDefaultJsonStr
    }, function (items) {
        let thisUserPreferences = JSON.parse(items.user_config);
        let thisUserConfig = new UserConfig(thisUserPreferences);
        //var thisUserIsDovIconEnabled = thisUserConfig.isIconBesideDocLinksEnabled();
        let currentToggleStatus = userToggleEnableStatus;
        thisUserConfig.setIconBesideDocLinksEnable(currentToggleStatus);
        let thisUserPreferencesStr = JSON.stringify(thisUserConfig.getPreferences());
        chrome.storage.sync.set({
            user_config:thisUserPreferencesStr
        }, function () {
            // Update status to let user know options were saved.
        });
    });
    if (userToggleEnableStatus === true) {
        chrome.browserAction.setBadgeText({ text: "" });
    } else {
        chrome.browserAction.setBadgeText({ text: "OFF" });
    }
}


$(function() {
    $('#toggle-enable-dov').change(getDefPrefsUpdateToggleOptions);
});

document.getElementById('browser-action-options').addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
        // New way to open options pages, if supported (Chrome 42+).
        chrome.runtime.openOptionsPage();
    } else {
        // Reasonable fallback.
        window.open(chrome.runtime.getURL('../html/options.html'));
    }
});
