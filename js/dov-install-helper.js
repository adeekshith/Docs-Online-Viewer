/**
 * Created by Deekshith Allamaneni on 1/24/16.
 */
"use strict";

function getDovUrlForBrowser(browserName) {
    "use strict";
    let browserUrl = null;
    switch (browserName) {
        case "Chrome":
            browserUrl = "https://chrome.google.com/webstore/detail/docs-online-viewer/gmpljdlgcdkljlppaekciacdmdlhfeon";
            break;
        case "Opera":
            browserUrl = "https://addons.opera.com/en/extensions/details/docs-online-viewer/";
            break;
        case "Firefox":
            browserUrl = "https://addons.mozilla.org/en-US/firefox/addon/docs-online-viewer/";
            break;
    }
    return browserUrl;
}

function changeDovInstallButton() {
    let thisBrowserName = detectBrowser(navigator.userAgent).browser_name;
    if(thisBrowserName === null) { return;}
    let thisBrowserUrl = getDovUrlForBrowser(thisBrowserName);
    document.getElementById("dov-install-button").href = thisBrowserUrl;
    document.getElementById("dov-install-button").innerHTML = "Install for ".concat(thisBrowserName);
}

changeDovInstallButton();