/**
 * @file
 * This content script provides interface for Google Docs viewer interface
 * when opened using Docs Online Viewer
 *
 * @author Deekshith Allamaneni
 * @copyright 2015 Docs Online Viewer
 */


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


if(Number.isNaN(getVar('dov')) === false) { // 'dov' url param should be a number
	// This block is entered only if the link is opened by Docs Online Viewer
	create_help_button();
}