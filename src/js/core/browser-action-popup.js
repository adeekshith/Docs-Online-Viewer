/**
 * Created by Deekshith Allamaneni on 11/28/15.
 * Copyright 2016 Deekshith Allamaneni
 */

"use strict";

function getDefPrefsRestorePopupOptions () {
    textFileLoad(chrome.runtime.getURL("data/user-preferences-default.json")).then(function(response) {
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
    textFileLoad(chrome.runtime.getURL("data/user-preferences-default.json")).then(function(response) {
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
        thisUserConfig.setIconBesideDocLinksEnable(userToggleEnableStatus);
        let thisUserPreferencesStr = JSON.stringify(thisUserConfig.getPreferences());
        chrome.storage.sync.set({
            user_config:thisUserPreferencesStr
        }, function () {
            // Update status to let user know options were saved.
        });
    });
    if (userToggleEnableStatus === true) {
        chrome.action.setBadgeText({ text: "" });
    } else {
        chrome.action.setBadgeText({ text: "OFF" });
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
