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
var fileTypes1 = ["doc","pdf","docx","xls","xlsx","ppt","pps","pptx","eps","ps","tif","tiff","ai","psd","pages","dxf","ttf","xps","odt","odp","rtf","csv","ods","wpd","sxi","sxc","sxw"];
var doCheck = true;
var dov_host_exclude =/(docs\.google\.com|sourceforge\.net|adf\.ly|mediafire\.com|springerlink\.com|ziddu\.com|ieee\.org|issuu\.com|asaha\.com|office\.live\.com)$/
// Include paths to exclude showing icon
var dov_href_exclude = /(https:\/\/github.com\/.*\/.*\/blob\/.*)/ 


function checkLinks()
{
	var supportedFileFormat=0;
	for (var i = 0; i < docLinks.length; ++i) 
	{
		supportedFileFormat=0;
		if (!((docLinks[i].host).match(dov_host_exclude)) && !((docLinks[i].href).match(dov_href_exclude)) && !docLinks[i].docView){
			for (var i2 = 0; i2 < fileTypes1.length; i2++) {
				var url = stripQuery(docLinks[i]);
				url=url.toLowerCase();
				if (endsWith(url, '.' + fileTypes1[i2]))
				{
				   changeLink(docLinks[i], 1, fileTypes1[i2]);
				   break;
				}
			}
       }
    // The link which is checked is flagged so that it is not repeatedly checked again.
	docLinks[i].docView=true;
   }
// console.log("...............................................................................");
}


function stripQuery(link) 
{	// remove any ?query in the URL	    
	return link.protocol + '//' + link.hostname + link.pathname; 
}


function endsWith(str, suffix) 
{  //  check if string has suffix 
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function changeLink(link, fileTypeCategory, fileExtension) { 
	var viewLink = document.createElement('a');
	if(fileTypeCategory == 1){
		viewLink.href = "https://docs.google.com/viewer?url="+encodeURI(stripQuery(link))+"&embedded=false&chrome=false&dov=1";
		/*
			Parameter description:
				embedded= <true> or <false>
					This is a standard google docs parameter
					true: It opens the document in embedded mode
					false: It opens the document in standard mode
				dov=1
					This is a custom parameter added by the script to tell that this URL is opened by Docs Online Viewer.
		*/
	}
	//viewLink.docView=true; -> This line is removed in this version but still doubt if it can really be removed.
	viewLink.title="View this \""+fileExtension+"\" file";
	var ico = document.createElement("img");
	ico.src =  chrome.extension.getURL("images/beside-link-icon.png");
	//"data:image/png;base64,iVBORw0K...." This is a Data URI. This approach is better than using external URL.
	// Adjusts the margin of the icon to the given number of pixels (3 to 5px is advisable)
	ico.style.marginLeft = "3px";
	ico.style.width = "16px";
	ico.style.height = "16px";
	viewLink.appendChild(ico);
	// Disabled opening link in new tab by default.
    // viewLink.setAttribute("target", "_blank");
    // Append the icon beside the link
	link.parentNode.insertBefore(viewLink , link.nextSibling);
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