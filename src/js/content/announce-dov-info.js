/**
 * Created by Deekshith Allamaneni on 1/24/16.
 */
"use strict";

let homepageInstallBtnId = "dov-install-button";

function changeHomepageDovInstallBtnSuccess(homepageInstallBtnId) {
    let homepageInstallBtnElement = document.getElementById(homepageInstallBtnId);
    if (homepageInstallBtnElement === null) {return;}
    homepageInstallBtnElement.innerHTML = "Installed. Take a moment to rate it.";
    homepageInstallBtnElement.classList.remove("btn-primary");
    homepageInstallBtnElement.classList.add("btn-success");
}

changeHomepageDovInstallBtnSuccess(homepageInstallBtnId);