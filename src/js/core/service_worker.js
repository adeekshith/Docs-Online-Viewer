/**
 * Created by Deekshith Allamaneni on 1/12/16.
 * Copyright 2016 Deekshith Allamaneni
 */
"use strict";


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
        textFileLoad(chrome.extension.getURL("data/user-preferences-default.json"))
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
