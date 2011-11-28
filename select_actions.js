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
var debugFlag = false,
    contexts = ['all', 'page', 'selection', 'link', 'editable', 'image', 'video', 'audio'],
    e = encodeURIComponent,
    upd = function(name, tab, url) {
        if(url) {
            name = name || "select-actions function";
            debug("Calling " + name + " for url: " + url);
            chrome.tabs.update(tab.id, {
                "url": url,
                "selected": true
            }, null);
        }
    },
    text = function(info) {
        var s = info.selectionText || info.linkUrl || info.srcUrl || info.pageUrl;
        return s;
    },
    resource = chrome.extension.getURL;
    
var menus = {
    "Actions": {
        "id": 0,
        "icon": null,
        "children": []
    },
    "Social": {
        "id": 0,
        "children": [
        /* {
            "title": "Share on Facebook",
            "icon": resource("facebook_icon.gif"),
            "fn": function (info, tab) {
                var s = text(info);
                if (!s) { return; }

                debug("Calling Share on Facebook action for " + s);

                var d = document,
                    f = 'http://www.facebook.com/connect/prompt_feed.php/?message=',
                    l = window.location; 
                    
                try {
                    if (!/^(.*\.)?facebook\.[^.]*$/.test(l.host)) {
                        throw (0);
                    }
                    users_setStatus(s);
                } catch (z) {
                    debug("Share on Facebook catch block");
                    if (!window.open(f + s, 'status', 'toolbar=0,status=0,resizable=1,width=626,height=436')) {
                        l.href = (f + s);
                    }
                }
            }
        },*/
        {
            "title": "Share on Twitter",
            "icon": resource("twitter_icon.gif"),
            "fn": function (info, tab) {
                var s = text(info);
                if (!s) { return;}
                s = e(s);
                s = s.replace(/\r\n|\r|\n/g, " ,");
                var url = "http://twitter.com/?status=" + s.replace(/ /g, "+");
                upd("Share on Twitter", tab, url);
            }
        },
        {
            "title": "Share on Facebook",
            "icon": resource("facebook_icon.gif"),
            "fn": function (info, tab) {
                var s = text(info);
                if (!s) { return; }
                
                var site = info.pageUrl;
                debug("Calling Share on Facebook action for " + s);

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
                    debug("Share on Facebook catch block");
                    if (!window.open(f + 'r' + p, 'sharer', 'toolbar=0,status=0,resizable=1,width=626,height=436')) {
                        var url = f + p;
                        chrome.tabs.update(tab.id, {
                            "url": url,
                            "selected": true
                        }, null);
                    }
                }
            }
        }]
    },
    "Web": {
        "id": 0,
        "children": [
        {
            "title": "Search on Bing",
            "icon": null,
            "fn": function (info, tab) {
                var s = text(info);
                if (!s) { return; }
                s = e(s.replace(/\r\n|\r|\n/g, " ,"));
                var url = "http://www.bing.com/search/search.aspx?q=" + s.replace(/ /g, "+");
                upd("Search on Bing", tab, url);
            }
        },
        {
            "title": "Search on Wikipedia",
            "icon": null,
            "fn": function (info, tab) {
                var s = text(info);
                if (!s) { return; }
                s = s.replace(/\r\n|\r|\n/g, " ,");
                var lang = navigator.language || "en";
                lang = lang.substring(0, 2);
                var url = "http://" + lang + ".wikipedia.org/wiki/Special:Search?go=Go&search=" + e(s.replace(/ /g, "+"));
                upd("Search on Wikipedia", tab, url);
            }
        }]
    },
    "Google": {
        "id": 0,
        "children": [{
            "title": "Add to Calendar",
            "icon": resource("google_icon.gif"),
            "fn": function (info, tab) {
                var s = text(info);
                if (!s) { return; }
                var t = prompt('Please enter a description for the event', s);
                if (t) {
                    var url = ('http://www.google.com/calendar/event?text=' + e(t) + '&action=TEMPLATE&details=' + e(s) );
                    upd("Add to Calendar", tab, url);
                }
            }
        },
        {
            "title": "Add to Bookmarks",
            "icon": resource("google_icon.gif"),
            "fn": function (info, tab) {
                var s = text(info);
                if (!s) { return; }
                var a = window;
                var url = "http://www.google.com/bookmarks/mark?op=edit&output=popup&bkmk=" + e(info.pageUrl) + "&title=" + e(tab.title);
                if(info.selectionText){
                    url = url + "&notes=" + e(info.selectionText);
                }

                if (!a.open(url, "bkmk_popup", "left=" + ((a.screenX || a.screenLeft) + 10) + ",top=" + ((a.screenY || a.screenTop) + 10) + ",height=420px,width=550px,resizable=1,alwaysRaised=1")) {
                    upd("Add to Bookmarks", tab, url);
                }
            }
        },
        {
            "title": "Add to Reader",
            "icon": resource("google_icon.gif"),
            "fn": function (info, tab) {
                var s = text(info);
                if (!s) { return; }
                var url = 'http://www.google.com/reader/view/feed/' + e(s);
                upd("Add to Reader", tab, url);
            }
        },
        {
            "title": "Search Blogs",
            "icon": resource("google_icon.gif"),
            "fn": function (info, tab) {
                var s = text(info);
                if (!s) { return; }
                var url = 'http://blogsearch.google.com/blogsearch?q=' + e(s);
                upd("Search Blogs", tab, url);                
            }
        },
        {
            "title": "Translate",
            "icon": resource("google_icon.gif"),
            "fn": function (info, tab) {
                var s = info.selectionText;
                var lang = navigator.language || "en";
                if (s) {
                    var url = ('http://translate.google.com/#auto|' + lang.substring(0, 2) + '|' + e(s) );
                    upd("Translate", tab, url);
                }
                else {
                    var s = info.linkUrl || info.srcUrl || info.pageUrl;
                    var url = ('http://translate.google.com/translate?js=y&u=' + e(s) + '&tbb=1&sl=auto&tl=' + lang);
                    upd("Translate", tab, url);
                }
            }
        } /* end of child */ ,
        {
            "title": "Define",
            "icon": resource("google_icon.gif"),
            "fn": function (info, tab) {
                var s = info.selectionText;
                if (!s) {
                    debug("No selection text found.");
                    alert("Please select some text to define.");
                }
                s = String(s).replace(/\r\n|\r|\n/g, " ,");
                var url = "http://www.google.com/search?q=define:" + e( String(s).replace(/ /g, "+") );
                upd("Define", tab, url);
            }
        } /*end of child */ ,
        {
            "title": "Map",
            "icon": resource("google_icon.gif"),
            "fn": function (info, tab) {
                var s = info.selectionText;
                if (!s) {
                    debug("No selection text found.");
                    alert("Please select an address to map.");
                }
                s = s.replace(/\r\n|\r|\n/g, " ,");
                var url = ("http://maps.google.com?q=" + e(s.replace(/ /g, "+")) );
                upd("Map", tab, url);
            }
        } /*end of child*/ ]
    }
};

function debug(msg) {
    if (debugFlag == true) {
        if (msg) console.log(msg);
    }
}

function genericOnClick(info, tab) {
    debug("item " + info.menuItemId + " was clicked");
    debug("info: " + JSON.stringify(info));
    debug("tab: " + JSON.stringify(tab));
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
               /* var s = item;
                debug("Created second level context menu for " + s); */
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
               /*  var s = menuItem["title"];
               debug("Created second level context menu for " + s); */
            });
        }
    }
}

function init() {
    createTopLevel();
    createSecondLevel();
}
