
function flash_options_status(message, time) {
    var status = document.getElementById('status');
    status.textContent = message;
    setTimeout(function () {
        status.textContent = '';
    }, time);
}


// Saves options to chrome.storage.sync.
function save_options() {
    var thisUserPreferences = JSON.parse(userPrefJSON_default);
    var thisUserConfig = new userConfig(thisUserPreferences);
    // Loading General /  New tab option
    thisUserConfig.setIconClickNewtab(document.getElementById('pref-dov-icon-newtab').checked);
    var thisUserPreferencesStr = JSON.stringify(thisUserConfig.getPreferences());
    chrome.storage.sync.set({
        user_config:thisUserPreferencesStr
    }, function () {
        // Update status to let user know options were saved.
        flash_options_status('Options saved.', 750);
    });
}


// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Default value of dovIconNewtab = false.
    chrome.storage.sync.get({
        user_config: userPrefJSON_default
    }, function (items) {
        var thisUserPreferences = JSON.parse(items.user_config);
        var thisUserConfig = new userConfig(thisUserPreferences);
        // Restoring General / New tab option
        document.getElementById('pref-dov-icon-newtab').checked = thisUserConfig.isIconClickNewtab();
        // Restoring file extension options
        document.getElementById('pref-filetype-enable-ai').checked = thisUserConfig.isFiletypeEnabled("ai");
        document.getElementById('pref-filetype-enable-csv').checked = thisUserConfig.isFiletypeEnabled("csv");
        document.getElementById('pref-filetype-enable-doc').checked = thisUserConfig.isFiletypeEnabled("doc");
        document.getElementById('pref-filetype-enable-docx').checked = thisUserConfig.isFiletypeEnabled("docx");
        document.getElementById('pref-filetype-enable-dxf').checked = thisUserConfig.isFiletypeEnabled("dxf");
        document.getElementById('pref-filetype-enable-eps').checked = thisUserConfig.isFiletypeEnabled("eps");
        document.getElementById('pref-filetype-enable-odp').checked = thisUserConfig.isFiletypeEnabled("odp");
        document.getElementById('pref-filetype-enable-ods').checked = thisUserConfig.isFiletypeEnabled("ods");
        document.getElementById('pref-filetype-enable-odt').checked = thisUserConfig.isFiletypeEnabled("odt");
        document.getElementById('pref-filetype-enable-pages').checked = thisUserConfig.isFiletypeEnabled("pages");
        document.getElementById('pref-filetype-enable-pdf').checked = thisUserConfig.isFiletypeEnabled("pdf");
        document.getElementById('pref-filetype-enable-pps').checked = thisUserConfig.isFiletypeEnabled("pps");
        document.getElementById('pref-filetype-enable-ppt').checked = thisUserConfig.isFiletypeEnabled("ppt");
        document.getElementById('pref-filetype-enable-pptx').checked = thisUserConfig.isFiletypeEnabled("pptx");
        document.getElementById('pref-filetype-enable-ps').checked = thisUserConfig.isFiletypeEnabled("ps");
        document.getElementById('pref-filetype-enable-psd').checked = thisUserConfig.isFiletypeEnabled("psd");
        document.getElementById('pref-filetype-enable-rtf').checked = thisUserConfig.isFiletypeEnabled("rtf");
        document.getElementById('pref-filetype-enable-sxc').checked = thisUserConfig.isFiletypeEnabled("sxc");
        document.getElementById('pref-filetype-enable-sxi').checked = thisUserConfig.isFiletypeEnabled("sxi");
        document.getElementById('pref-filetype-enable-sxw').checked = thisUserConfig.isFiletypeEnabled("sxw");
        document.getElementById('pref-filetype-enable-tif').checked = thisUserConfig.isFiletypeEnabled("tif");
        document.getElementById('pref-filetype-enable-tiff').checked = thisUserConfig.isFiletypeEnabled("tiff");
        document.getElementById('pref-filetype-enable-ttf').checked = thisUserConfig.isFiletypeEnabled("ttf");
        document.getElementById('pref-filetype-enable-wpd').checked = thisUserConfig.isFiletypeEnabled("wpd");
        document.getElementById('pref-filetype-enable-xls').checked = thisUserConfig.isFiletypeEnabled("xls");
        document.getElementById('pref-filetype-enable-xlsx').checked = thisUserConfig.isFiletypeEnabled("xlsx");
        document.getElementById('pref-filetype-enable-xps').checked = thisUserConfig.isFiletypeEnabled("xps");
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);