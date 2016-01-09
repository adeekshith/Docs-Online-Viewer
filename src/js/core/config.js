/**
 * Created by Deekshith Allamaneni on 11/23/15.
 */

"use strict";

function UserConfig (userPreferencesJSON) {
    this.userPreferencesJSON_ = userPreferencesJSON;
}
UserConfig.prototype.getUserPrefVersion = function() {
    return this.userPreferencesJSON_.user_preferences.version;
};
UserConfig.prototype.isIconBesideDocLinksEnabled = function() {
    return this.userPreferencesJSON_.user_preferences.icon_beside_doc_links.enabled;
};
UserConfig.prototype.setIconBesideDocLinksEnable = function (userInput) {
    if(typeof(userInput) !== "boolean") {console.log("Invalid input params"); return false;}
    this.userPreferencesJSON_.user_preferences.icon_beside_doc_links.enabled = userInput;
    return true;
};
UserConfig.prototype.getBesideDocLinksIconPath = function() {
    return this.userPreferencesJSON_.user_preferences.icon_beside_doc_links.icon_path;
};
UserConfig.prototype.isIconClickNewtab = function() {
    return this.userPreferencesJSON_.user_preferences.icon_beside_doc_links.newtab_on_click;
};
UserConfig.prototype.setIconClickNewtab = function (userInput) {
    if(typeof(userInput) !== "boolean") {console.log("Invalid input params"); return false;}
    this.userPreferencesJSON_.user_preferences.icon_beside_doc_links.newtab_on_click = userInput;
    return true;
};
UserConfig.prototype.isFiletypeEnabled = function (fileType) {
    return (this.userPreferencesJSON_.user_preferences.file_types
        .findIndex( (thisFileTypeObj) => thisFileTypeObj.extension === fileType && thisFileTypeObj.is_enabled ) !== -1);
};
UserConfig.prototype.setFiletypeEnable = function (fileType, userInput) {
    if(typeof(userInput) !== "boolean") {console.log("Invalid input params"); return false;}
    let indexFiletype = this.userPreferencesJSON_.user_preferences.file_types
        .findIndex( (thisFileTypeObj) => thisFileTypeObj.extension === fileType );
    this.userPreferencesJSON_.user_preferences.file_types[indexFiletype].is_enabled = userInput;
};
UserConfig.prototype.getPrivacyCollectStatsStatus = function () {
    return this.userPreferencesJSON_.user_preferences.privacy.collect_stats;
};
UserConfig.prototype.setPrivacyCollectStatsStatus = function (userInput) {
    if(typeof(userInput) !== "boolean") {console.log("Invalid input params"); return false;}
    this.userPreferencesJSON_.user_preferences.privacy.collect_stats = userInput;
};
UserConfig.prototype.getPreferences = function () {
    return this.userPreferencesJSON_;
};
