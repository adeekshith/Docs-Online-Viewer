/*
	Appends icon to Docs Online Viewer supported links and improves the interface 
	of the google docs interface opened using Docs Online Viewer.

	Author:          Deekshith Allamaneni
 	Support Website: <http://www.deekshith.in>
*/


(function(){
var docLinks = document.links;
var fileTypes1 = ["doc","pdf","docx","xls","xlsx","ppt","pps","pptx","eps","ps","tif","tiff","ai","psd","pages","dxf","ttf","xps","odt","odp","rtf","csv","ods","wpd","sxi","sxc","sxw"];
var doCheck = true;
var dov_host_exclude =/(docs\.google\.com|sourceforge\.net|adf\.ly|mediafire\.com|springerlink\.com|ziddu\.com|ieee\.org|issuu\.com|asaha\.com|office\.live\.com)$/
// Include paths to exclude showing icon
var dov_href_exclude = /(https:\/\/github.com\/.*\/.*\/blob\/.*)/ 

if(!checkIfDOV()){
	checkLinks();
	setupListener();
}

function checkIfDOV(){
	var url = window.location.href;
	
	if(url.indexOf("https://docs.google.com/viewer?")==0 )
	{	
		if(getVar('dov')==1)
		{
			// This block is entered only if the link is opened by Docs Online Viewer
			create_help_button();
		}
		return true;
	}
	else
	{
		return false;
	}
}

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
					This is a custom parameter added by the script to tell that this URL is opened by Docs Online Viewer. This avoids conflicts while using any similar scripts or when opening links with google docs by other scripts or directly. (esp in the case of mouseover).
						
			Also, some users have expressed their concern that if custom parameters (dov) are used for tracking. These parameters are used to identify that the link is opened using this script. This avoids a few conflicts between scripts, etc. 
			But no information of any kind is collected or transmitted either by the script or the author or contributors regarding the users. It is just to improve usability.
			Any better approach than this? May be using cookies is better? Please tell me if you find a better approach than using custom parameters.
			
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


function getVar(name)
{
	get_string = document.location.search;         
	return_value = '';
	do 
	{ //This loop is made to catch all instances of any get variable.
		name_index = get_string.indexOf(name + '=');
		if(name_index != -1)
		{
			get_string = get_string.substr(name_index + name.length + 1, get_string.length - name_index);
			end_of_value = get_string.indexOf('&');
			if(end_of_value != -1)                
				value = get_string.substr(0, end_of_value);                
			else                
				value = get_string;                
                
			if(return_value == '' || value == '')
				return_value += value;
			else
				return_value += ', ' + value;
		}
	} while(name_index != -1);

	//Restores all the blank spaces.
	space = return_value.indexOf('+');
	while(space != -1)
	{ 
		return_value = return_value.substr(0, space) + ' ' + 
		return_value.substr(space + 1, return_value.length);
		space = return_value.indexOf('+');
	}
          
	return(return_value);        
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



function solarizedDark() {
var css = "";
if (false || (document.location.href.indexOf("http://") == 0) || (document.location.href.indexOf("https://") == 0) || (document.location.href.indexOf("ftp://") == 0) || (document.location.href.indexOf("file://") == 0) || (location.href.replace(location.hash,'') == "about:blank") || (document.location.href.indexOf("about:neterror") == 0))
	css += "/* Firefox Scrollbars */\nscrollbar {opacity: .75 !important;}\n\n/*Vars\nbase03    #002b36 rgba(0,43,54,1);\nbase02    #073642 rgba(7,54,66,1);\nbase01    #586e75 rgba(88,110,117,1);\nbase00    #657b83 rgba(101,123,131,1);\nbase0     #839496 rgba(131,148,150,1);\nbase1     #93a1a1 rgba(147,161,161,1);\nbase2     #eee8d5 rgba(238,232,213,1);\nbase3     #fdf6e3 rgba(253,246,227,1);\nyellow    #b58900 rgba(181,137,0,1);\norange    #cb4b16 rgba(203,75,22,1);\nred       #dc322f rgba(220,50,47,1);\nmagenta   #d33682 rgba(211,54,130,1);\nviolet    #6c71c4 rgba(108,113,196,1);\nblue      #268bd2 rgba(38,139,210,1);\ncyan      #2aa198 rgba(42,161,152,1);\ngreen     #859900 rgba(133,153,0,1);\n*/\n\n/* Base */\n*, ::before, ::after {\ncolor: #93a1a1 !important; \nborder-color: #073642 !important;\noutline-color: #073642 !important;\ntext-shadow: none !important;\nbox-shadow: none !important;\n-moz-box-shadow: none !important;\nbackground-color: transparent !important;\n}\n\nhtml * {\ncolor: inherit !important;\n}\n\np::first-letter,\nh1::first-letter,\nh2::first-letter,\np::first-line {\n\ncolor: inherit !important; \nbackground: none !important;\n}\n\n/* :: Give solid BG :: */\n\n/* element */\nb,i,u,strong{color:#859900}\n\n\nhtml, \nbody,\nli ul,\nul li,\ntable,\nheader,\narticle,\nsection,\nnav,\nmenu,\naside,\n\n/* common */\n\n[class*=\"nav\"],\n[class*=\"open\"],\n[id*=\"ropdown\"], /*dropdown*/\n[class*=\"ropdown\"], \ndiv[class*=\"menu\"],\n[class*=\"tooltip\"],\ndiv[class*=\"popup\"], \ndiv[id*=\"popup\"],\n\n/* Notes, details, etc.  Maybe useful */\ndiv[id*=\"detail\"],div[class*=\"detail\"],\ndiv[class*=\"note\"], span[class*=\"note\"],\ndiv[class*=\"description\"],\n\n/* Also common */\ndiv[class*=\"content\"], div[class*=\"container\"],\n\n/* Popup divs that use visibility: hidden and display: none */\ndiv[style*=\"display: block\"], \ndiv[style*=\"visibility: visible\"] {\nbackground-color: #002b36 !important\n}\n\n\n\n/*: No BG :*/\n*:not(:empty):not(span):not([class=\"html5-volume-slider html5-draggable\"]):not([class=\"html5-player-chrome html5-stop-propagation\"]), *::before, *::after,\ntd:empty, p:empty, div:empty:not([role]):not([style*=\"flashblock\"]):not([class^=\"html5\"]):not([class*=\"noscriptPlaceholder\"]) {\nbackground-image: none !important;\n}\n\n/*: Filter non-icons :*/\nspan:not(:empty):not([class*=\"icon\"]):not([id*=\"icon\"]):not([class*=\"star\"]):not([id*=\"star\"]):not([id*=\"rating\"]):not([class*=\"rating\"]):not([class*=\"prite\"]) {\nbackground-image: none !important;\ntext-indent: 0 !important;\n}\n\n/*: Image opacity :*/\nimg, svg             {opacity: .75 !important;}\nimg:hover, svg:hover {opacity: 1 !important;}\n\n/* Highlight */\n::-moz-selection {\nbackground-color: #eee8d5 !important;\ncolor: #586e75 !important;\n}\n\n/* ::: anchor/links ::: */\n\na {\ncolor: #2aa198 !important; \nbackground-color: #002b36 !important;\nopacity: 1 !important; \ntext-indent: 0 !important;\n}\n\na:link         {color: #268bd2 !important;} /* hyperlink */\na:visited      {color: #6c71c4 !important;}\na:hover        {color: #b58900 !important; background-color: #073642 !important;}\na:active       {color: #cb4b16 !important;}\n\n/* \"Top level\" div */\n\nbody > div {background-color: inherit !important;}\n\n/* :::::: Text Presentation :::::: */\n\nsummary, details                   {background-color: inherit !important}\nkbd, time, label, .date            {color: #859900 !important}\nacronym, abbr                      {border-bottom: 1px dotted !important; cursor: help !important;}\nmark,code,pre,samp,blockquote      {background-color: #073642 !important}\n\n\n/* :::::: Headings :::::: */\n\nh1,h2,h3,h4,h5,h6  { \n\nbackground-image: none !important;\nborder-radius: 5px !important;\n-moz-border-radius: 5px !important;\n-webkit-border-radius: 5px !important; \ntext-indent: 0 !important;\n}\n\nh1,h2,h3,h4,h5,h6 {background-color: #073642 !important}\n\n\nh1,h2{color:#859900!important}\nh3,h4{color:#b58900!important}\nh5,h6{color:#cb4b16!important}\n\n/* :::::: Tables, cells :::::: */\n\ntable table {background: #073642 !important;}\nth, caption {background: #002b36 !important;}\n\n/* ::: Inputs, textareas ::: */\n\ninput, textarea, button,\nselect,option,optgroup{\n\ncolor: #586e75 !important;\nbackground: none #073642 !important;\n-moz-appearance: none !important; \n-webkit-appearance: none !important;\n}\n\ninput,\ntextarea, \nbutton {\nborder-color: #586e75 !important; \nborder-width: 1px !important;\n}\n\n/* :::::: Button styling :::::: */\n\ninput[type=\"button\"],\ninput[type=\"submit\"],\ninput[type=\"reset\"],\nbutton {\nbackground: #073642 !important;\n}\n\ninput[type=\"button\"]:hover,\ninput[type=\"submit\"]:hover,\ninput[type=\"reset\"]:hover,\nbutton:hover {\ncolor: #586e75 !important;\nbackground: #eee8d5 !important;\n}\n\ninput[type=\"image\"] {opacity: .85 !important}\ninput[type=\"image\"]:hover {opacity: .95 !important}\n\n/* Lightbox fix */\nhtml [id*=\"lightbox\"] * {background-color: transparent !important;}\nhtml [id*=\"lightbox\"] img {opacity: 1 !important;}\n\n/* Youtube Annotation */\n#movie_player-html5 .annotation {background: #073642 !important}\n\n/* Mozilla addons shrink/expand sections */\n.expando a {background: none transparent  !important;}";
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node); 
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
}

// solarizedLight() Not yet implemented. It is now just a copy of solarizedDark()
function solarizedLight() {
var css = "";
if (false || (document.location.href.indexOf("http://") == 0) || (document.location.href.indexOf("https://") == 0) || (document.location.href.indexOf("ftp://") == 0) || (document.location.href.indexOf("file://") == 0) || (location.href.replace(location.hash,'') == "about:blank") || (document.location.href.indexOf("about:neterror") == 0))
	css += "/* Firefox Scrollbars */\nscrollbar {opacity: .75 !important;}\n\n/*Vars\nbase03    #002b36 rgba(0,43,54,1);\nbase02    #073642 rgba(7,54,66,1);\nbase01    #586e75 rgba(88,110,117,1);\nbase00    #657b83 rgba(101,123,131,1);\nbase0     #839496 rgba(131,148,150,1);\nbase1     #93a1a1 rgba(147,161,161,1);\nbase2     #eee8d5 rgba(238,232,213,1);\nbase3     #fdf6e3 rgba(253,246,227,1);\nyellow    #b58900 rgba(181,137,0,1);\norange    #cb4b16 rgba(203,75,22,1);\nred       #dc322f rgba(220,50,47,1);\nmagenta   #d33682 rgba(211,54,130,1);\nviolet    #6c71c4 rgba(108,113,196,1);\nblue      #268bd2 rgba(38,139,210,1);\ncyan      #2aa198 rgba(42,161,152,1);\ngreen     #859900 rgba(133,153,0,1);\n*/\n\n/* Base */\n*, ::before, ::after {\ncolor: #93a1a1 !important; \nborder-color: #073642 !important;\noutline-color: #073642 !important;\ntext-shadow: none !important;\nbox-shadow: none !important;\n-moz-box-shadow: none !important;\nbackground-color: transparent !important;\n}\n\nhtml * {\ncolor: inherit !important;\n}\n\np::first-letter,\nh1::first-letter,\nh2::first-letter,\np::first-line {\n\ncolor: inherit !important; \nbackground: none !important;\n}\n\n/* :: Give solid BG :: */\n\n/* element */\nb,i,u,strong{color:#859900}\n\n\nhtml, \nbody,\nli ul,\nul li,\ntable,\nheader,\narticle,\nsection,\nnav,\nmenu,\naside,\n\n/* common */\n\n[class*=\"nav\"],\n[class*=\"open\"],\n[id*=\"ropdown\"], /*dropdown*/\n[class*=\"ropdown\"], \ndiv[class*=\"menu\"],\n[class*=\"tooltip\"],\ndiv[class*=\"popup\"], \ndiv[id*=\"popup\"],\n\n/* Notes, details, etc.  Maybe useful */\ndiv[id*=\"detail\"],div[class*=\"detail\"],\ndiv[class*=\"note\"], span[class*=\"note\"],\ndiv[class*=\"description\"],\n\n/* Also common */\ndiv[class*=\"content\"], div[class*=\"container\"],\n\n/* Popup divs that use visibility: hidden and display: none */\ndiv[style*=\"display: block\"], \ndiv[style*=\"visibility: visible\"] {\nbackground-color: #002b36 !important\n}\n\n\n\n/*: No BG :*/\n*:not(:empty):not(span):not([class=\"html5-volume-slider html5-draggable\"]):not([class=\"html5-player-chrome html5-stop-propagation\"]), *::before, *::after,\ntd:empty, p:empty, div:empty:not([role]):not([style*=\"flashblock\"]):not([class^=\"html5\"]):not([class*=\"noscriptPlaceholder\"]) {\nbackground-image: none !important;\n}\n\n/*: Filter non-icons :*/\nspan:not(:empty):not([class*=\"icon\"]):not([id*=\"icon\"]):not([class*=\"star\"]):not([id*=\"star\"]):not([id*=\"rating\"]):not([class*=\"rating\"]):not([class*=\"prite\"]) {\nbackground-image: none !important;\ntext-indent: 0 !important;\n}\n\n/*: Image opacity :*/\nimg, svg             {opacity: .75 !important;}\nimg:hover, svg:hover {opacity: 1 !important;}\n\n/* Highlight */\n::-moz-selection {\nbackground-color: #eee8d5 !important;\ncolor: #586e75 !important;\n}\n\n/* ::: anchor/links ::: */\n\na {\ncolor: #2aa198 !important; \nbackground-color: #002b36 !important;\nopacity: 1 !important; \ntext-indent: 0 !important;\n}\n\na:link         {color: #268bd2 !important;} /* hyperlink */\na:visited      {color: #6c71c4 !important;}\na:hover        {color: #b58900 !important; background-color: #073642 !important;}\na:active       {color: #cb4b16 !important;}\n\n/* \"Top level\" div */\n\nbody > div {background-color: inherit !important;}\n\n/* :::::: Text Presentation :::::: */\n\nsummary, details                   {background-color: inherit !important}\nkbd, time, label, .date            {color: #859900 !important}\nacronym, abbr                      {border-bottom: 1px dotted !important; cursor: help !important;}\nmark,code,pre,samp,blockquote      {background-color: #073642 !important}\n\n\n/* :::::: Headings :::::: */\n\nh1,h2,h3,h4,h5,h6  { \n\nbackground-image: none !important;\nborder-radius: 5px !important;\n-moz-border-radius: 5px !important;\n-webkit-border-radius: 5px !important; \ntext-indent: 0 !important;\n}\n\nh1,h2,h3,h4,h5,h6 {background-color: #073642 !important}\n\n\nh1,h2{color:#859900!important}\nh3,h4{color:#b58900!important}\nh5,h6{color:#cb4b16!important}\n\n/* :::::: Tables, cells :::::: */\n\ntable table {background: #073642 !important;}\nth, caption {background: #002b36 !important;}\n\n/* ::: Inputs, textareas ::: */\n\ninput, textarea, button,\nselect,option,optgroup{\n\ncolor: #586e75 !important;\nbackground: none #073642 !important;\n-moz-appearance: none !important; \n-webkit-appearance: none !important;\n}\n\ninput,\ntextarea, \nbutton {\nborder-color: #586e75 !important; \nborder-width: 1px !important;\n}\n\n/* :::::: Button styling :::::: */\n\ninput[type=\"button\"],\ninput[type=\"submit\"],\ninput[type=\"reset\"],\nbutton {\nbackground: #073642 !important;\n}\n\ninput[type=\"button\"]:hover,\ninput[type=\"submit\"]:hover,\ninput[type=\"reset\"]:hover,\nbutton:hover {\ncolor: #586e75 !important;\nbackground: #eee8d5 !important;\n}\n\ninput[type=\"image\"] {opacity: .85 !important}\ninput[type=\"image\"]:hover {opacity: .95 !important}\n\n/* Lightbox fix */\nhtml [id*=\"lightbox\"] * {background-color: transparent !important;}\nhtml [id*=\"lightbox\"] img {opacity: 1 !important;}\n\n/* Youtube Annotation */\n#movie_player-html5 .annotation {background: #073642 !important}\n\n/* Mozilla addons shrink/expand sections */\n.expando a {background: none transparent  !important;}";
if (false || (location.href.replace(location.hash,'') == "about:newtab"))
	css += "window {\nbackground: #002b36 !important;\n}\n\n#newtab-scrollbox {\nbackground: transparent none !important;\n}\n\n.newtab-title {\nbackground-color: rgba(0,43,54,1) !important; \ncolor: #93a1a1 !important;\n}";
if (false || (location.href.replace(location.hash,'') == "chrome://browser/content/browser.xul"))
	css += "/* Browser Background */\nbrowser[type=\"content-primary\"] {\nbackground-color: #002b36 !important;\n}";
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node); 
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
}


function create_theme_toggle_button() {
	if(document.body){
		var a = document.createElement('span');
		a.innerHTML = "<a style=\"font-weight:bold;color:#000000\" href=\"#\" title=\"Solarized Dark\">S</a>";
		var c = "opacity:0.7;position:fixed;text-align:right;right:30px;bottom:0px;z-index:50000;";
		c+="border: 2px solid;-moz-border-top-colors: ThreeDLightShadow ThreeDHighlight;-moz-border-right-colors: ThreeDDarkShadow 	ThreeDShadow;-moz-border-bottom-colors: ThreeDDarkShadow ThreeDShadow;-moz-border-left-colors: ThreeDLightShadow 	ThreeDHighlight;padding: 3px;color: MenuText;background-color: #000000;font-size:9pt;font-family:arial,sans-serif;cursor:pointer;";
		a.style.cssText = c;
		a.addEventListener('mouseover', function(){ a.style.opacity = 1; }, false);
		a.addEventListener('mouseout', function(){ a.style.opacity = 0.5; }, false);
		a.addEventListener('click', function(){ solarizedDark(); }, false);
		document.body.appendChild(a);
	}
}


function create_help_button() {
	if(document.body){
		var help = document.createElement('span');
		help.innerHTML = "<a style=\"color: #D0D0D0; text-decoration: none;\" href=\"http://www.deekshith.in/p/docs-online-viewer.html?dovver=405\" 	target='_blank'>?</a>";
		var c = "opacity:0.7;position:fixed;text-align:right;right:30px;bottom:0px;z-index:50000;-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #ffffff;font-size: 14px;background: #404040;padding: 6px 10px 6px 10px;text-decoration: none;";
		help.style.cssText = c;
		help.addEventListener('mouseover', function(){ a.style.opacity = 1; }, false);
		help.addEventListener('mouseout', function(){ a.style.opacity = 0.5; }, false);
		help.addEventListener('click', function(){ }, false);
		document.body.appendChild(help);
	}
};

})();
