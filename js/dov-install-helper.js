/**
 * Created by Deekshith Allamaneni on 1/24/16.
 */
"use strict";

function getDovUrlForBrowser(browserName, purpose) {
    "use strict";
    if(typeof purpose === "undefined") { purpose = null;}
    let browserUrl = null;
    switch (browserName) {
        case "Chrome":
            browserUrl = (purpose === "reviews")
                ? "https://chrome.google.com/webstore/detail/docs-online-viewer/gmpljdlgcdkljlppaekciacdmdlhfeon/reviews"
                : "https://chrome.google.com/webstore/detail/docs-online-viewer/gmpljdlgcdkljlppaekciacdmdlhfeon";
            break;
        case "Firefox":
            browserUrl = (purpose === "reviews")
                ? "https://addons.mozilla.org/en-US/firefox/addon/docs-online-viewer/reviews/add"
                :"https://addons.mozilla.org/en-US/firefox/addon/docs-online-viewer/";
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
    let thisBrowserUrl = getDovUrlForBrowser(thisBrowserName, null);
    let installButtonElement = document.getElementById("dov-install-button");
    if(thisBrowserName === null || thisBrowserUrl === null) {
        installButtonElement.href = "#";
        installButtonElement.innerHTML = "Browser not Supported";
        return;
    }
    installButtonElement.classList.remove("disabled");
    installButtonElement.href = thisBrowserUrl;
    installButtonElement.innerHTML = "<i class=\"fa fa-plus fa-fw\"></i> Add to ".concat(thisBrowserName);
    enableSupportedBrowserIcon(thisBrowserName);
}

changeDovInstallButton();

// User Feedback Section
function userLikesDOVView() {
    document.getElementById('dov-options-feedback').innerHTML =
        `<h3>I am glad you liked it!</h3>
        <p class="lead">
            Yayy!!! 🎉 Docs Online Viewer is 6 years old! I released the first version six years ago and spent
            hundreds of hours every year to keep making it better and that effort still continues. It was kept completely
            free from the beginning and never even accepted any donations. It encourages me a lot if you can take a minute
            to <a href=${getDovUrlForBrowser(detectBrowser(navigator.userAgent).browser_name, "reviews")}>
            write a review</a> and share it with your friends. Thanks!
            <!--
            It took at-least about 300 hours in the past 6 months to develop this and I am continuously working to improve it.
            Would you mind to take a minute to review it and share with your friends?
            It encourages me to put in more effort and take it to the next level. Thanks! 😃
            -->
        </p>
        <a class=\"btn btn-success\" href=${getDovUrlForBrowser(detectBrowser(navigator.userAgent).browser_name, "reviews")} target=\"_blank\">
            <i class=\"fa fa-thumbs-up fa-2x pull-left\"></i> &nbsp;&nbsp;&nbsp;Rate it&nbsp;&nbsp;&nbsp;<br/>
            <i class=\"fa fa-star\"></i><i class=\"fa fa-star\"></i><i class=\"fa fa-star\"></i><i class=\"fa fa-star\"></i><i class=\"fa fa-star\"></i>
        </a>
        <br/>
        <div class=\"text-muted\">Share it</div>
        <a style=\"color: #3b5998\" href=\"https://www.facebook.com/sharer/sharer.php?u=http://dov.parishod.com/\"><i class=\"fa fa-facebook-square fa-2x\"></i></a>
        <a style=\"color: #55acee\" href=\"https://twitter.com/share?text=View%20any%20file%20in%20your%20browser%20with%20Docs%20Online%20Viewer.&url=http://dov.parishod.com/\"><i class=\"fa fa-twitter-square fa-2x\"></i></a>
        <a style=\"color: #d34836\" href=\"https://plus.google.com/share?url=http://dov.parishod.com/\"><i class=\"fa fa-google-plus-square fa-2x\"></i></a>
        `;
}


function userDislikesDOVView() {
    document.getElementById('dov-options-feedback').innerHTML =
        "<h4>Report Issues</h4>\
        <div class=\"text-center\">\
            <a class=\"btn btn-warning\" href=\"https://github.com/adeekshith/Docs-Online-Viewer/issues\" target=\"_blank\">    \
                    <i class=\"fa fa-bug fa-2x pull-left\"></i> Report<br/>issues</a> \
            <br/>Sorry to know you have issues with it. Report them and we will try to resolve them as soon as possible. Thank you.\
        </div>";
}

if(getUrlParameterByName("firstrun", document.location.href)=== "true") {
    document.getElementById("dov-first-run-feedback").style.display = "initial";
}

document.getElementById('user-liked-dov-options-feedback').addEventListener('click', userLikesDOVView);
document.getElementById('user-disliked-dov-options-feedback').addEventListener('click', userDislikesDOVView);