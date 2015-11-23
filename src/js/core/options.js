
var userPrefJSON_default =
    '{                                                      \
        "application" : {                                   \
            "name" : "Docs Online Viewer",                  \
            "app_id" : "docs-online-viewer@deekshith.in",   \
            "version" : "v5.5.6"                            \
        },                                                  \
        "user_preferences" : {                              \
            "version" : "0.1",                              \
            "icon_beside_doc_links" : {                     \
                "enabled" : true,                           \
                "icon_path": "images/beside-link-icon.png", \
                "newtab_on_click" : false                   \
            }                                               \
        }                                                   \
     }';


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
        document.getElementById('pref-dov-icon-newtab').checked = thisUserPreferences.user_preferences.icon_beside_doc_links.newtab_on_click;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);