/**
 * @file
 * Checks for document links in web pages and inserts
 * an icon beside the links to enable opening with
 * online services like Google Docs viewer.
 *
 * @author Deekshith Allamaneni
 * @copyright 2016 Docs Online Viewer
 */
"use strict";

/**
 * Reading in default options file
 * @type {XMLHttpRequest}
 */
{
    let xhReqUserPrefsDefault = new XMLHttpRequest();
    xhReqUserPrefsDefault.open("GET", chrome.extension.getURL("data/user-preferences-default.json"), true);
    xhReqUserPrefsDefault.responseType = "text";
    xhReqUserPrefsDefault.onreadystatechange = function () {
        if (xhReqUserPrefsDefault.readyState === 4 && xhReqUserPrefsDefault.status === 200) {
            chrome.storage.sync.get({
                user_config: xhReqUserPrefsDefault.responseText
            }, function (items) {
                let thisUserConfig = new UserConfig(JSON.parse(items.user_config));
                if (thisUserConfig.isIconBesideDocLinksEnabled() === true) {
                    main_content_script(thisUserConfig);
                }
            });
        }
    };
    xhReqUserPrefsDefault.send(null);
}


function main_content_script(thisUserConfig) {
    "use strict";
    let doCheck = true;
    const dov_host_exclude = /(docs\.google\.com|sourceforge\.net|adf\.ly|mediafire\.com|springerlink\.com|ziddu\.com|ieee\.org|issuu\.com|asaha\.com|office\.live\.com)$/;
    // Include paths to exclude showing icon
    const dov_href_exclude = /(file:\/\/\/.*)/;


    function fileExtension(path) {
        let fUrl = path;
        fUrl = fUrl.toLowerCase();
        // Returns file extension. Returns "" if no valid extension
        // Ref: http://stackoverflow.com/a/1203361/3439460
        return fUrl.substr((~-fUrl.lastIndexOf(".") >>> 0) + 2);
    }


    let DocLink = function (docLink_param) {
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
            return this._docLink.processed;
        },
        get iconLink() {
            let viewLink = document.createElement('a');
            viewLink.href = "https://docs.google.com/viewer?url=" + encodeURI(this.queryStripped) + "&embedded=true&chrome=false&dov=1";
            /*
             Parameter description:
             embedded= <true>: to open google docs in embedded mode
             dov=1: If opened by Docs Online Viewer. Set by this script.
             */
            //viewLink.docView=true; -> This line is removed in this version but still doubt if it can really be removed.
            viewLink.title = "View this " + fileExtension(this._docLink.pathname) + " file";
            let ico = document.createElement("img");
            ico.src = chrome.extension.getURL(thisUserConfig.getBesideDocLinksIconPath());
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
        },
        appendDovIcon () {
            var thisNode = this._docLink;
            var thisIconLink = this.iconLink;
            if (this.isSupported && !this.isProcessed) {
                // Append the icon beside the link
                getUrlContentType(this._docLink.href).then(function(thisContentType) {
                    /*
                    thisContentType has the Content-Type of the current file URL.
                     Check if it matches the required file type and then append icon if it matches.
                     */
                    console.log("thisContentType: ", thisContentType);
                    thisNode.parentNode.insertBefore(thisIconLink, thisNode.nextSibling);
                    thisNode.processed = true; // Flagging to mark as checked
                }, function(Error) {
                    console.log(Error);
                });
            }
        }
    };


    function appendDovIconToAllNodes(docLinks) {
        new Array(docLinks.length).fill().map((_, i) => docLinks.item(i))
            .filter( (docLinkItem) => { // Filtering out invalid objects
                return !(docLinkItem === "" || typeof docLinkItem == "undefined" || docLinkItem === null);
            }).forEach( validDocLinkItem => {
                new DocLink(validDocLinkItem).appendDovIcon();
            });
    }


    function setupListener() {
        document.addEventListener('DOMNodeInserted', function (e) {
            if (doCheck) {
                doCheck = false;
                setTimeout(function () {
                    appendDovIconToAllNodes(document.links);
                    doCheck = true;
                }, 1000);
            }
        }, false);
    }

    // Execute these functions to append icon beside document links and
    // add listener for new nodes
    appendDovIconToAllNodes(document.links);
    setupListener();

}
