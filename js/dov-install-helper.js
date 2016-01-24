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
        case "Firefox":
            browserUrl = "https://addons.mozilla.org/en-US/firefox/addon/docs-online-viewer/";
            break;
        case "Opera":
            browserUrl = "https://addons.opera.com/en/extensions/details/docs-online-viewer/";
            break;
        default:
            browserUrl = null;
    }
    return browserUrl;
}

function enableSupportedBrowserIcon(browserName) {
    switch (browserName) {
        case "Chrome":
            document.getElementById("supported-browser-icon-chrome").classList.remove("text-muted");
            break;
        case "Firefox":
            document.getElementById("supported-browser-icon-firefox").classList.remove("text-muted");
            break;
        case "Opera":
            document.getElementById("supported-browser-icon-opera").classList.remove("text-muted");
            break;
    }
}

function changeDovInstallButton() {
    let thisBrowserName = detectBrowser(navigator.userAgent).browser_name;
    let thisBrowserUrl = getDovUrlForBrowser(thisBrowserName);
    let installButtonElement = document.getElementById("dov-install-button");
    if(thisBrowserName === null || thisBrowserUrl === null) {
        installButtonElement.href = "#";
        installButtonElement.innerHTML = "Browser not Supported";
        return;
    }
    installButtonElement.classList.remove("disabled");
    installButtonElement.href = thisBrowserUrl;
    installButtonElement.innerHTML = "Install for ".concat(thisBrowserName);
    enableSupportedBrowserIcon(thisBrowserName);
}

changeDovInstallButton();