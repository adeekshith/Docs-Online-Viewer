/**
 * Created by Deekshith Allamaneni on 11/23/15.
 */


const userPrefJSON_default =
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
            "version" : "v5.5.6"                                                                                                \
        },                                                                                                                      \
        "data" : {                                                                                                              \
            "version" : 0.1,                                                                                                    \
            "services":[                                                                                                        \
                {                                                                                                               \
                    "name" : "Google Docs",                                                                                     \
                    "id" : "google_docs",                                                                                       \
                    "is_supported" : true,                                                                                      \
                    "file_extensions" : ["ai", "csv", "doc", "docx", "dxf", "eps", "odp", "ods", "odt", "pages", "pdf", "pps", "ppt", "pptx", "ps", "psd", "rtf", "sxc", "sxi", "sxw", "tif", "tiff", "ttf", "wpd", "xls", "xlsx", "xps"],\
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
