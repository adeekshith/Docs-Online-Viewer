
var userPrefJSON_default =
    '{                                                                                                      \
        "application" : {                                                                                   \
            "name" : "Docs Online Viewer",                                                                  \
            "app_id" : "docs-online-viewer@deekshith.in",                                                   \
            "version" : "v5.5.6"                                                                            \
        },                                                                                                  \
        "user_preferences" : {                                                                              \
            "version" : "0.1",                                                                              \
            "icon_beside_doc_links" : {                                                                     \
                "enabled" : true,                                                                           \
                "icon_path": "images/beside-link-icon.png",                                                 \
                "newtab_on_click" : false                                                                   \
            },                                                                                              \
            "file_types" : [                                                                                \
                {"extension" : "ai",    "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "csv",   "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "doc",   "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "docx",  "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "dxf",   "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "eps",   "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "odp",   "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "ods",   "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "odt",   "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "pages", "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "pdf",   "enabled" : false, "preferred_service" : "google_docs"},            \
                {"extension" : "pps",   "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "ppt",   "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "pptx",  "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "ps",    "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "psd",   "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "rtf",   "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "sxc",   "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "sxi",   "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "sxw",   "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "tif",   "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "tiff",  "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "ttf",   "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "wpd",   "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "xls",   "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "xlsx",  "enabled" : true,  "preferred_service" : "google_docs"},            \
                {"extension" : "xps",   "enabled" : true,  "preferred_service" : "google_docs"}             \
            ]                                                                                               \
        }                                                                                                   \
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