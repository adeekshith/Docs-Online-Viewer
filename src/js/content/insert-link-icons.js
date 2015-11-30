/**
 * @file
 * Checks for document links in web pages and inserts
 * an icon beside the links to enable opening with
 * online services like Google Docs viewer.
 *
 * @author Deekshith Allamaneni
 * @copyright 2015 Docs Online Viewer
 */

chrome.storage.sync.get({
    user_config: userPrefJSON_default
}, function (items) {
    var thisUserPreferences = JSON.parse(items.user_config);
    var thisUserConfig = new UserConfig(thisUserPreferences);
    if (thisUserConfig.isIconBesideDocLinksEnabled() === true) {
        main_content_script(thisUserConfig);
    }
});

function main_content_script(thisUserConfig) {
    // "use strict";
    var docLinks = document.links;
    var doCheck = true;
    var dov_host_exclude = /(docs\.google\.com|sourceforge\.net|adf\.ly|mediafire\.com|springerlink\.com|ziddu\.com|ieee\.org|issuu\.com|asaha\.com|office\.live\.com)$/;
    // Include paths to exclude showing icon
    var dov_href_exclude = /(https:\/\/github.com\/.*\/.*\/blob\/.*|file:\/\/\/.*)/;
    var dovIconImgPath = "images/beside-link-icon.svg";


    function fileExtension(path) {
        var fUrl = path;
        fUrl = fUrl.toLowerCase();
        // Returns file extension. Returns "" if no valid extension
        // Ref: http://stackoverflow.com/a/1203361/3439460
        return fUrl.substr((~-fUrl.lastIndexOf(".") >>> 0) + 2);
    }


    var DocLink = function (docLink_param) {
        this._docLink = docLink_param;
    };
    DocLink.prototype = {
        get hasSupportedExtension() {
            return thisUserConfig.isFiletypeEnabled(fileExtension(this._docLink.pathname));
        },
        get isSupported() {
            return (!((this._docLink.host).match(dov_host_exclude)) && !((this._docLink.href).match(dov_href_exclude)) && this.hasSupportedExtension && this._docLink.innerText.trim().length > 0); // GitHub Issue #6: No blank innerText. Does not work on Firefox
        },
        get isProcessed() {
            return this._docLink.docView;
        },
        get iconLink() {
            var viewLink = document.createElement('a');
            viewLink.href = "https://docs.google.com/viewer?url=" + encodeURI(this.queryStripped) + "&embedded=false&chrome=false&dov=1";
            /*
             Parameter description:
             embedded= <true>: to open google docs in embedded mode
             dov=1: If opened by Docs Online Viewer. Set by this script.
             */
            //viewLink.docView=true; -> This line is removed in this version but still doubt if it can really be removed.
            viewLink.title = "View this " + fileExtension(this._docLink.pathname) + " file";
            var ico = document.createElement("img");
            ico.src = chrome.extension.getURL(dovIconImgPath);
            // Adjusts the margin of the icon to the given number of pixels (3 to 5px is advisable)
            ico.style.marginLeft = "3px";
            ico.style.width = "16px";
            ico.style.height = "16px";
            viewLink.appendChild(ico);
            if(thisUserConfig.isIconClickNewtab() === true) {
                viewLink.setAttribute("target", "_blank");
            }
            return viewLink;
        },
        get queryStripped() {
            // remove any ?query in the URL
            return this._docLink.protocol + "//" + this._docLink.hostname + this._docLink.pathname;
        }

    };


    function checkLinks() {
        for (var i = 0; i < docLinks.length; ++i) {
            var thisDocLink = new DocLink(docLinks[i]);
            if (thisDocLink.isSupported && !thisDocLink.isProcessed) {
                // Append the icon beside the link
                docLinks[i].parentNode.insertBefore(thisDocLink.iconLink, docLinks[i].nextSibling);
            }
            // The link which is checked is flagged so that it is not repeatedly checked again.
            docLinks[i].docView = true;
        }
    }


    function setupListener() {
        document.addEventListener('DOMNodeInserted', function (e) {
            if (doCheck) {
                doCheck = false;
                setTimeout(function () {
                    checkLinks();
                    doCheck = true;
                }, 1000);
            }
        }, false);
    }

// Execute these functions
// to append icon beside document links and
// add listener for new nodes
    checkLinks();
    setupListener();

}
