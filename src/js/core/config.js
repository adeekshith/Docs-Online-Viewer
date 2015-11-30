/**
 * Created by Deekshith Allamaneni on 11/23/15.
 */


const userPrefJSON_default =
    '{                                                                                                      \
        "application" : {                                                                                   \
            "name" : "Docs Online Viewer",                                                                  \
            "app_id" : "docs-online-viewer@deekshith.in",                                                   \
            "version" : "v6.1.0"                                                                            \
        },                                                                                                  \
        "user_preferences" : {                                                                              \
            "version" : "0.1",                                                                              \
            "icon_beside_doc_links" : {                                                                     \
                "enabled" : true,                                                                           \
                "icon_path": "images/beside-link-icon.svg",                                                 \
                "newtab_on_click" : false                                                                   \
            },                                                                                              \
            "file_types" : [                                                                                \
                {"extension" : "ai",    "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "csv",   "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "doc",   "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "docx",  "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "dxf",   "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "eps",   "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "odp",   "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "ods",   "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "odt",   "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "pages", "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "pdf",   "is_enabled" : false, "preferred_service" : "google_docs"},         \
                {"extension" : "pps",   "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "ppt",   "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "pptx",  "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "ps",    "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "psd",   "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "rtf",   "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "sxc",   "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "sxi",   "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "sxw",   "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "tif",   "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "tiff",  "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "ttf",   "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "wpd",   "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "xls",   "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "xlsx",  "is_enabled" : true,  "preferred_service" : "google_docs"},         \
                {"extension" : "xps",   "is_enabled" : true,  "preferred_service" : "google_docs"}          \
            ],                                                                                              \
            "privacy" : {                                                                                   \
                "collect_stats" : false                                                                     \
            }                                                                                               \
        }                                                                                                   \
     }';


const coreInfoJSON =
    '{                                                                                                                          \
        "application" : {                                                                                                       \
            "name" : "Docs Online Viewer",                                                                                      \
            "app_id" : "docs-online-viewer@deekshith.in",                                                                       \
            "version" : "v6.1.0"                                                                                                \
        },                                                                                                                      \
        "data" : {                                                                                                              \
            "version" : 0.1,                                                                                                    \
            "services":[                                                                                                        \
                {                                                                                                               \
                    "name" : "Google Docs",                                                                                     \
                    "id" : "google_docs",                                                                                       \
                    "is_supported" : true,                                                                                      \
                    "file_extensions" : ["ai", "csv", "doc", "docx", "dxf", "eps", "odp", "ods", "odt",                         \
                                         "pages", "pdf", "pps", "ppt", "pptx", "ps", "psd", "rtf", "sxc",                       \
                                         "sxi", "sxw", "tif", "tiff", "ttf", "wpd", "xls", "xlsx", "xps"],                      \
                    "file_open_API" : "https://docs.google.com/viewer?url={$file_url}&embedded=false&chrome=false&dov=1"        \
                },                                                                                                              \
                {                                                                                                               \
                    "name" : "Microsoft Office Online",                                                                         \
                    "id" : "mso_online",                                                                                        \
                    "is_supported" : true,                                                                                      \
                    "file_extensions" : ["doc", "docx", "ppt", "pptx", "xls", "xlsx"],                                          \
                    "file_open_API" : "https://docs.google.com/viewer?url={$file_url}&embedded=false&chrome=false&dov=1"        \
                },                                                                                                              \
                {                                                                                                               \
                    "name" : "rollApp",                                                                                         \
                    "id" : "roll_app",                                                                                          \
                    "is_supported" : true,                                                                                      \
                    "file_extensions" : ["zip", "rar"],                                                                         \
                    "file_open_API" : "https://www.rollapp.com/api/apps/open?file_url={$file_url}&open_with={$preferred_app}"   \
                }                                                                                                               \
            ]                                                                                                                   \
        }                                                                                                                       \
    }';


function UserConfig (userPreferencesJSON) {
    this.userPreferencesJSON_ = userPreferencesJSON;
}
UserConfig.prototype.getuserPrefVersion = function() {
    return this.userPreferencesJSON_.user_preferences.version;
};
UserConfig.prototype.isIconBesideDocLinksEnabled = function() {
    return this.userPreferencesJSON_.user_preferences.icon_beside_doc_links.enabled;
};
UserConfig.prototype.setIconBesideDocLinksEnable = function (userInput) {
    if(typeof(userInput) === "boolean") {
        this.userPreferencesJSON_.user_preferences.icon_beside_doc_links.enabled = userInput;
        return true;
    }else {
        return false;
    }
};
UserConfig.prototype.isIconClickNewtab = function() {
    return this.userPreferencesJSON_.user_preferences.icon_beside_doc_links.newtab_on_click;
};
UserConfig.prototype.setIconClickNewtab = function (userInput) {
    if(typeof(userInput) === "boolean") {
        this.userPreferencesJSON_.user_preferences.icon_beside_doc_links.newtab_on_click = userInput;
        return true;
    }else {
        return false;
    }
};
UserConfig.prototype.isFiletypeEnabled = function (fileType) {
    var thisUserPrefJSON = this.userPreferencesJSON_;
    var thisFiletypeEnabled = thisUserPrefJSON.user_preferences.file_types.some( function (thisFileTypeObj) {
        if (thisFileTypeObj.extension === fileType) {
            return thisFileTypeObj.is_enabled;
        }
    });
    return thisFiletypeEnabled;
};
UserConfig.prototype.setFiletypeEnable = function (fileType, userInput) {
    var thisUserPrefJSON = this.userPreferencesJSON_;
    if(typeof(userInput) === "boolean") {
        var indexFiletype = 0;
        thisUserPrefJSON.user_preferences.file_types.some( function (thisFileTypeObj) {
            if (thisFileTypeObj.extension === fileType) {
                thisUserPrefJSON.user_preferences.file_types[indexFiletype].is_enabled = userInput;
                return thisFileTypeObj.is_enabled;
            }
            indexFiletype += 1;
        });
        this.userPreferencesJSON_ = thisUserPrefJSON;
    }else {
        return false;
    }
};
UserConfig.prototype.getPrivacyCollectStatsStatus = function () {
    return this.userPreferencesJSON_.user_preferences.privacy.collect_stats;
};
UserConfig.prototype.setPrivacyCollectStatsStatus = function (userInput) {
    if(typeof(userInput) === "boolean") {
        this.userPreferencesJSON_.user_preferences.privacy.collect_stats = userInput;
    }
};
UserConfig.prototype.getPreferences = function () {
    return this.userPreferencesJSON_;
};
