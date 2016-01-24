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
    return userAgentMatches.length >= 0 ? userAgentMatches[0] : null;
}