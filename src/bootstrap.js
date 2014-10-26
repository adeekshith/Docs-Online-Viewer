/*
 * Copyright © 2009-2014 Kris Maglione <maglione.k@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
"use strict";

try {
(function (global) {
    const URI = Components.stack.filename.replace(/.* -> /, "");

    const isContentScript = typeof sendSyncMessage != "undefined";

    const { classes: Cc, interfaces: Ci, utils: Cu, results: Cr } = Components;

    const { AddonManager } = module("resource://gre/modules/AddonManager.jsm");
    const { XPCOMUtils }   = module("resource://gre/modules/XPCOMUtils.jsm");

    const Services = Object.create(module("resource://gre/modules/Services.jsm").Services);
    XPCOMUtils.defineLazyServiceGetter(Services, "clipboard", "@mozilla.org/widget/clipboardhelper;1", "nsIClipboardHelper");
    XPCOMUtils.defineLazyServiceGetter(Services, "messageManager", "@mozilla.org/globalmessagemanager;1", "nsISupports");
    XPCOMUtils.defineLazyServiceGetter(Services, "mime", "@mozilla.org/mime;1", "nsIMIMEService");
    XPCOMUtils.defineLazyServiceGetter(Services, "security", "@mozilla.org/scriptsecuritymanager;1", "nsIScriptSecurityManager");
    XPCOMUtils.defineLazyServiceGetter(Services, "tld", "@mozilla.org/network/effective-tld-service;1", "nsIEffectiveTLDService");

    try { Services.messageManager } catch (e) {}

    if (Services.messageManager)
        ["nsIFrameScriptLoader",
         "nsIMessageBroadcaster",
         "nsIMessageListenerManager"].forEach(function (iface) {
             Services.messageManager.QueryInterface(Ci[iface]);
        });

    const resourceProto = Services.io.getProtocolHandler("resource").QueryInterface(Ci.nsIResProtocolHandler);

    const principal = Cc["@mozilla.org/nullprincipal;1"].createInstance(Ci.nsIPrincipal);

    var addon;
    var baseURI;
    var messages = {
        event: "scriptify-event",
        prefs: "scriptify-prefs"
    };

    function API(sandbox, script) {
        let api = this;

        this.script = script;
        this.sandbox = sandbox;
        this.win = sandbox.window;
        this.doc = sandbox.window.document;

        sandbox.XPathResult = Ci.nsIDOMXPathResult;

        if (!API.ready) {
            API.ready = true;
            for each (let path in manager.config.api || [])
                try {
                    Services.scriptloader.loadSubScript(
                        manager.getResourceURI(path).spec,
                        API.prototype,
                        manager.config.charset);
                }
                catch (e) {
                    reportError(e);
                }
        }

        Object.keys(API.prototype).forEach(function (meth) {
            if (meth[0] != "_")
                sandbox.importFunction(function wrapper() {
                    let caller = Components.stack.caller.filename;
                    if (!caller || !/^resource:/.test(caller.replace(/.* -> /, "")))
                        throw Error("Permission denied for <" + caller + "> to call method GM_" + meth)

                    return api[meth].apply(api, arguments);
                }, "GM_" + meth);
        });
    }

    API.prototype = {
        __proto__: { Cc: Cc, Ci: Ci, Cr: Cr, Cu: Cu, Services: Services,
                     get Cs() Components.stack.caller,
                     get manager() manager, get prefs() prefs, get util() util },

        /**
         * Inserts a new <style/> node into the current document with the
         * given CSS text.
         *
         * @param {string} css The CSS styles to add.
         */
        addStyle: function addStyle(css) {
            let node = this.doc.createElement("style");
            node.setAttribute("type", "text/css");
            node.textContent = css;
            (this.doc.head || this.doc.querySelector("head") || this.doc.documentElement)
                .appendChild(node);
        },

        /**
         * Executes the given function when the document's DOM is ready.
         *
         * @param {function} func The function to execute.
         * @param {object} self The 'this' object with which to call *func*.
         */
        ready: function ready(func, self) {
            self = self || this.sandbox;

            if (~["interactive", "complete"].indexOf(this.doc.readyState))
                func.call(self);
            else
                util.listenOnce(this.doc, "DOMContentLoaded",
                                function () { func.call(self); });
        },

        /**
         * Returns the value of the preference *key* from the preference
         * branch "extensions.<addon-id>." where <addon-id> is the ID of the
         * current add-on.
         *
         * @param {string} key The name of the preference to retrieve.
         * @param {*} defaultValue The value to return if the preference
         *      does not exist. @optional
         * @returns {bool|int|string|type(defaultValue)}
         */
        getValue: function getValue(key, defaultValue) manager.prefs.get(key, defaultValue),

        /**
         * Sets the value of the preference *key* to *val.
         *
         * @param {string} key The name of the preference to retrieve.
         * @param {bool|int|string|null} value The value to set.
         * @see .getValue
         */
        setValue: function setValue(key, value) {
            manager.prefs.set(key, value);
        },

        /**
         * Sets the default value of the preference *key* to *val.
         *
         * @param {string} key The name of the preference to retrieve.
         * @param {bool|int|string|null} value The value to set.
         * @see .getValue
         */
        setDefValue: function setDefValue(key, value) {
            manager.prefs.defaults.set(key, value);
        },

        /**
         * Deletes the preference *key*.
         *
         * @param {string} key The name of the preference to retrieve.
         * @param {bool|int|string|null} value The value to set.
         * @see .getValue
         */
        deleteValue: function deleteValue(key) {
            manager.prefs.reset(key);
        },

        /**
         * Returns a list of preference names.
         *
         * @param {[string]} value The value to set.
         * @see .getValue
         */
        listValues: function listValues() manager.prefs.getNames(),

        /**
         * Prematurely ends the loading of the current script.
         */
        finish: function finish() {
            throw new Finished;
        },

        /**
         * Sets the contents of the clipboard to the given string.
         *
         * @param {string} text The text to write to the clipboard.
         */
        setClipboard: function setClipboard(text) {
            Services.clipboard.copyString(text);
        },

        /**
         * Opens the given URL in a new tab.
         *
         * @param {string} url The URL to load.
         * @param {boolean} background If true, the tab is loaded in the
         *      background. @optional
         */
        openInTab: function openInTab(url, background) {
            Services.security.checkLoadURIStrWithPrincipal(principal, url, 0);

            // TODO: This needs to work with content processes.
            let { gBrowser } = util.topWindow(this.win);

            let owner = gBrowser._getTabForContentWindow(this.win.top);
            let sendReferer = !/^(https?|ftp):/.test(url) || prefs.get("network.http.sendRefererHeader");

            let tab = gBrowser.addTab(url, {
                ownerTab: owner,
                referrerURI: sendReferer ? util.newURI(this.win.location)
                                         : null
            });

            if (owner && (arguments.length > 1 && !background ||
                          owner == gBrowser.selectedTab && !prefs.get("browser.tabs.loadInBackground")))
                gBrowser.selectedTab = tab;
        },

        /**
         * Opens a new XMLHttpRequest with the given parameters.
         *
         * @param {object} params The parameters with which to open the
         *      XMLHttpRequest. Valid properties include:
         *
         *     url: (string) The URL to load.
         *     data: (string|File|FormData) The data to send.
         *     method: (string) The method with which to make the requests.
         *             Defaults to "GET".
         *     onload: (function(object)) The "load" event handler.
         *     onerror: (function(object)) The "error" event handler.
         *     onreadystatechange: (function(object)) The "readystatechange"
         *                         event handler.
         *     headers: (object) An object with each property representig a
         *              request header value to set.
         *     user: (string) The username to send with HTTP authentication
         *           parameters.
         *     password: (string) The password to send with HTTP authentication
         *               parameters.
         */
        xmlhttpRequest: function xmlhttpRequest(params) {
            let self = this;
            let unsafeParams = Cu.waiveXrays(params);
            let uri = util.newURI(params.url);

            if (!~["ftp", "http", "https"].indexOf(uri.scheme))
                throw URIError("Illegal URI");

            let xhr = XMLHttpRequest(params.method || "GET", uri.spec, true,
                                     params.user, params.password);

            ["load", "error", "readystatechange"].forEach(function (event) {
                if ("on" + event in unsafeParams)
                    xhr.addEventListener(event, wrap(function () {
                        unsafeParams["on" + event](sanitizeRequest(this, self.sandbox));
                    }));
            });

            for (let [k, v] in Iterator(params.headers || {}))
                xhr.setRequestHeader(k, v);

            // No need to invoke the XML parser as we won't be using the result.
            xhr.overrideMimeType(params.mimeType || "text/plain");

            xhr.send(params.data);
        },

        /**
         * Logs the stringified arguments to the Error Console.
         */
        log: function log() {
            let loc = this.doc ? " (" + this.doc.location + ")" : "";
            let msg = addon.id + loc + ": " + Array.join(arguments, ", ");

            Services.console.logStringMessage(msg);
            dump(msg + "\n");
        },

        /**
         * Logs the stringified arguments to the Error Console if the "debug"
         * preference is greater to or equal the given debug level.
         *
         * @param {int} level The debug level.
         * @param {*} ... The arguments to log.
         */
        debug: function debug(level) {
            if (this.getValue("debug", 0) >= level)
                this.log.apply(this, Array.slice(arguments, 1));
        },

        /**
         * Reports the given error to the Error Console.
         *
         * @param {object|string} error The error to report.
         */
        reportError: function reportError(error) {
            Cu.reportError(error);
            this.log((error.stack || Error().stack).replace(/@([^\s@]+ -> )+/g, "@"));
        },

        /**
         * Loads the script resource from this package at the given *path*
         * into *object*.
         *
         * @param {string} path The path of the script to load.
         * @param {object} object The object into which to load the script.
         *      @default The current sandbox.
         * @param {string} charset The character set as which to parse the
         *      script.
         *      @default "ISO-8859-1"
         */
        loadScript: function loadScript(path, object, charset) {
            function principal(win) Services.security.getCodebasePrincipal(win.document.documentURIObject);

            if (!object)
                object = this.sandbox;
            // Would like to use Cu.getGlobalForObject, but it doesn't work
            // with security wrappers.
            else if (object !== this.sandbox && !(
                        object instanceof Ci.nsIDOMWindow &&
                        principal(this.win).subsumes(principal(object))))
                throw Error("Illegal target object");

            Services.scriptloader.loadSubScript(
                manager.getResourceURI(path).spec,
                object,
                charset || manager.config.charset);
        },

        /**
         * Returns a data: URL representing the file inside this
         * extension at *path*.
         *
         * @param {string} path The path within this extension at which to
         *      find the resource.
         * @returns {string}
         * @see .getResourceText
         */
        getResourceURL: function getResourceURL(path) manager.getResourceURI(path).spec,

        /**
         * Returns the text of the file inside this extension at *path*.
         *
         * @param {string} path The path within this extension at which to
         *      find the resource.
         * @param {string} charset The character set from which to decode
         *      the file.
         *      @default "UTF-8"
         * @see .getResourceURL
         */
        getResourceText: function getResourceText(path, charset) {
            return util.httpGet(manager.getResourceURI(path).spec,
                                "text/plain;charset=" + (charset || "UTF-8"))
                        .responseText;
        },

        /**
         * Not implemented.
         */
        registerMenuCommand: function () {}
    };

    function sanitizeRequest(xhr, sandbox) {
        // Use Greasemonkey's approximate method, as it's tried and tested.
        return {
            __exposedProps__: sanitizeRequest.exposedProps,

            responseText: xhr.responseText,

            get responseJSON() {
                delete this.responseJSON;
                return this.responseJSON = JSON.parse(this.responseText);
            },

            get responseXML() {
                delete this.responseXML;
                return this.responseXML = sandbox.DOMParser().parseFromString(this.responseText, "text/xml");
            },

            readyState: xhr.readyState,

            get responseHeaders() xhr.getAllResponseHeaders(),

            status: xhr.readyState == 4 ? xhr.status : 0,

            statusText: xhr.readyState == 4 ? xhr.statusText : ""
        };
    }
    sanitizeRequest.exposedProps = {
        readyState: "r",
        responseHeaders: "r",
        responseJSON: "r",
        responseText: "r",
        responseXML: "r",
        status: "r",
        statusText: "r",
    };

    function Finished() {}
    Finished.prototype.__exposedProps__ = {};

    const XMLHttpRequest = Components.Constructor("@mozilla.org/xmlextras/xmlhttprequest;1", "nsIXMLHttpRequest", "open");
    const SupportsString = Components.Constructor("@mozilla.org/supports-string;1", "nsISupportsString");

    function Prefs(branch, defaults) {
        this.constructor = Prefs; // Ends up Object otherwise... Why?

        this.branch = Services.prefs[defaults ? "getDefaultBranch" : "getBranch"](branch || "");
        if (this.branch instanceof Ci.nsIPrefBranch2)
            this.branch.QueryInterface(Ci.nsIPrefBranch2);

        this.defaults = defaults ? this : new this.constructor(branch, true);
    }
    Prefs.prototype = {
        /**
         * Returns a new Prefs object for the sub-branch *branch* of this
         * object.
         *
         * @param {string} branch The sub-branch to return.
         */
        Branch: function Branch(branch) new this.constructor(this.root + branch),

        /**
         * Clears the entire branch.
         *
         * @param {string} name The name of the preference branch to delete.
         */
        clear: function clear(branch) {
            this.branch.deleteBranch(branch || "");
        },

        /**
         * Returns the full name of this object's preference branch.
         */
        get root() this.branch.root,

        /**
         * Returns the value of the preference *name*, or *defaultValue* if
         * the preference does not exist.
         *
         * @param {string} name The name of the preference to return.
         * @param {*} defaultValue The value to return if the preference has no value.
         * @optional
         */
        get: function get(name, defaultValue) {
            let type = this.branch.getPrefType(name);

            if (type === Ci.nsIPrefBranch.PREF_STRING)
                return this.branch.getComplexValue(name, Ci.nsISupportsString).data;

            if (type === Ci.nsIPrefBranch.PREF_INT)
                return this.branch.getIntPref(name);

            if (type === Ci.nsIPrefBranch.PREF_BOOL)
                return this.branch.getBoolPref(name);

            return defaultValue;
        },

        /**
         * Returns true if the given preference exists in this branch.
         *
         * @param {string} name The name of the preference to check.
         */
        has: function has(name) this.branch.getPrefType(name) !== 0,

        /**
         * Returns an array of all preference names in this branch or the
         * given sub-branch.
         *
         * @param {string} branch The sub-branch for which to return preferences.
         * @optional
         */
        getNames: function getNames(branch) this.branch.getChildList(branch || "", { value: 0 }),

        /**
         * Returns true if the given preference is set to its default value.
         *
         * @param {string} name The name of the preference to check.
         */
        isDefault: function isDefault(name) !this.branch.prefHasUserValue(name),

        /**
         * Sets the preference *name* to *value*. If the preference already
         * exists, it must have the same type as the given value.
         *
         * @param {name} name The name of the preference to change.
         * @param {string|number|boolean} value The value to set.
         */
        set: function set(name, value) {
            let type = typeof value;
            if (type === "string") {
                let string = SupportsString();
                string.data = value;
                this.branch.setComplexValue(name, Ci.nsISupportsString, string);
            }
            else if (type === "number")
                this.branch.setIntPref(name, value);
            else if (type === "boolean")
                this.branch.setBoolPref(name, value);
            else
                throw TypeError("Unknown preference type: " + type);
        },

        /**
         * Resets the preference *name* to its default value.
         *
         * @param {string} name The name of the preference to reset.
         */
        reset: function reset(name) {
            if (this.branch.prefHasUserValue(name))
                this.branch.clearUserPref(name);
        }
    };

    /**
     * A shim class to proxy Pref class methods to the parent process,
     * where they will achieve the desired results. Sadly the preference
     * service does not do this transparently.
     */
    function PrefsProxy(branch, defaults) {
        this.constructor = PrefsProxy;
        this.root = branch || "";
        this.defaults = !!defaults;
    }
    PrefsProxy.prototype = {
        Branch: function Branch(branch) new this.constructor(this.root + branch),

        isProxy: true,

        __noSuchMethod__: function __noSuchMethod__(meth, args) {
            return sendSyncMessage(messages.prefs, {
                branch: this.root,
                defaults: this.defaults,
                method: meth,
                args: args
            })[0];
        }
    };

    if (isContentScript)
        Prefs = PrefsProxy;

    let prefs = new Prefs("");

    let util = {
        /**
         * Returns an iterator for all extant content windows.
         */
        get contentWindows() {
            let windows = Services.wm.getXULWindowEnumerator(null);
            while (windows.hasMoreElements()) {
                let window = windows.getNext().QueryInterface(Ci.nsIXULWindow);
                for each (let type in ["typeContent"]) {
                    let docShells = window.docShell.getDocShellEnumerator(Ci.nsIDocShellTreeItem[type],
                                                                          Ci.nsIDocShell.ENUMERATE_FORWARDS);
                    while (docShells.hasMoreElements()) {
                        let { contentViewer } = docShells.getNext().QueryInterface(Ci.nsIDocShell);
                        if (contentViewer)
                            yield contentViewer.DOMDocument.defaultView;
                    }
                }
            }
        },

        /**
         * Appends the given callback to this thread's event queue,
         * executing it after the current call stack terminates.
         */
        delay: function delay(callback) {
            Services.tm.mainThread.dispatch(callback, 0);
        },

        /**
         * Converts a shell-style globbing pattern to an anchored
         * regular expression. The only recognized special character is
         * "*", which matches any sequence of characters, including the
         * null sequence.
         */
        globToRegexp: function globToRegexp(glob) {
            return RegExp("^" + glob.replace(/([\\{}()[\]^$.?+|])/g, "\\$1")
                                    .replace(/\*/g, ".*") + "$");
        },

        /**
         * Preforms a synchronous XMLHttpRequest for the given local
         * URL and returns its text.
         */
        httpGet: function httpGet(url) {
            if (!/^(?:jar:)?(?:file|chrome|resource|about):/.test(url))
                throw Error("Remote URLs forbidden");

            let xmlhttp = XMLHttpRequest("GET", url, false);
            xmlhttp.overrideMimeType("text/plain");
            xmlhttp.send(null);
            return xmlhttp.responseText;
        },

        /**
         * Listens for the given event on the given target once. The
         * listener is removed the first time the event is received.
         *
         * @param {EventTarget} target The target node to listen on.
         * @param {string} eventName The event to listen for.
         * @param {function} callback The function to call when the
         *                            event is received.
         * @param {object} self The 'this' object with which to call *callback*.
         */
        listenOnce: function listenOnce(target, eventName, callback, self) {
            target.addEventListener(eventName, function listener(event) {
                if (event.originalTarget == target) {
                    target.removeEventListener(eventName, listener, false);
                    wrap(callback).call(self || target, event);
                }
            }, false);
        },

        /**
         * Creates a new nsIURI object from the given URL spec, charset,
         * and base nsIURI. The second two parameters are optional.
         */
        newURI: wrap(function newURI(url, charset, base) Services.io.newURI(url, charset, base), true),

        /**
         * Returns the top-level chrome window for a given window.
         */
        topWindow: function topWindow(win)
                win.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation)
                   .QueryInterface(Ci.nsIDocShellTreeItem).rootTreeItem
                   .QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindow),

        /**
         * Compiles a new URI matcher for the given pattern. The
         * returned function returns true if the passed URI matches
         * *pattern*.
         *
         * @param {string} pattern The pattern to compile.
         * @returns {function(nsIURI):boolean}
         */
        URIMatcher: function URIMatcher(pattern) {
            if (pattern == "*" || pattern == "<all_urls>")
                return function () true;

            if (/^\/(.*?)(?:\/([i]*))?$/.test(pattern))
                return let (re = RegExp(RegExp.$1, RegExp.$2))
                    function (uri) re.test(uri.spec);

            let patternURI = util.newURI(pattern.replace(/^\*:/, "http:")).QueryInterface(Ci.nsIURL);
            let anyScheme = pattern.slice(0, 2) == "*:";

            if (patternURI.scheme == "about")
                return function (uri) uri.equals(patternURI);

            let host = function host(uri) uri.host;
            if (/\.tld$/.test(patternURI.host))
                host = function host(uri)
                    /\./.test(uri.host) ? uri.host.slice(0, -Services.tld.getPublicSuffix(uri).length)
                                        : uri.host;

            let hostRe = util.globToRegexp(host(patternURI));
            if (patternURI.host.slice(0, 2) == ".*")
                hostRe = RegExp(/^(?:.*\.)?/.source + hostRe.source.slice(5));

            let pathRe = this.globToRegexp(patternURI.path);

            return function URIMatcher(uri) {
                return (anyScheme || uri.scheme == patternURI.scheme)
                    && uri instanceof Ci.nsIURL
                    && hostRe.test(host(uri))
                    && pathRe.test(uri.path);
            }
        }
    };

    /**
     * Functionality common to all managers.
     */
    function Manager() {
        manager = this;
        this.prefs = prefs.Branch("extensions." + addon.id + ".");

        this.package = addon.id.replace("@", ".").toLowerCase();

        resourceProto.setSubstitution(this.package, baseURI);

        this.config = JSON.parse(util.httpGet(this.getResourceURI("scriptify.json").spec));

        if (!isContentScript)
            for (let [k, v] in Iterator(this.config.preferences || {}))
                this.prefs.defaults.set(k, v);
    }
    Manager.prototype = {
        cleanup: function cleanup() {
            resourceProto.setSubstitution(this.package, null);
        },

        getResourceURI: function getResourceURI(path) {
            let uri = util.newURI("resource://" + this.package);
            uri.path = path;
            return uri;
        }
    };

    /**
     * The manager that does the real work of running content scripts.
     */
    function ScriptManager() {
        Manager.call(this);

        for each (let script in this.config.scripts)
            script.matchers = {
                include: (script.include || []).map(function (pat) util.URIMatcher(pat)),
                exclude: (script.exclude || []).map(function (pat) util.URIMatcher(pat)),
            };

        for (let window in util.contentWindows)
            this.load(window, true);
    }
    ScriptManager.super = Manager.prototype;
    ScriptManager.prototype = {
        __proto__: ScriptManager.super,

        load: wrap(function load(window, startup) {

            if (!window.location.href)
                return;

            let uri = util.newURI(window.location.href);

            for each (let script in this.config.scripts) {
                if (startup && !script["run-at-startup"])
                    continue;
                if (!~["file", "http", "https"].indexOf(uri.scheme) && uri.spec != "about:home")
                    continue;
                if (script.matchers.exclude.some(function (test) test(uri)))
                    continue;
                if (script.matchers.include.some(function (test) test(uri)))
                    this.makeSandbox(window, script);
            }
        }),

        events: { "interactive": "DOMContentLoaded", "complete": "load" },
        states: {
            "ready": [["interactive", "complete"], "document"],
            "idle":  [["interactive", "complete"], "document", true],
            "end":   [["complete"], "window"]
        },

        makeSandbox: wrap(function makeSandbox(window, script) {
            if (script["run-when"] in this.states) {
                let [states, target, delay] = this.states[script["run-when"]];

                let doc = window.document;
                if (!~states.indexOf(doc.readyState)) {
                    let again = function () { manager.makeSandbox(window, script); }
                    let event = this.events[states[0]];
                    if (delay)
                        util.listenOnce(window[target], event, function () { util.delay(again) });
                    else
                        util.listenOnce(window[target], event, again);
                    return;
                }
            }


            // Prevent multiple loads into the same window.
            let win = window.wrappedJSObject || win;
            if (!(addon.id in win))
                win[addon.id] = {};

            if (script.name in win[addon.id])
                return;

            win[addon.id][script.name] = true;


            let sandbox = Cu.Sandbox(window, { sandboxPrototype: window });
            sandbox.unsafeWindow = window.wrappedJSObject;

            let api = new API(sandbox, script);

            Services.obs.notifyObservers(sandbox, "scriptify:sandbox-created", addon.id);

            for each (let path in script.paths)
                try {
                    Services.scriptloader.loadSubScript(
                        this.getResourceURI(path).spec,
                        sandbox,
                        script.charset || this.config.charset);
                }
                catch (e) {
                    if (!(e instanceof Finished))
                        reportError(e);
                }

        })
    };

    /**
     * A stub manager which drives slave managers running as frame
     * scripts.
     */
    function SlaveDriver() {
        Manager.call(this);

        this.slaveURI = this.getResourceURI("bootstrap.js").spec;
        Services.messageManager.addMessageListener(messages.prefs, this);
        Services.messageManager.addMessageListener(this.slaveURI, this);
        Services.messageManager.loadFrameScript(this.slaveURI, true);
    }
    SlaveDriver.super = Manager.prototype;
    SlaveDriver.prototype = {
        __proto__: SlaveDriver.super,

        cleanup: function cleanup() {
            SlaveDriver.super.cleanup.call(this);

            Services.messageManager.broadcastAsyncMessage(messages.event, { event: "cleanup" });

            Services.messageManager.removeMessageListener(messages.prefs, this);
            Services.messageManager.removeMessageListener(this.slaveURI, this);

            if ("removeDelayedFrameScript" in Services.messageManager)
                Services.messageManager.removeDelayedFrameScript(this.slaveURI);
        },

        uninstall: function uninstall() {
            if (this.prefs)
                this.prefs.clear();
        },

        receiveMessage: wrap(function receiveMessage(message) {
            var { name, json } = message;
            switch (name) {
            case this.slaveURI:
                return { addon: { baseURI: baseURI.spec, id: addon.id, version: addon.version }, messages: messages };
            case messages.prefs:
                let prefs = new Prefs(json.branch, json.defaults);
                return prefs[json.method].apply(prefs, json.args);
                break;
            }
        })
    };

    /**
     * The slave manager which runs in frame scripts and dispatches to
     * the ScriptManager.
     */
    function SlaveManager() {
        let res = sendSyncMessage(URI);

        // For platforms without removeDelayedFrameScript
        if (!res.length)
            return;

        [{ addon, messages }] = res;
        baseURI = util.newURI(addon.baseURI);

        // For platforms without removeDelayedFrameScript
        if (addon.id in global)
            return;
        global[addon.id] = true;

        ScriptManager.call(this);

        addEventListener(this.EVENT, this, false);
        addMessageListener(messages.event, this);
    }
    SlaveManager.super = ScriptManager.prototype;
    SlaveManager.prototype = {
        __proto__: SlaveManager.super,

        EVENT: "DOMWindowCreated",

        cleanup: function cleanup() {
            SlaveManager.super.cleanup.call(this);

            removeEventListener(this.EVENT, this, false);
            removeMessageListener(messages.event, this);
            delete global[addon.id];
        },

        handleEvent: wrap(function handleEvent(event) {
            if (event.type == this.EVENT)
                this.load(event.target.defaultView);
        }),

        receiveMessage: wrap(function receiveMessage(message) {
            var { json } = message;

            if (typeof this[json.event] == "function")
                this[json.event](json);
        })
    };

    /**
     * The manager which runs in a single global processes for platforms
     * with buggy message managers.
     */
    function GlobalManager() {
        ScriptManager.call(this);

        Services.obs.addObserver(this, this.TOPIC, false);
    }
    GlobalManager.super = ScriptManager.prototype;
    GlobalManager.prototype = {
        __proto__: GlobalManager.super,

        TOPIC: "content-document-global-created",

        cleanup: function cleanup() {
            GlobalManager.super.cleanup.call(this);

            Services.obs.removeObserver(this, this.TOPIC);
        },

        observe: wrap(function observe(subject, topic, data) {
            if (topic == this.TOPIC)
                this.load(subject);
        })
    };

    if (isContentScript)
        var manager = new SlaveManager;
    else {
        /*
         * Add-on manager callbacks
         */
        this.startup = function startup(data, reason) {
            addon = data;

            for (let [k, v] in Iterator(messages))
                messages[k] = data.id + ":" + v;

            // getAddonById at startup is obscenely expensive.
            baseURI = util.newURI(Components.stack.filename
                                            .replace(/.* -> /, "")
                                            .slice(0, -"bootstrap.js".length));

            // The Message manager on Gecko <8.0 won't accept message listeners
            // from sandbox compartments.
            if (!prefs.get("browser.tabs.remote"))
                manager = new GlobalManager;
            else
                manager = new SlaveDriver;
        }

        this.shutdown = function shutdown(data, reason) {
            if (reason != APP_SHUTDOWN)
                manager.cleanup();
        }

        this.uninstall = function uninstall(data, reason) {
            if (reason == ADDON_UNINSTALL && manager)
                manager.uninstall();
        }

        this.install = function install(data, reason) {}

        this.util = util;
    }

    /*
     * Misc utility functions.
     */

    function debug() {
        dump((addon ? addon.id : "scriptify") + ": " + Array.join(arguments, ", ") + "\n");
    }

    function module(uri) Cu.import(uri, {});

    function reportError(e) {
        Cu.reportError(e);
        Services.console.logStringMessage((e.stack || Error().stack).replace(/@(\S+ -> )+/g, "@"));
    }

    function wrap(fn, throws)
        function wrapper() {
            try {
                return fn.apply(this, arguments);
            }
            catch (e) {
                reportError(e);
                if (throws)
                    throw e;
            }
        }

}).call(typeof sendSyncMessage == "undefined" ? this : {}, this);

} catch (e) {
    Components.utils.reportError(e);
    Components.utils.import("resource://gre/modules/Services.jsm", {})
        .Services.console.logStringMessage(e.stack || Error().stack);
}
