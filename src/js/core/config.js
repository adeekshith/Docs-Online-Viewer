/**
 * Created by Deekshith Allamaneni on 11/23/15.
 */

"use strict";

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
UserConfig.prototype.getBesideDocLinksIconPath = function() {
    return this.userPreferencesJSON_.user_preferences.icon_beside_doc_links.icon_path;
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
    let thisUserPrefJSON = this.userPreferencesJSON_;
    let thisFiletypeEnabled = thisUserPrefJSON.user_preferences.file_types.some( function (thisFileTypeObj) {
        if (thisFileTypeObj.extension === fileType) {
            return thisFileTypeObj.is_enabled;
        }
    });
    return thisFiletypeEnabled;
};
UserConfig.prototype.setFiletypeEnable = function (fileType, userInput) {
    let thisUserPrefJSON = this.userPreferencesJSON_;
    if(typeof(userInput) === "boolean") {
        let indexFiletype = 0;
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
