/**
 * Created by deekshitha on 1/12/16.
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