/**
 * Created by Deekshith Allamaneni on 1/12/16.
 * Copyright 2016 Deekshith Allamaneni
 */
"use strict";

function getUrlContentType(url) {
    return fetch(url, {
        method: 'HEAD'  // Use HEAD to get headers only, no need to download the whole content
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return {
            url: url,
            content_type: response.headers.get("Content-Type"),
            status: response.status
        };
    }).catch(error => {
        throw new Error('Network error reading Content-Type: ' + error.message);
    });
}

function textFileLoad(url) {
    return fetch(url).then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('File didn\'t load successfully; error code:' + response.statusText);
        }
    }).catch(error => {
        throw new Error('There was a network error: ' + error.message);
    });
}

function generateUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = crypto.getRandomValues(new Uint8Array(1))[0]%16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

function hashCode(string) {
    return string.split('').reduce((prevHash, currVal) =>
    ((prevHash << 5) - prevHash) + currVal.charCodeAt(0), 0);
};

chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "dov-url-detect-messenger");
    port.onMessage.addListener(function(msg) {
        getUrlContentType(msg.test_url).then(function(thisContentType) {
            /*
             thisContentType has the Content-Type of the current file URL.
             Check if it matches the required file type and then append icon if it matches.
             */
            port.postMessage(thisContentType);
        }, function(Error) {
            console.log(Error);
            port.postMessage(
                {
                    url: msg.test_url,
                    content_type: undefined,
                    status: undefined
                }
            );
        });
    });
});


/**
 * On Extension Install or Update
 */
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "install") {
        // Open getting started page on extension install
        chrome.tabs.create({
            "url": "http://dov.parishod.com/?firstrun=true#getting-started"
        });

        // Save default options to storage sync
        textFileLoad(chrome.runtime.getURL("data/user-preferences-default.json"))
            .then(function(defaultUserPreferencesStr) {
                chrome.storage.sync.set({
                    user_config:defaultUserPreferencesStr
                }, function () {
                    console.log("Docs Online Viewer installed and default user preferences saved successfully.");
                });
            }, function(Error) {
                console.log(Error);
            });
    }else if(details.reason === "update"){
        // Extension update task here.
    }
});
