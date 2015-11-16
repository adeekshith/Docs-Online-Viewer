/**
 * @file
 * Checks for document links in web pages and inserts
 * an icon beside the links to enable opening with
 * online services like Google Docs viewer.
 *
 * @author Deekshith Allamaneni
 * @copyright 2015 Docs Online Viewer
 */


(function(){
var docLinks = document.links;
const fileTypes1 = ["doc","pdf","docx","xls","xlsx","ppt","pps","pptx","eps","ps","tif","tiff","ai","psd","pages","dxf","ttf","xps","odt","odp","rtf","csv","ods","wpd","sxi","sxc","sxw"];
var doCheck = true;
const dov_host_exclude =/(docs\.google\.com|sourceforge\.net|adf\.ly|mediafire\.com|springerlink\.com|ziddu\.com|ieee\.org|issuu\.com|asaha\.com|office\.live\.com)$/
// Include paths to exclude showing icon
const dov_href_exclude = /(https:\/\/github.com\/.*\/.*\/blob\/.*)/ 


var DocLink = function (docLink) {
    this._docLink = docLink;
};
DocLink.prototype = {
    get hasSupportedExtension () {
        return fileTypes1.some( thisFileType => {
            var url = this._docLink.pathname.toLowerCase();
            if (url.endsWith('.' + thisFileType))
                return true;
        });
    },
    get isSupported () {
        return (!((this._docLink.host).match(dov_host_exclude)) 
            && !((this._docLink.href).match(dov_href_exclude)) 
            && this.hasSupportedExtension
            && this._docLink.innerText.length > 0); // Issue #6: No blank innerText
    },
    get isProcessed () {
        return this._docLink.docView;
    },
    get iconLink () { 
        var viewLink = document.createElement('a');
        viewLink.href = `https://docs.google.com/viewer?url=${encodeURI(this.queryStripped)}&embedded=false&chrome=false&dov=1`;
        /*
            Parameter description:
                embedded= <true>: to open google docs in embedded mode
                dov=1: If opened by Docs Online Viewer. Set by this script.
        */
        //viewLink.docView=true; -> This line is removed in this version but still doubt if it can really be removed.
        viewLink.title=`View this ${this.fileExtension} file`;
        var ico = document.createElement("img");
        ico.src =  chrome.extension.getURL("images/beside-link-icon.png");
        // Adjusts the margin of the icon to the given number of pixels (3 to 5px is advisable)
        ico.style.marginLeft = "3px";
        ico.style.width = "16px";
        ico.style.height = "16px";
        viewLink.appendChild(ico);
        // Disabled opening link in new tab by default.
        chrome.storage.sync.get({
            dovIconNewtab: false
            }, function(items) {
                if (items.dovIconNewtab) {
                    viewLink.setAttribute("target", "_blank");
                }
        });
        return viewLink;
    },
    get fileExtension () {
        var fUrl = this._docLink.pathname;
        fUrl=fUrl.toUpperCase();
        // Returns file extension. Returns "" if no valid extension
        // Ref: http://stackoverflow.com/a/1203361/3439460
        return fUrl.substr((~-fUrl.lastIndexOf(".") >>> 0) + 2);
    },
    get queryStripped() {
        // remove any ?query in the URL     
        return `${this._docLink.protocol}${'//'}${this._docLink.hostname}${this._docLink.pathname}`;
    }

}


function checkLinks()
{
	for (var i = 0; i < docLinks.length; ++i) 
	{
        var thisDocLink = new DocLink(docLinks[i]);
		if ( thisDocLink.isSupported && !thisDocLink.isProcessed) {
            // Append the icon beside the link
            docLinks[i].parentNode.insertBefore(thisDocLink.iconLink , docLinks[i].nextSibling);
        }
    // The link which is checked is flagged so that it is not repeatedly checked again.
	docLinks[i].docView=true;
   }
}


function setupListener()
{
	document.addEventListener('DOMNodeInserted',function(e)
	{
		if (doCheck)
		{
			doCheck = false;
			setTimeout(function(){checkLinks();doCheck = true;}, 1000);
		} 
  },false);
}

// Execute these functions
// to append icon beside document links and
// add listener for new nodes
checkLinks();
setupListener();

})();
