// Saves options to chrome.storage.sync.
function save_options() {
    var dovIconNewtab = document.getElementById('pref-dov-icon-newtab').checked;
    chrome.storage.sync.set({
        dovIconNewtab: dovIconNewtab
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Default value of dovIconNewtab = false.
    chrome.storage.sync.get({
        dovIconNewtab: false
    }, function (items) {
        document.getElementById('dov-icon-newtab').checked = items.dovIconNewtab;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);