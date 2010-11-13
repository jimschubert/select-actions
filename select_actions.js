/*
Copyright 2010 Jim Schubert, www.ipreferjim.com

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

   | Actions |
      - |Social|
          -|Share on Facebook|
          -|Share on Twitter|
          -|Note on Facebook|
      - |Web|
          -|Search on Yahoo|
          -|Search on Bing|
          -|Search on Wikipedia|
      - |Google|
          -|Add to Calendar|
          -|Add to Bookmarks|
          -|Add to Reader|
*/

var debugFlag = false;
var contexts = ['all', 'page', 'selection', 'link', 'editable', 'image', 'video', 'audio'];
var menus = {
    "Actions": {
        "id": 0,
        "icon": null,
        "children": []
    },
    "Social": {
        "id": 0,
        "children": [{
            "title": "Share on Facebook",
            "icon": chrome.extension.getURL("facebook_icon.gif"),
            "fn": function (info, tab) {
                var s = info.selectionText || info.linkUrl || info.srcUrl || info.pageUrl;
                if (!s) {
                    return;
                }

                debug("Calling Share on Facebook action for " + s);

                var d = document,
                    f = 'http://www.facebook.com/connect/prompt_feed.php?&message=',
                    l = window.location,
                    e = encodeURIComponent;
                1;
                try {
                    if (!/^(.*\.)?facebook\.[^.]*$/.test(l.host)) {
                        throw (0); /* this forces the window.open in catch */
                    }
                    users_setStatus(p);
                } catch (z) {
                    debug("Share on Facebook catch block");
                    if (!window.open(f + s, 'status', 'toolbar=0,status=0,resizable=1,width=626,height=436')) {
                        l.href = (f + s);
                    }
                }
            }
        },
        {
            "title": "Share on Twitter",
            "icon": chrome.extension.getURL("twitter_icon.gif"),
            "fn": function (info, tab) {
                var s = info.selectionText || info.linkUrl || info.srcUrl || info.pageUrl;
                if (!s) {
                    return;
                }
                debug("Calling Share on Twitter action for " + s);
                s = encodeURIComponent(s);
                s = s.replace(/\r\n|\r|\n/g, " ,");
                var url = "http://twitter.com/?status=" + s.replace(/ /g, "+");

                debug("Calling Share on Twitter for url: " + url);

                chrome.tabs.update(tab.id, {
                    "url": url,
                    "selected": true
                }, null);
            }
        },
        {
            "title": "Note on Facebook",
            "icon": chrome.extension.getURL("facebook_icon.gif"),
            "fn": function (info, tab) {
                var s = info.selectionText || info.linkUrl || info.srcUrl || info.pageUrl;
                if (s) {
                    var site = info.pageUrl;
                    debug("Calling Note on Facebook action for " + s);

                    var f = 'http://www.facebook.com/share',
                        e = encodeURIComponent,
                        p = '.php?u=' + e(site) + '&t=' + e(tab.title);
                    1;
                    try {
                        if (!/^(.*\.)?facebook\.[^.]*$/.test(l.host)) {
                            throw (0);
                        }
                        share_internal_bookmarklet(p);
                    } catch (z) {
                        debug("Note on Facebook catch block");
                        if (!window.open(f + 'r' + p, 'sharer', 'toolbar=0,status=0,resizable=1,width=626,height=436')) {
                            var url = f + p;
                            chrome.tabs.update(tab.id, {
                                "url": url,
                                "selected": true
                            }, null);
                        }
                    }
                }
            }
        }]
    },
    "Web": {
        "id": 0,
        "children": [
        /*{
            "title": "Search on Yahoo",
            "icon": null,
            "fn": function (info, tab) {

                var s = info.selectionText || info.linkUrl || info.srcUrl || info.pageUrl;
                if (!s) {
                    return;
                }
                s = s.replace(/\r\n|\r|\n/g, " ,");
                var url = "http://search.yahooapis.com/WebSearchService/V1/webSearch?query=" + s.replace(/ /g, "+");

                debug("Calling Search on Yahoo for url: " + url);

                chrome.tabs.update(tab.id, {
                    "url": url,
                    "selected": true
                }, null);

            }
        }, */
        {
            "title": "Search on Bing",
            "icon": null,
            "fn": function (info, tab) {

                var s = info.selectionText || info.linkUrl || info.srcUrl || info.pageUrl;
                if (!s) {
                    return;
                }
                s = s.replace(/\r\n|\r|\n/g, " ,");
                var url = "http://www.bing.com/search/search.aspx?q=" + s.replace(/ /g, "+");

                debug("Calling Search on Bing for url: " + url);

                chrome.tabs.update(tab.id, {
                    "url": url,
                    "selected": true
                }, null);

            }
        },
        {
            "title": "Search on Wikipedia",
            "icon": null,
            "fn": function (info, tab) {

                var s = info.selectionText || info.linkUrl || info.srcUrl || info.pageUrl;
                if (!s) {
                    return;
                }
                s = s.replace(/\r\n|\r|\n/g, " ,");

                var e = navigator.language || "en";
                e = e.substring(0, 2);
                var url = "http://" + e + ".wikipedia.org/wiki/Special:Search?go=Go&search=" + s.replace(/ /g, "+");

                debug("Calling Search on Wikipedia for url: " + url + " tabId: " + tab.id);

                chrome.tabs.update(tab.id, {
                    "url": url,
                    "selected": true
                }, null);
            }
        }]
    },
    "Google": {
        "id": 0,
        "children": [{
            "title": "Add to Calendar",
            "icon": chrome.extension.getURL("google_icon.gif"),
            "fn": function (info, tab) {
                var s = info.selectionText || info.linkUrl || info.srcUrl || info.pageUrl;
                if (!s) {
                    debug("Add to Calendar: no value received.");
                    return;
                }
                var t = prompt('Please enter a description for the event', s);
                if (t) {
                    var url = ('http://www.google.com/calendar/event?ctext=' + t + '&action=TEMPLATE&pprop=HowCreated%3AQUICKADD');
                    debug("Calling Add to Calendar for url: " + url);
                    chrome.tabs.update(tab.id, {
                        "url": url,
                        "selected": true
                    }, null);
                }
            }
        },
        {
            "title": "Add to Bookmarks",
            "icon": chrome.extension.getURL("google_icon.gif"),
            "fn": function (info, tab) {
                var s = info.selectionText || info.linkUrl || info.srcUrl || info.pageUrl;
                if (!s) {
                    debug("Add to Bookmarks: no value received.");
                    return;
                }

                var a = window,
                    c = encodeURIComponent;

                    var url = "http://www.google.com/bookmarks/mark?op=edit&output=popup&bkmk=" + c(info.pageUrl) + "&title=" + c(tab.title);

if(info.selectionText){
  url = url + "&notes=" + info.selectionText;
}

                if (!a.open(url, "bkmk_popup", "left=" + ((a.screenX || a.screenLeft) + 10) + ",top=" + ((a.screenY || a.screenTop) + 10) + ",height=420px,width=550px,resizable=1,alwaysRaised=1")) {
                debug("Calling Add to Bookmarks for url: " + url);
                    chrome.tabs.update(tab.id, {
                        "url": url,
                        "selected": true
                    }, null);
                }
            }
        },
        {
            "title": "Add to Reader",
            "icon": chrome.extension.getURL("google_icon.gif"),
            "fn": function (info, tab) {


                var s = info.linkUrl || info.srcUrl || info.pageUrl;
                if (!s) {
                    debug("Add to Reader: no value received.");
                    return;
                }
                  var url = 'http://www.google.com/reader/view/feed/' + encodeURIComponent(s);
                  debug("Calling Add to reader for url: " + url);
                  chrome.tabs.update(tab.id, {
                      "url": url,
                      "selected": true
                  }, null);
            }
        },
        {
            "title": "Search Blogs",
            "icon": chrome.extension.getURL("google_icon.gif"),
            "fn": function (info, tab) {
                var s = info.selectionText || info.linkUrl || info.srcUrl || info.pageUrl;
                if (s) {
                    debug("Calling Search Blogs for query: " + s);
                    var url = ('http://blogsearch.google.com/blogsearch?q=' + s);
                    chrome.tabs.update(tab.id, {
                        "url": url,
                        "selected": true
                    }, null);
                }
            }
        },
        {
            "title": "Translate",
            "icon": chrome.extension.getURL("google_icon.gif"),
            "fn": function (info, tab) {
                var s = info.selectionText;
                var e = navigator.language || "en";
                if (s) {
                    debug("Calling Translate for query: " + s);
                    var url = ('http://translate.google.com/#auto|' + e.substring(0, 2) + '|' + s);
                    chrome.tabs.update(tab.id, {
                        "url": url,
                        "selected": true
                    }, null);
                }
                else {
                    var s = info.linkUrl || info.srcUrl || info.pageUrl;
                    debug("Calling Translate for url: " + s);
                    var url = ('http://translate.google.com/translate?js=y&u=' + escape(s) + '&tbb=1&sl=auto&tl=' + e);

                    chrome.tabs.update(tab.id, {
                        "url": url,
                        "selected": true
                    }, null);

                }
            }
        } /* end of child */ ,
        {
            "title": "Define",
            "icon": chrome.extension.getURL("google_icon.gif"),
            "fn": function (info, tab) {
                var s = info.selectionText;
                if (!s) {
                    debug("No selection text found.");
                    alert("Please select some text to define.");
                }
                s = String(s).replace(/\r\n|\r|\n/g, " ,");
                var url = "http://www.google.com/search?q=define:" + String(s).replace(/ /g, "+");
                debug("Calling Define for url: " + url);
                chrome.tabs.update(tab.id, {
                    "url": url,
                    "selected": true
                }, null);
            }
        } /*end of child */ ,
        {
            "title": "Map",
            "icon": chrome.extension.getURL("google_icon.gif"),
            "fn": function (info, tab) {
                var s = info.selectionText;
                if (!s) {
                    debug("No selection text found.");
                    alert("Please select an address to map.");
                }
                s = s.replace(/\r\n|\r|\n/g, " ,");
                var url = ("http://maps.google.com?q=" + s.replace(/ /g, "+"));
                debug("Calling Map for url: " + url);
                chrome.tabs.update(tab.id, {
                    "url": url,
                    "selected": true
                }, null);
            }
        } /*end of child*/ ]
    }
};

function debug(msg) {
    if ((debugFlag == true) && console && console.log) {
        console.log(msg);
    }
}


function genericOnClick(info, tab) {
    logger("item " + info.menuItemId + " was clicked");
    logger("info: " + JSON.stringify(info));
    logger("tab: " + JSON.stringify(tab));
}

function createTopLevel() {
    menus["Actions"]["id"] = chrome.contextMenus.create({
        "title": "Actions",
        "contexts": contexts,
        "onclick": genericOnClick
    }, function () {
        /* debug("Context menus created with menuId of " + new String(menus["Actions"]["id"])); */
    });
}

function createSecondLevel() {
    for (item in menus) {
        if (0 == menus[item]["id"]) {
            menus[item]["id"] = chrome.contextMenus.create({
                "title": item,
                "parentId": menus["Actions"]["id"],
                "contexts": contexts,
                "onclick": genericOnClick /* todo: change this to the menu's fn */
            }, function () {
                var s = item;
               /* debug("Created second level context menu for " + s); */
            });
        }

        for (child in menus[item]["children"]) {
            var menuItem = menus[item]["children"][child];
            menuItem["id"] = chrome.contextMenus.create({
                "title": menuItem["title"],
                "parentId": menus[item]["id"],
                "contexts": contexts,
                "onclick": menuItem["fn"]
            }, function () {
                var s = menuItem["title"];
               /* debug("Created second level context menu for " + s); */
            });
        }
    }
}

function init() {
    createTopLevel();
    createSecondLevel();
}
