/**
 * Authors: Deekshith Allamaneni, Uday Kumar Swarnapuri
 * Copyright Deekshith Allamaneni 2016
 */
"use strict";

function getAllUrlParameters(url) {
    if(typeof url !== "string" || url.indexOf("?") === -1) {return null;}
    return url
        .substring( // Extracting GET params of the URL which is a substring ...
            url.indexOf("?")+1, // after character "?" ...
            url.indexOf("#") !== -1
                ? url.indexOf("#") // till the page IDs denoted using "#" ...
                : url.length) // or till the end if page IDs are not present.
        .split("&") // Splitting the URL params separated by "&"
        .map((keyValString) => keyValString.split("="))
        .filter((keyValArr) => keyValArr.length === 2)
        .map((keyValArr) => {
            return {"key":keyValArr[0], "value":keyValArr[1]};
        });
}


function getUrlParameterByName(paramName, url) { // Depends on getAllUrlParameters()
    if(typeof url !== "string"
        || typeof paramName !== "string"
        || url.length === 0
        || paramName.length === 0) {
        return null;
    }
    let allUrlParametersArr = getAllUrlParameters(url);
    let reqPramIndex = allUrlParametersArr.findIndex((eachParam) => eachParam.key === paramName);
    return (reqPramIndex !== -1)
        ? allUrlParametersArr[reqPramIndex].value
        : null;
}
