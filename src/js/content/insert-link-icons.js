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

    // Exclude running on domains
    // * Disabled on Youtube: GH Bug#25
    const dov_domain_exclude = /(www\.youtube\.com$)/;
    if(window.location.hostname.match(dov_domain_exclude)) {
        return;
    }

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
            // Open with Google Docs Viewer
            viewLink.href = "https://docs.google.com/viewer?url=" + encodeURIComponent(this._docLink.href) + "&embedded=true&chrome=false&dov=1";
            /*
            // Activate this code in case Google Docs Viewer fails.
             // MS Office Openable files
            const msOfficeSuportedFormats = /(doc|docx|ppt|pptx|xls|xlsx|pps|odf|odt|odp|ods)/;
            if(msOfficeSuportedFormats.test(fileExtension(this._docLink.pathname))){
                viewLink.href = "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(this._docLink.href)+"&wdStartOn=1";
            }else {
                viewLink.href = "https://www.rollapp.com/api/apps/open?file_url="+ encodeURIComponent(this._docLink.href);
            }
            */
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
            if (this.isSupported && !this.isProcessed) {
                // Append the icon beside the link
                let thisNode = this._docLink;
                let thisIconLink = this.iconLink;
                let thisDovIconUuid = generateUuid();
                thisIconLink.setAttribute("id", thisDovIconUuid);
                thisIconLink.setAttribute("original-url", thisNode.href);
                thisNode.parentNode.insertBefore(thisIconLink, thisNode.nextSibling);
                thisNode.processed = true; // Flagging to mark as checked
                return thisDovIconUuid;
            }else {
                return null;
            }
        }
    };


    function removeDovIconForLinksWithHtmlContent(dovIconIds) {
        if(dovIconIds === null || dovIconIds.length === 0) { return;} // Return if id's array is empty
            // which otherwise may connect to bg script and keep the port open unnecessarily.
        let dovUrlBgMsgCounter = 0; // Keeps track of number of pending responses
        let portIsOpen = false;
        let port = chrome.runtime.connect({name: "dov-url-detect-messenger"});
        portIsOpen = true;
        dovIconIds.forEach((id) => {
            let thisIconBesideLinkElement = document.getElementById(id);
            if(thisIconBesideLinkElement === null || typeof(thisIconBesideLinkElement) === "undefined" || thisIconBesideLinkElement === "") { return;}
            let thisOriginalUrl = thisIconBesideLinkElement.getAttribute("original-url");
            port.postMessage({test_url: thisOriginalUrl});
            dovUrlBgMsgCounter += 1; // Increment counter when a background request is posted
            port.onMessage.addListener(function(msg) {
                // Filter out already removed or mismatching elements
                if(document.getElementById(id) === null || msg.url !== thisOriginalUrl) {return;}
                dovUrlBgMsgCounter -= 1; // Decrement counter when a background response is received
                if(dovUrlBgMsgCounter === 0){ // Close connection with bg script when all requests are returned
                    port.disconnect();
                    portIsOpen = false;
                }
                if(msg.status !== 200 || msg.content_type == undefined || msg.content_type.startsWith("text/html")) {
                    thisIconBesideLinkElement.remove();
                }
            });
        });
        /*
        Closing id port is found open after given timeout.
        Ideally, this is not needed and port should be closed as soon as all the messages are received.
        In fact, closing after timeout like this may also lead to side effects.
        But this will help to keep the port closed after timeout if in any case not closed properly.
         */
        setTimeout(function() {
            if(portIsOpen){
                // console.log("Disconnecting port... Background script is found connected after timeout."); // Debug
                port.disconnect();
                portIsOpen = false;
            }
        }, 10000); // Disconnect port after specified delay to avoid missing messages
    }


    function appendDovIconToAllNodes(docLinks) {
        let dovIconIdArrLocal = Array.apply(null, docLinks)
            .filter( docLinkItem => !(docLinkItem === "" || typeof(docLinkItem) === "undefined" || docLinkItem === null))
            .map( validDocLinkItem => new DocLink(validDocLinkItem).appendDovIcon());
        // Determine file types by reading Content-Type and remove icon beside invalid links
        removeDovIconForLinksWithHtmlContent(dovIconIdArrLocal);
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
