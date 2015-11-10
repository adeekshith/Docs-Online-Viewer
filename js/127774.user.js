// ==UserScript==
// @name           Docs Online Viewer
// @version        4.2.9
// @author         Deekshith Allamaneni
// @namespace      http://adeekshith.blogspot.com
// @description    Open documents and files online directly in your browser using online services like Google Docs Viewer, etc.
// @include        *
// @include        https://docs.google.com/*
// @exclude        http://www.mediafire.com/*
// @exclude        https://mail.google.com/*
// @exclude        *.pdf
// @copyright 2012, Deekshith Allamaneni (http://www.deekshith.in)
// @license GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @contributor Supriyo Biswas
// @contributor Rohit Mewada (http://userscripts.org/users/471739)
// @contributor Cytochrome (http://userscripts.org/users/cytochrome)
// @contributor Mike Cupcake (http://userscripts.org/users/mikecupcake)
// ==/UserScript==+


/*

___________________________________________________________


 Author:          Deekshith Allamaneni
 Support Website: <http://www.deekshith.in>
 Support Email:   dkh <dot> hyd <at> gmail <dot> com
 For quick support visit: <http://www.facebook.com/adeekshith>
 Userscripts.org URL: <http://userscripts.org/scripts/show/127774>

___________________________________________________________
 
Developers and Contributors:
	1. Deekshith Allamaneni
		Author and maintainer of this project.
	2. Supriyo Biswas
		Made many tweaks to the script including New icon, replacing external icon URL with DATA URI, Improved readability ogf the script and helped remove redundancies, and many more small but significant and important usability and developer friendly changes. Also, implemented regex based site blocking for faulty domains.
	3. Rohit Mewada
		Implemented neatly designed floating help button.
		http://userscripts.org/users/rohitmewada
	3. Cytochrome
		Contributed code for mouse-over-panels for google docs viewer. This has improved the usability of the script.
	4. Mike Cupcake
 		Mike has re-written this script based on Docs Online Viewer 2.0.1 and improved its performance. Mike's contribution to the script not only improved its performance but also made the code easy to debug and maintain.
 		http://userscripts.org/users/mikecupcake
	5. Arpit Kumar
 		Arpit's code was the idea on which Docs Online Viewer was originally based. Although most part of the code by Arpit is now replaced with a more efficient code, his contribution to this project has helped a lot.
 		http://blog.arpitnext.com/
	6. Abkeeper
 		Abkeeper has packaged this script as an addon for Maxthon browser. http://userscripts.org/users/462160
	7. Why not you?
 		You are welcome and encourages to work on the code. It is neatly structured and open for you to hack on it. You can customize it to your needs or improve it. I will be very thankful to you if you can contribute the changes you've made to it.
___________________________________________________________
 Version 4.2.8 Release Notes
  1. Minor bug fix for Tampermonkey to include docs.google.com and add the help button.
  2. Mouse over icon Title tweaked. Shortened.
 
 Version 4.2.5 Release Notes
  1. Implemented Blocking of Unsupported Links.
  2. Fixed recognizing extensions irrespective of case.
  3. Added a small Help Button for quick support.

 Version 4.1.3 Release Notes
  1. New link icon with Data URI.
  2. Mouse Over Panels for Google Docs Viewer.
  3. Mouse over title tweak.
  4. Removed support for Zoho Viewer as Zoho is soon dropping Zoho Viewer service.
___________________________________________________________

 Docs Online Viewer - Opens all the supported files publicly available online using online services.
 
 Copyright (C) 2012 Deekshith Allamaneni
 
 This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
 
 Icon used is derived from the Crystal Clear icon set <http://www.everaldo.com/crystal/>, under the GNU General Public License, as stated here <http://www.everaldo.com/crystal/?action=license>

___________________________________________________________
	
*/
(function(){
var docLinks = document.links;
var fileTypes1 = ["doc","pdf","docx","xls","xlsx","ppt","pps","pptx","eps","ps","tif","tiff","ai","psd","pages","dxf","ttf","xps","odt","odp","rtf","csv","ods","wpd","sxi","sxc","sxw"];
var doCheck = true;
var dov_host =/(docs\.google\.com|sourceforge\.net|adf\.ly|mediafire\.com|springerlink\.com|ziddu\.com|ieee\.org|issuu\.com|asaha\.com|office\.live\.com)$/

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
		if (!((docLinks[i].host).match(dov_host)) && !docLinks[i].docView){
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
	ico.src =  'data:image/png;base64,' +
		'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';
	//"data:image/png;base64,iVBORw0K...." This is a Data URI. This approach is better than using external URL.
	// Adjusts the margin of the icon to the given number of pixels (3 to 5px is advisable)
	ico.style.marginLeft = "3px";
	ico.style.width = "16px";
	ico.style.height = "16px";
	viewLink.appendChild(ico);
	// Sets the icon link to open in new tab
    viewLink.setAttribute("target", "_blank");    
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


function create_help_button() {
	if(document.body){
		//solarizedDark();
		var a = document.createElement('span');
		//a.innerHTML = "<a style=\"font-weight:bold;color:#333333\" href=\"http://www.deekshith.in/p/docs-online-viewer.html?dovver=405\" 	target='_blank'>?</a>";
		a.innerHTML = "<a style=\"font-weight:bold;color:#000000\" href=\"#\" title=\"Solarized Dark\">S</a>";
		var c = "opacity:0.7;position:fixed;text-align:right;right:30px;bottom:0px;z-index:50000;";
		c+="border: 2px solid;-moz-border-top-colors: ThreeDLightShadow ThreeDHighlight;-moz-border-right-colors: ThreeDDarkShadow 	ThreeDShadow;-moz-border-bottom-colors: ThreeDDarkShadow ThreeDShadow;-moz-border-left-colors: ThreeDLightShadow 	ThreeDHighlight;padding: 3px;color: MenuText;background-color: #000000;font-size:9pt;font-family:arial,sans-serif;cursor:pointer;";
		a.style.cssText = c;
		a.addEventListener('mouseover', function(){ a.style.opacity = 1; }, false);
		a.addEventListener('mouseout', function(){ a.style.opacity = 0.5; }, false);
		a.addEventListener('click', function(){ solarizedDark(); }, false);
		document.body.appendChild(a);

		var help = document.createElement('span');
		help.innerHTML = "<a style=\"font-weight:bold;color:#333333\" href=\"http://www.deekshith.in/p/docs-online-viewer.html?dovver=405\" 	target='_blank'>?</a>";
		//help.innerHTML = "<a style=\"font-weight:bold;color:#000000\" href=\"#\" alt=\"Solarized Dark\">?</a>";
		var c = "opacity:0.7;position:fixed;text-align:right;right:10px;bottom:0px;z-index:50000;";
		c+="border: 2px solid;-moz-border-top-colors: ThreeDLightShadow ThreeDHighlight;-moz-border-right-colors: ThreeDDarkShadow 	ThreeDShadow;-moz-border-bottom-colors: ThreeDDarkShadow ThreeDShadow;-moz-border-left-colors: ThreeDLightShadow 	ThreeDHighlight;padding: 3px;color: MenuText;background-color: Menu;font-size:9pt;font-family:arial,sans-serif;cursor:pointer;";
		help.style.cssText = c;
		help.addEventListener('mouseover', function(){ a.style.opacity = 1; }, false);
		help.addEventListener('mouseout', function(){ a.style.opacity = 0.5; }, false);
		help.addEventListener('click', function(){ }, false);
		document.body.appendChild(help);
	}
};

})();
