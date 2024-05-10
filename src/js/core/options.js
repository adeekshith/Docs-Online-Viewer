/**
 * Created by Deekshith Allamaneni.
 * Copyright 2016 Deekshith Allamaneni
 */

"use strict";

function flash_options_status(message, time) {
    let status = document.getElementById('status');
    let saveButton = document.getElementById('dov_save');
    saveButton.classList.add("disabled");
    status.textContent = message;
    setTimeout(function () {
        saveButton.classList.remove("disabled");
        status.textContent = '';
    }, time);
}


function getDefPrefsSaveOptions () {
    textFileLoad(chrome.runtime.getURL("data/user-preferences-default.json")).then(function(response) {
        // The first runs when the promise resolves, with the request.reponse
        // specified within the resolve() method.
        save_options(response);
        // The second runs when the promise
        // is rejected, and logs the Error specified with the reject() method.
    }, function(Error) {
        console.log(Error);
    });
}


// Saves options to chrome.storage.sync.
function save_options(userPrefDefaultJsonStr) {
    let thisUserPreferences = JSON.parse(userPrefDefaultJsonStr);
    let thisUserConfig = new UserConfig(thisUserPreferences);
    // Setting Options / General new tab preference.
    thisUserConfig.setIconClickNewtab(document.getElementById('pref-dov-icon-newtab').checked);
    // Setting Options / Filetype preferences
    thisUserConfig.setFiletypeEnable("ai", document.getElementById('pref-filetype-enable-ai').checked);
    thisUserConfig.setFiletypeEnable("csv", document.getElementById('pref-filetype-enable-csv').checked);
    thisUserConfig.setFiletypeEnable("doc", document.getElementById('pref-filetype-enable-doc').checked);
    thisUserConfig.setFiletypeEnable("docx", document.getElementById('pref-filetype-enable-docx').checked);
    thisUserConfig.setFiletypeEnable("dxf", document.getElementById('pref-filetype-enable-dxf').checked);
    thisUserConfig.setFiletypeEnable("eps", document.getElementById('pref-filetype-enable-eps').checked);
    thisUserConfig.setFiletypeEnable("odp", document.getElementById('pref-filetype-enable-odp').checked);
    thisUserConfig.setFiletypeEnable("ods", document.getElementById('pref-filetype-enable-ods').checked);
    thisUserConfig.setFiletypeEnable("odt", document.getElementById('pref-filetype-enable-odt').checked);
    thisUserConfig.setFiletypeEnable("pages", document.getElementById('pref-filetype-enable-pages').checked);
    thisUserConfig.setFiletypeEnable("pdf", document.getElementById('pref-filetype-enable-pdf').checked);
    thisUserConfig.setFiletypeEnable("pps", document.getElementById('pref-filetype-enable-pps').checked);
    thisUserConfig.setFiletypeEnable("ppt", document.getElementById('pref-filetype-enable-ppt').checked);
    thisUserConfig.setFiletypeEnable("pptx", document.getElementById('pref-filetype-enable-pptx').checked);
    thisUserConfig.setFiletypeEnable("ps", document.getElementById('pref-filetype-enable-ps').checked);
    thisUserConfig.setFiletypeEnable("psd", document.getElementById('pref-filetype-enable-psd').checked);
    thisUserConfig.setFiletypeEnable("rtf", document.getElementById('pref-filetype-enable-rtf').checked);
    thisUserConfig.setFiletypeEnable("sxc", document.getElementById('pref-filetype-enable-sxc').checked);
    thisUserConfig.setFiletypeEnable("sxi", document.getElementById('pref-filetype-enable-sxi').checked);
    thisUserConfig.setFiletypeEnable("sxw", document.getElementById('pref-filetype-enable-sxw').checked);
    thisUserConfig.setFiletypeEnable("tif", document.getElementById('pref-filetype-enable-tif').checked);
    thisUserConfig.setFiletypeEnable("tiff", document.getElementById('pref-filetype-enable-tiff').checked);
    thisUserConfig.setFiletypeEnable("ttf", document.getElementById('pref-filetype-enable-ttf').checked);
    thisUserConfig.setFiletypeEnable("wpd", document.getElementById('pref-filetype-enable-wpd').checked);
    thisUserConfig.setFiletypeEnable("xls", document.getElementById('pref-filetype-enable-xls').checked);
    thisUserConfig.setFiletypeEnable("xlsx", document.getElementById('pref-filetype-enable-xlsx').checked);
    thisUserConfig.setFiletypeEnable("xps", document.getElementById('pref-filetype-enable-xps').checked);
    // Setting Options / Privacy / Collect stats
    thisUserConfig.setPrivacyCollectStatsStatus(document.getElementById('pref-privacy-collect-stats').checked);
    let thisUserPreferencesStr = JSON.stringify(thisUserConfig.getPreferences());
    chrome.storage.sync.set({
        user_config:thisUserPreferencesStr
    }, function () {
        // Update status to let user know options were saved.
        flash_options_status('Options saved.', 750);
    });
}


function getDefPrefsRestoreOptions () {
    textFileLoad(chrome.runtime.getURL("data/user-preferences-default.json")).then(function(response) {
        // The first runs when the promise resolves, with the request.reponse
        // specified within the resolve() method.
        restore_options(response);
        // The second runs when the promise
        // is rejected, and logs the Error specified with the reject() method.
    }, function(Error) {
        console.log(Error);
    });
}


// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options(userPrefDefaultJsonStr) {
    // Default value of dovIconNewtab = false.
    chrome.storage.sync.get({
        user_config: userPrefDefaultJsonStr
    }, function (items) {
        let thisUserPreferences = JSON.parse(items.user_config);
        let thisUserConfig = new UserConfig(thisUserPreferences);
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
        // Restoring Privacy Options
        document.getElementById('pref-privacy-collect-stats').checked = thisUserConfig.getPrivacyCollectStatsStatus();
    });
}

function userLikesDOVView() {
    document.getElementById('dov-options-feedback').innerHTML =
        "<div class=\"row container text-center\">\
            <span class=\"hint--top\" data-hint=\"Encourage us and help others discover it by sharing your experience.\">\
            <a class=\"btn btn-success\" href=\"https://chrome.google.com/webstore/detail/docs-online-viewer/gmpljdlgcdkljlppaekciacdmdlhfeon/reviews\" target=\"_blank\">    \
                <i class=\"fa fa-thumbs-up fa-2x pull-left\"></i> &nbsp;&nbsp;&nbsp;Rate it&nbsp;&nbsp;&nbsp;<br/>\
                <i class=\"fa fa-star\"></i><i class=\"fa fa-star\"></i><i class=\"fa fa-star\"></i><i class=\"fa fa-star\"></i><i class=\"fa fa-star\"></i>\
            </a> \
            </span>\
        </div>\
        <br/>\
        <div class=\"row\">\
            <div class=\"text-muted\">Share it</div>\
            <a style=\"color: #3b5998\" href=\"https://www.facebook.com/sharer/sharer.php?u=http://dov.parishod.com/\"><i class=\"fa fa-facebook-square fa-2x\"></i></a>\
            <a style=\"color: #55acee\" href=\"https://twitter.com/share?text=View%20any%20file%20in%20your%20browser%20with%20Docs%20Online%20Viewer.&url=http://dov.parishod.com/\"><i class=\"fa fa-twitter-square fa-2x\"></i></a>\
            <a style=\"color: #d34836\" href=\"https://plus.google.com/share?url=http://dov.parishod.com/\"><i class=\"fa fa-google-plus-square fa-2x\"></i></a>\
        </div>";
}


function userDislikesDOVView() {
    document.getElementById('dov-options-feedback').innerHTML =
        "<h4>Report Issues</h4>\
        <div class=\"text-center\">\
            <a class=\"btn btn-warning\" href=\"https://github.com/adeekshith/Docs-Online-Viewer/issues\" target=\"_blank\">    \
                    <i class=\"fa fa-bug fa-2x pull-left\"></i> Report<br/>issues</a> \
            <br/>Sorry to know you have issues with it. Report them and we will try to resolve them as soon as possible. Thank you.\
        </div>";
}


document.addEventListener('DOMContentLoaded', getDefPrefsRestoreOptions);
document.getElementById('dov_save').addEventListener('click', getDefPrefsSaveOptions);

document.getElementById('user-liked-dov-options-feedback').addEventListener('click', userLikesDOVView);
document.getElementById('user-disliked-dov-options-feedback').addEventListener('click', userDislikesDOVView);
