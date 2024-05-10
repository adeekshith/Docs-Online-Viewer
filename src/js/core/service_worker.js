/**
 * Created by Deekshith Allamaneni on 1/12/16.
 * Copyright 2016 Deekshith Allamaneni
 */
"use strict";

function getUrlContentType(url) {
    // Create new promise with the Promise() constructor;
    // This has as its argument a function
    // with two parameters, resolve and reject
    return new Promise(function(resolve, reject) {
        // Standard XHR
        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 2) {
                resolve(
                    {
                        url: url,
                        content_type: request.getResponseHeader("Content-Type"),
                        status: request.status
                    }
                );
            }
        };
        request.onerror = function() {
            // Also deal with the case when the entire request fails to begin with
            // This is probably a network error, so reject the promise with an appropriate message
            reject(Error('Network error reading Content-Type.'));
        };
        request.ontimeout = function () {
            reject(Error('Request timeout'));
        };
        request.open("GET", url, true);
        request.timeout = 2000; // Timeout in ms
        request.send(null);
    });
}


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
