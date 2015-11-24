
function flash_options_status(message, time) {
    var status = document.getElementById('status');
    status.textContent = message;
    setTimeout(function () {
        status.textContent = '';
    }, time);
}


// Saves options to chrome.storage.sync.
function save_options() {
    var dovIconNewtab = document.getElementById('pref-dov-icon-newtab').checked;
    var thisUserPreferences = JSON.parse(userPrefJSON_default);
    thisUserPreferences.user_preferences.icon_beside_doc_links.newtab_on_click = dovIconNewtab;
    var thisUserPreferencesStr = JSON.stringify(thisUserPreferences);
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
        // Restoring General / New tab option
        document.getElementById('pref-dov-icon-newtab').checked = thisUserPreferences.user_preferences.icon_beside_doc_links.newtab_on_click;
        // Restoring file extension options
        document.getElementById('pref-filetype-enable-ai').checked = thisUserPreferences.user_preferences.file_types[0].is_enabled;
        document.getElementById('pref-filetype-enable-csv').checked = thisUserPreferences.user_preferences.file_types[1].is_enabled;
        document.getElementById('pref-filetype-enable-doc').checked = thisUserPreferences.user_preferences.file_types[2].is_enabled;
        document.getElementById('pref-filetype-enable-docx').checked = thisUserPreferences.user_preferences.file_types[3].is_enabled;
        document.getElementById('pref-filetype-enable-dxf').checked = thisUserPreferences.user_preferences.file_types[4].is_enabled;
        document.getElementById('pref-filetype-enable-eps').checked = thisUserPreferences.user_preferences.file_types[5].is_enabled;
        document.getElementById('pref-filetype-enable-odp').checked = thisUserPreferences.user_preferences.file_types[6].is_enabled;
        document.getElementById('pref-filetype-enable-ods').checked = thisUserPreferences.user_preferences.file_types[7].is_enabled;
        document.getElementById('pref-filetype-enable-odt').checked = thisUserPreferences.user_preferences.file_types[8].is_enabled;
        document.getElementById('pref-filetype-enable-pages').checked = thisUserPreferences.user_preferences.file_types[9].is_enabled;
        document.getElementById('pref-filetype-enable-pdf').checked = thisUserPreferences.user_preferences.file_types[10].is_enabled;
        document.getElementById('pref-filetype-enable-pps').checked = thisUserPreferences.user_preferences.file_types[11].is_enabled;
        document.getElementById('pref-filetype-enable-ppt').checked = thisUserPreferences.user_preferences.file_types[12].is_enabled;
        document.getElementById('pref-filetype-enable-pptx').checked = thisUserPreferences.user_preferences.file_types[13].is_enabled;
        document.getElementById('pref-filetype-enable-ps').checked = thisUserPreferences.user_preferences.file_types[14].is_enabled;
        document.getElementById('pref-filetype-enable-psd').checked = thisUserPreferences.user_preferences.file_types[15].is_enabled;
        document.getElementById('pref-filetype-enable-rtf').checked = thisUserPreferences.user_preferences.file_types[16].is_enabled;
        document.getElementById('pref-filetype-enable-sxc').checked = thisUserPreferences.user_preferences.file_types[17].is_enabled;
        document.getElementById('pref-filetype-enable-sxi').checked = thisUserPreferences.user_preferences.file_types[18].is_enabled;
        document.getElementById('pref-filetype-enable-sxw').checked = thisUserPreferences.user_preferences.file_types[19].is_enabled;
        document.getElementById('pref-filetype-enable-tif').checked = thisUserPreferences.user_preferences.file_types[20].is_enabled;
        document.getElementById('pref-filetype-enable-tiff').checked = thisUserPreferences.user_preferences.file_types[21].is_enabled;
        document.getElementById('pref-filetype-enable-ttf').checked = thisUserPreferences.user_preferences.file_types[22].is_enabled;
        document.getElementById('pref-filetype-enable-wpd').checked = thisUserPreferences.user_preferences.file_types[23].is_enabled;
        document.getElementById('pref-filetype-enable-xls').checked = thisUserPreferences.user_preferences.file_types[24].is_enabled;
        document.getElementById('pref-filetype-enable-xlsx').checked = thisUserPreferences.user_preferences.file_types[25].is_enabled;
        document.getElementById('pref-filetype-enable-xps').checked = thisUserPreferences.user_preferences.file_types[26].is_enabled;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);