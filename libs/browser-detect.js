/**
 * Created by Deekshith Allamaneni on 1/23/16.
 */
"use strict";

function detectBrowser(userAgent) {
    "use strict";
    let browserNames = ["OPR", "Chrome", "Firefox"];
    let userAgentMatches = browserNames
        .map( browserName =>
            userAgent.match(RegExp('\\b('+browserName+')\\/[0-9.]+', 'g')))
        .filter( thisMatch =>
        thisMatch !== null);
    let browserInfo = userAgentMatches.length >= 0
        ? userAgentMatches[0].toString() // Ex: Firefox/45.02
        : null;
    return {browser_name: browserInfo.split("/")[0], browser_version: browserInfo.split("/")[1]};
}
