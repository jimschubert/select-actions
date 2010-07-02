String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}
Select = {		
	internalEvent : {},
	linkIds : {blog: "select_google_blogs", sites: "select_google_sites", calendar: "select_google_calendar", maps: "select_google_maps",
									translate: "select_google_translate", define: "select_google_define", note: "select_facebook_note", fbshare: "select_facebook_share", share: "select_twitter_share" },
	polling : 0,
	menuPolling : 0,
	selecting : false,
	clickListeners: [],
	selectionText: '',
	Listener: function() {
		document.body.addEventListener('mouseup', function(event) {
			Select.internalEvent = event;
			Select.polling = window.setInterval(Select.onMouseUp, 200);
		  });
		console.log("Select Actions listener attached.");
	},
	onMouseUp: function() {
		window.clearInterval(Select.polling);
		window.clearInterval(Select.menuPolling);
		if (Select.internalEvent == null) { return;}
		if (Select.selecting == true) { Select.HideMenu(); return; } /* Don't do anything if already selecting */
		
		/* Don't show the menu on right-click, b/c that'd be annoying. */
		if(Select.internalEvent.button == 0 /* Left-click only */ ) {
			Select.selectionText = Select._getSelection();
			if(Select.selectionText) { Select.BuildMenu(); } /* Show menu only on selection of text */
		}
		Select.internalEvent = null;
	},
	_getSelection: function() {
		var w = window,d = document, s = '', u;
		
		if (w.getSelection != u) { s = w.getSelection();}
		else if (d.getSelection != u) { s = d.getSelection(); }
		else if (d.selection) { s = d.selection.createRange().text; }
		else { return ''; }
		
		if (s.length < 2) {
			if (String(w.location.href).substring(0, 6) == 'about:') {
				s = prompt('Keyword or phrase:', s);
			} else { s =  w.location.href; }
		}
		
		s = String(s).trim();
		return escape(s);
	},
	BuildMenu: function() {
			var menu = document.getElementById("iPreferJimSelectActions");
			Select.selecting = true;
			
			if(!menu) {
				Select.clickListeners = [];
				menu = document.createElement('div');
				menu.setAttribute("id","iPreferJimSelectActions");
				menu.innerHTML = '<div style="clear:both;"></div><div id="iPreferJimSelectActionsClose" style="float:right !important;cursor:pointer !important;padding:0px 4px !important;">x</div><div style="clear:both;"></div><ul id="selectActions">' +
						'<li id="' + Select.linkIds.blog + '" class="google"><a href="javascript:void(0);">Find on Blogs</a></li>' +
						'<li id="' + Select.linkIds.sites + '" class="google"><a href="javascript:void(0);">Find on Sites</a></li>' +
						'<li id="' + Select.linkIds.calendar + '" class="google"><a href="javascript:void(0);">Event</a></li>' +
						'<li id="' + Select.linkIds.maps + '" class="google"><a href="javascript:void(0);">Map</a></li>' +						
						'<li id="' + Select.linkIds.translate + '" class="google"><a href="javascript:void(0);">Translate</a></li>' +
						'<li id="' + Select.linkIds.define + '" class="google"><a href="javascript:void(0);">Define</a></li>' +
						'<li id="' + Select.linkIds.note + '" class="facebook"><a href="javascript:void(0);">Note</a></li>' +
						'<li id="' + Select.linkIds.fbshare + '" class="facebook"><a href="javascript:void(0);">Share</a></li>' +
						'<li id="' + Select.linkIds.share + '" class="twitter"><a href="javascript:void(0);">Share</a></li>' +
						'</ul>';
				
				document.body.appendChild(menu);
				
			menu.style.opacity= 60/10;
			menu.style.filter="alpha(opacity=" + 60*10 + ")";
			
				/* Inject CSS with proper location of the images */
				var google = 'background-image:url(' + chrome.extension.getURL("google_icon.png") + ') !important;';
				var facebook =  'background-image:url(' + chrome.extension.getURL("facebook_icon.png") + ') !important;';
				var twitter =  'background-image:url(' +chrome.extension.getURL("twitter_icon.png")+ ') !important;';
				var ruleText = 'div#iPreferJimSelectActions { padding: 0 !important; margin: 0 !important; -webkit-border-radius: 5px !important; position: absolute !important; background: #EEEEFF transparent !important; background-color: #EEEEEF !important; font-family : sans-serif, serif !important; font-style : normal !important; font-size : small !important; border: 1px solid black !important; padding: 2px !important; display: block; z-index: 999 !important; width: 135px !important; height: 210px !important; outline: 0 !important; font-size: 100% !important; vertical-align: baseline !important; line-height: 1 !important; } ' +
					'ul#selectActions { text-align:left !important; padding:5px 2px !important; margin: 0 !important; list-style-type: none !important; } ' +
					'ul#selectActions li { text-align:left !important; padding-top: 2px !important; padding-bottom: 2px !important; height: 20px !important; background-repeat: no-repeat !important; border-bottom-style: groove !important; border-bottom: 1px solid #EEEEFF !important; padding: 0 !important; margin: 0 !important; } ' +
					'ul#selectActions li a, ul#selectActions li a:hover, ul#selectActions li a:visited { color: #000000 !important; padding: 4px 0px 0px 24px !important; font-size : small !important; } ' +
					'ul#selectActions li.google {' + google + '} ' +
					'ul#selectActions li.facebook {' + facebook + '} ' +
					'ul#selectActions li.twitter {' + twitter + '} ';
				var head = document.getElementsByTagName('head')[0],
					style = document.createElement('style'),
					rules = document.createTextNode(ruleText);
				
				if(style && style.styleSheet) {
					style.styleSheet.cssText = rules.nodeValue;
					} else {style.appendChild(rules); }
					
				head.appendChild(style);
				
				/* Add Click handlers */
				var tmp;
				for(var key in Select.linkIds) {
					tmp = document.getElementById(Select.linkIds[key]);
					if(tmp) {
						var fn;
						switch(key) {
							case "blog":
								fn = Select.Google.Blogs;
								break;
							case "sites":
								fn = Select.Google.Sites;
								break;
							case "calendar":
								fn = Select.Google.Calendar;
								break;
							case "maps":
								fn = Select.Google.Maps;
								break;
							case "translate":
								fn = Select.Google.Translate;
								break;
							case "define":
								fn = Select.Google.Define;
								break;
							case "note":
								fn = Select.Facebook.Note;
								break;
							case "fbshare":
								fn = Select.Facebook.Share;
								break;
							case "share":
								fn = Select.Twitter.Share;
								break;
							default:
								fn = undefined;
						}
						
						if(fn) {
							Select.clickListeners.push(tmp.addEventListener('click', fn));
						}
					}
				}
				/* also do a click handler for the close "button" */
				tmp = document.getElementById("iPreferJimSelectActionsClose");
				if(tmp) { Select.clickListeners.push(tmp.addEventListener('click', Select.HideMenu)); }
			}	
			
			var leftPt = Select.internalEvent.pageX + 'px';
			var topPt = Select.internalEvent.pageY + 'px';
			menu.style.display= "block";
			menu.style.left= leftPt;
			menu.style.top= topPt;			
			
			/* Give this 'popup' some time, then hide it */
			console.log("Showing Select Actions menu.");
			Select.menuPolling = window.setInterval(Select.HideMenu, 3000);
	},
	HideMenu: function() {
		console.log("Hiding Select Actions menu.");
		var menu = document.getElementById("iPreferJimSelectActions");
		if(menu){menu.style.display = "none";}
		Select.selecting = false;
		window.clearInterval(Select.menuPolling);
		Select.menuPolling = null;
	},
	Google: {
		Blogs : function(){
			var s = Select.selectionText;
			if (s) { window.location.href = ('http://blogsearch.google.com/blogsearch?q=' +s); }
			void(0);
		},
		Sites: function(){
			var s = Select.selectionText;
			if (s) { window.location.href = ('http://www.google.com/search?q=' + s); }
			void(0);
		},
		Calendar: function(){
			var s = Select.selectionText;
			if (!s) { return; }	
			var t = prompt('Please enter a description for the event', s);
			if (t) {
				window.location.href = ('http://www.google.com/calendar/event?ctext=' + t + '&action=TEMPLATE&pprop=HowCreated%3AQUICKADD');
			}
			void(0);
		},
		Translate: function(){		
			var s = Select.selectionText;
			var e = navigator.language || "en";
			if (s) { 
				window.location.href = 'http://translate.google.com/#auto|' + e.substring(0,2) + '|' + s;
			}
			else {
				window.location.href = 'http://translate.google.com/translate?js=y&u=' + escape(window.location.href) + '&tbb=1&sl=auto&tl=' + e;
			}
			void(0);
		},
		Define: function(){	
			var s = Select.selectionText;
			if (!s) { return; }	
			s = String(s).replace(/\r\n|\r|\n/g, " ,");
			var url = "http://www.google.com/search?q=define:" + String(s).replace(/ /g, "+");
			window.location.href = url;
			void(0);
		},
		Maps: function() {
			var s = Select.selectionText;
			if (!s) { return; }	
			s = s.replace(/\r\n|\r|\n/g, " ,");
			window.location.href = ("http://maps.google.com?q=" + s.replace(/ /g, "+"));	
			void(0);			
		}
	},
	Facebook: {
		Note: function(){
			var s = Select.selectionText;
			if (!s) { return; }	
			
			var d = document,
				f = 'http://www.facebook.com/share',
				l = window.location,
				e = encodeURIComponent,
				p = '.php?u=' + e(l.href) + '&t=' + e(d.title);
			1;
			try {
				if (!/^(.*\.)?facebook\.[^.]*$/.test(l.host)) { throw (0); }
				share_internal_bookmarklet(p);
			} catch(z) {
				if (!window.open(f + 'r' + p, 'sharer', 'toolbar=0,status=0,resizable=1,width=626,height=436')) { l.href = (f + p); }
			}
			void(0);
		},
		Share: function(){
			var s = Select.selectionText;
			if (!s) { return; }	
			
			var d = document,
				f = 'http://www.facebook.com/connect/prompt_feed.php?&message=',
				l = window.location,
				e = encodeURIComponent;
			1;
			try {
				if (!/^(.*\.)?facebook\.[^.]*$/.test(l.host)) { throw (0); }
				users_setStatus(p);
			} catch(z) {
				if (!window.open(f  + s, 'status', 'toolbar=0,status=0,resizable=1,width=626,height=436')) { l.href = (f + s); }
			}
			void(0);
		}
	},
	Twitter: {
		Share: function() {
			var s = Select.selectionText;
			if (!s) { return; }	
			s = s.replace(/\r\n|\r|\n/g, " ,");
			window.location.href = ("http://twitter.com/home?status=" + s.replace(/ /g, "+"));	
			void(0);			
		}
	}
};

function AttachListener() {	
if(/Chrome/i.test(window.navigator.userAgent)){ //Test for Chrome
  var t = window.setInterval(function(){
  if(/loaded|complete/.test(document.readyState)){
    window.clearInterval(t);	
	Select.Listener();
  }}, 10)
}
};

AttachListener();