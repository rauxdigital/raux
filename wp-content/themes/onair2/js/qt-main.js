/**====================================================================
 *
 *  OnAir2 Main Script File
 *  @version  3.7.5 [2020 April 23]
 *  
 ====================================================================**/
/*====================================================================

	CODEKIT PREPENDS:
	THESE BELOW ARE NOT COMMENTS, BUT THE CODEKIT'S PREPEND FILES 
	ENQUEUED IN MAIN-MIN.JS

	TO USE THE OPEN VERSION OF THE FILES FOR YOUR CUSTOMIZATIONS, 
	ENABLE THE DEBUG OPTIONS IN THE THEME'S CUSTOMIZER

====================================================================*/


// @codekit-prepend "materializecss/bin/materialize.min.js";
// @codekit-prepend "jquerycookie.js";
// @codekit-prepend "../components/slick/slick.min.js";
// @codekit-prepend "../components/countdown/js/jquery.knob.js";
// @codekit-prepend "../components/countdown/js/jquery.throttle.js";
// @codekit-prepend "../components/countdown/js/jquery.classycountdown.min.js";
// @codekit-prepend "../components/soundmanager/script/excanvas.js";
// @codekit-prepend "../components/soundmanager/script/berniecode-animator.js";
// @codekit-prepend "../components/soundmanager/script/soundmanager2-nodebug.js";
// @codekit-prepend "../components/soundmanager/script/shoutcast-ssl.js";
// @codekit-prepend "../components/soundmanager/templates/qtradio-player/script/qt-360player-volumecontroller.js";
// @codekit-prepend "../components/popup/popup.js";
// @codekit-prepend "../components/fitvids/jquery.fitvids.js";
// @codekit-prepend "../components/skrollr/skrollr.min.js";

(function($) {
	"use strict";

	var qtShoutcastInterval;

	$.onAir2Obj = {};
	$.onAir2Obj.body = $("body");
	$.onAir2Obj.htmlAndbody = $('html,body');

	/**====================================================================
	 *
	 *
	 * 	Function to go back in history used by form check
	 *
	 * 
	 ====================================================================*/
	window.goBack = function(e) {
		var defaultLocation = "http://www.mysite.com";
		var oldHash = window.location.hash;
		history.back(); // Try to go back
		var newHash = window.location.hash;
		if (
			newHash === oldHash &&
			(typeof(document.referrer) !== "string" || document.referrer === "")
		) {
			window.setTimeout(function() {
				// redirect to default location
				window.location.href = defaultLocation;
			}, 1000); // set timeout in ms
		}
		if (e) {
			if (e.preventDefault){
				e.preventDefault();
			}
			if (e.preventPropagation){
				e.preventPropagation();
			}
		}
		return false; // stop event propagation and browser default event
	};


	$.fn.qtIsMobileBrowser = function(content) {
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			return true;
		}
		return false;
	}

	
	/**====================================================================
	 *
	 *
	 * Automatic link embed
	 *
	 * 
	 ====================================================================*/
	$.fn.embedMixcloudPlayer = function(content) {
		var finalurl = ((encodeURIComponent(content)));
		finalurl = finalurl.replace("https","http");
		var embedcode ='<iframe data-state="0" class="mixcloudplayer" width="100%" height="80" src="//www.mixcloud.com/widget/iframe/?feed='+finalurl+'&embed_uuid=addfd1ba-1531-4f6e-9977-6ca2bd308dcc&stylecolor=&embed_type=widget_standard" frameborder="0"></iframe><div class="canc"></div>';    
		return embedcode;
	}

	$.fn.embedVideo = function (content, width, height) {
		height = width / 16 * 9;
		var youtubeUrl = content;
		var youtubeId = youtubeUrl.match(/=[\w-]{11}/);
		var strId = youtubeId[0].replace(/=/, '');
		var result = '<iframe width="'+width+'" height="'+height+'" src="'+window.location.protocol+'//www.youtube.com/embed/' + strId + '?html5=1" frameborder="0" class="youtube-player" allowfullscreen></iframe>';
		return result;
	}

	$.fn.embedSpotify = function(mystring, width, height){
		var trackID = mystring.split('https://open.spotify.com/track/').join('');
		return '<iframe src="https://open.spotify.com/embed/track/'+trackID+'" width="'+width+'" height="'+height+'" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
	};


	/**====================================================================
	 *
	 *
	 *	 Responsive video resize
	 *
	 * 
	 ====================================================================*/
	$.fn.NewYoutubeResize = function  (){
		$("iframe").each(function(i,c){ // .youtube-player
			var t = $(c);
			if(t.attr("src")){
				var href = t.attr("src");
				if(href.match("youtube.com") || href.match("vimeo.com") || href.match("vevo.com")  || href.match("dailymotion.com")){
					var width = t.parent().width(),
						height = t.height();
					t.css({"width":width});
					t.height(width/16*9);
				}; 
			};
		});
	};

	/**====================================================================
	 *
	 *
	 * 	Check images loaded in a container
	 *
	 * 
	 ====================================================================*/
	$.fn.imagesLoaded = function () {
			// get all the images (excluding those with no src attribute)
		var $imgs = this.find('img[src!=""]');
		// if there's no images, just return an already resolved promise
		if (!$imgs.length) {return $.Deferred().resolve().promise();}
		// for each image, add a deferred object to the array which resolves when the image is loaded (or if loading fails)
		var dfds = [];  
		$imgs.each(function(){
			var dfd = $.Deferred();
			dfds.push(dfd);
			var img = new Image();
			img.onload = function(){dfd.resolve();}
			img.onerror = function(){dfd.resolve();}
			img.src = this.src;
		});
		// return a master promise object which will resolve when all the deferred objects have resolved
		// IE - when all the images are loaded
		return $.when.apply($,dfds);
	}

	/**====================================================================
	 *
	 *
	 * Transform link in embedded players
	 *
	 * 
	 ====================================================================*/

	$.fn.transformlinks = function (targetContainer) {
		if(undefined === targetContainer) {
			targetContainer = "body";
		}

		// Since 3.4.3
		if($('body').hasClass('qt-autoembed-disable')){
			return;
		} // End

		jQuery(targetContainer).find("a[href*='youtube.com'],a[href*='youtu.be'],a[href*='mixcloud.com'],a[href*='soundcloud.com'], [data-autoembed]").not('.qw-disableembedding').each(function(element) {
			var that = jQuery(this);
			
			if(that.parent().hasClass('qw-disableembedding')) {
				return;
			}
			var mystring = that.attr('href');
			if(that.attr('data-autoembed')) {
				mystring = that.attr('data-autoembed');
			}
			var width = that.parent().width();
			
			if(width === 0){
				width = that.parent().parent().parent().width();
			}
			if(width === 0){
				width = that.parent().parent().parent().width();
			}
			if(width === 0){
				width = that.parent().parent().parent().parent().width();
			}
			var height = that.height();
			var element = that;

			//=== YOUTUBE https
			var expression = /(http|https):\/\/(\w{0,3}\.)?youtube\.\w{2,3}\/watch\?v=[\w-]{11}/gi;
			var videoUrl = mystring.match(expression);
			if (videoUrl !== null) {
				for (var count = 0; count < videoUrl.length; count++) {
					mystring = mystring.replace(videoUrl[count], $.fn.embedVideo(videoUrl[count], width, (width/16*9)));
					replacethisHtml(mystring);
				}
			}              

			//=== SPOTIFY 
			var expression = /https:\/\/open\.spotify\.\w{2,3}\/track\/[\w-]{22}/gi,
				trackurl = mystring.match(expression);

			if (trackurl !== null) {
				for (var count = 0; count < trackurl.length; count++) {
					mystring = mystring.replace( trackurl[count], $.fn.embedSpotify( trackurl[count], width, 80 ) );

					replacethisHtml(mystring);
				}
			}  

			//=== SOUNDCLOUD
			var temphtml = '';
			var iframeUrl = '';
			var $temphtml;
			var expression = /(http|https)(\:\/\/soundcloud.com\/+([a-zA-Z0-9\/\-_]*))/g;
			var scUrl = mystring.match(expression);
			if (scUrl !== null) {
				for (count = 0; count < scUrl.length; count++) {
					var finalurl = scUrl[count].replace(':', '%3A');
					finalurl = finalurl.replace("https","http");
					jQuery.getJSON(
						'https://soundcloud.com/oembed?maxheight=140&format=js&url=' + finalurl + '&iframe=true&callback=?'
						, function(response) {
							temphtml = response.html;
							if(that.closest("li").length > 0){
								if(that.closest("li").hasClass("qt-collapsible-item")) {
									$temphtml = $(temphtml);
									iframeUrl = $temphtml.attr("src");
									replacethisHtml('<div class="qt-dynamic-iframe" data-src="'+iframeUrl+'"></div>');
								}
							} else {
								replacethisHtml(temphtml);
							}
					});
				}
			}
			//=== MIXCLOUD
			var expression = /(http|https)\:\/\/www\.mixcloud\.com\/[\w-]{0,150}\/[\w-]{0,150}\/[\w-]{0,1}/ig;
			videoUrl = mystring.match(expression);
			if (videoUrl !== null) {
				for (count = 0; count < videoUrl.length; count++) {
					mystring = mystring.replace(videoUrl[count], $.fn.embedMixcloudPlayer(videoUrl[count]));
					replacethisHtml(mystring);
				}
			}
			//=== STRING REPLACE (FINAL FUNCTION)
			function replacethisHtml(mystring) {
				element.replaceWith(mystring);
				return true;
			}
			$.fn.NewYoutubeResize();
		});
		
		/**
		 * Fix for soundcloud loaded in collapsed div for the chart
		 */
		$.onAir2Obj.body.on("click",'.qt-collapsible li', function(e){
			var that = $(this);
			if(that.hasClass("active")){
				var item = that.find(".qt-dynamic-iframe");
				var itemurl = item.attr("data-src");
				item.replaceWith('<iframe src="'+itemurl+'" frameborder="0"></iframe>');
				$.fn.NewYoutubeResize();
			}
		});
	}





	/**====================================================================
	 *
	 * 
	 *  Responsive videos using fitvids library
	 *  https://github.com/davatron5000/FitVids.js
	 *  
	 * 
	 ====================================================================*/
	$.fn.qtFitvids = function() {
		if(typeof($.fn.fitVids) === "undefined"){
			return; // library is missing
		}
		$("#maincontent").fitVids();
	};

	/**====================================================================
	 *
	 * 
	 *	12. Mobile navigation
	 *	
	 * 
	 ====================================================================*/
	$.fn.qtMobileNav = function() {

		$.onAir2Obj.body.find( ".side-nav li.menu-item-has-children").each(function(i,c){
			var that = $(c);
			that.append("<a class='qt-openthis'><i class='dripicons-chevron-down'></i></a>");
			that.on("click",".qt-openthis", function(e){
				e.preventDefault();
				that.toggleClass("open");
				return;
			});
			return;
		});


		return true;
	};


	/**====================================================================
	*
	* 
	*  	Slick gallery
	*  
	* 
	====================================================================*/
	$.fn.slickGallery = function() {
		if($('.qt-slickslider, .qt-slick').length === 0) {
			return;
		}
		$('.qt-slickslider, .qt-slick').not('.slick-initialized').each(function() {
			var that = $(this),
				slidesToShow = that.attr("data-slidestoshow"),
				slidestoshowMobile = that.attr("data-slidestoshowmobile"),
				slidestoshowIpad = that.attr("data-slidestoshowipad"),
				appendArrows = that.attr("data-appendArrows");
			if (slidesToShow === undefined || slidesToShow === "") {
				slidesToShow = 1;
			}
			if (slidestoshowMobile === undefined || slidestoshowMobile === "") {
				slidestoshowMobile = 1;
			}
			if (slidestoshowIpad === undefined || slidestoshowIpad === "") {
				slidestoshowIpad = slidesToShow;
			}
			if (appendArrows === undefined || appendArrows === "") {
				appendArrows = that; // append the arrows to the same container
			} else {
				appendArrows = that.closest(appendArrows); // or append arrows to other divs
			}
			that.slick({
				// lazyLoad: 'progressive',
				slidesToScroll: 1,
				pauseOnHover: that.attr("data-pauseonhover") === "true",
				infinite: that.attr("data-infinite") === "true",
				autoplay: that.attr("data-autoplay") === "true",
				autoplaySpeed: 4000,
				centerPadding: 0,
				slide: ".qt-item",
				dots: that.attr("data-dots") === "true",
				variableWidth: that.attr("data-variablewidth") === "true",
				arrows: that.attr("data-arrows") === "true",
				centerMode: that.attr("data-centermode") === "true",
				slidesToShow: slidesToShow,
				appendArrows: appendArrows,
				responsive: [
					{
						breakpoint: 1170,
						settings: {
							slidesToShow: slidestoshowIpad, 
							arrows: slidestoshowIpad === 1,
							dots: slidestoshowIpad > 1
						}
					},
					{
						breakpoint: 600,
						settings: {
							arrows: that.attr("data-arrowsmobile") === "true",
							centerMode: that.attr("data-centermodemobile") === "true",
							centerPadding: 0,
							variableWidth: that.attr("data-variablewidthmobile") === "true",
							variableHeight: false,
							dots: that.attr("data-dotsmobile") === "true",
							slidesToShow: 1,//slidestoshowMobile,
							draggable: false,
							swipe: true,
							touchMove: true,
							infinite: that.attr("data-infinitemobile") === "true",
						}
					}

				]
			}).promise().done(function(){
				that.removeClass("qt-invisible");
			});
		});
	};

	/**====================================================================
	 *
	 * 
	 *	Generic class switcher (toggle class or toggleclass)
	 *	
	 * 
	 ====================================================================*/
	$.fn.qtQtSwitch = function() {
		$.onAir2Obj.body.off("click", "[data-qtswitch]");
		$.onAir2Obj.body.on("click", "[data-qtswitch]", function(e) {
			var that = $(this);
			e.preventDefault();
			$(that.attr("data-target")).toggleClass(that.attr("data-qtswitch"));
		});

		$("[data-expandable]").each(function(i, c) {
			var that = $(c),
				selector = that.attr("data-expandable"),
				target = $(selector);

			if (selector !== "") {
				if (target.hasClass("open")) {
					target.velocity({
						properties: {
							height: target.find(".qt-expandable-inner").height() + "px"
						},
						options: {
							duration: 50

						}
					});
				}
			}

		});
		$.onAir2Obj.body.off("click", "[data-expandable]");
		$.onAir2Obj.body.on("click", "[data-expandable]", function(e) {
			e.preventDefault();
			var btn = $(this);
			var that = $(btn.attr("data-expandable"));
			if (!that.hasClass("open")) {
				that.addClass("open");
				that.velocity({
					properties: {
						height: that.find(".qt-expandable-inner").height() + "px"
					},
					options: {
						duration: 300
					}
				});
			} else {
				that.removeClass("open");
				// that.height(0);
				that.velocity({
					properties: {
						height: 0
					},
					options: {
						duration: 300
					}
				});
			}
		});
	};


	/**====================================================================
	 *
	 *
	 * 	04. Parallax Backgrounds with blur by QantumThemes
	 *
	 * 
	 ====================================================================*/

	$.fn.parallaxV3 = function(options) {

		var windowHeight = $(window).height(),
			windowWidth = $(window).width(),
			isMoz,
			mozFix = 0;
	

		if( /Mozilla/i.test(navigator.userAgent) ) {
			mozFix = 800;
		}
		

		// Establish default settings
		var settings = $.extend({
			speed        : 0.15
		}, options);
		 

		// Iterate over each object in collection
		return this.each( function() {
			var that = $(this);
			var scrollTop = $(window).scrollTop();
			var offset = that.offset().top;
			var height = that.outerHeight();
			var yBgPosition = Math.round((offset - scrollTop) * settings.speed);
			var myspeed = settings.speed / 6;


			that.initialBlur = that.attr("data-blurStart");
			that.css('background-position', 'center ' + yBgPosition + 'px' );
			that.scrolling =   that.attr("data-scrolling");
			if(that.hasClass('vc_parallax')){
				that.css({"opacity": 1});
			} else {
				that.css({"opacity": 0.55});
			}

			that.css('background-attachment', 'fixed' );

			if($.fn.qtIsMobileBrowser()  || windowWidth < 1279 ) {
				that.css('background-attachment', 'local' );
				that.css('background-position', 'center center');
				return;
			} else {
				that.css('background-attachment', 'fixed' );
			}


			if(!$.onAir2Obj.body.hasClass("mobile")){
				var eventThrottle = 5,
					now = Date.now(), 
					lastMove = now;
				scrollTop = $(window).scrollTop();
				offset = that.offset().top  - mozFix;
				height = that.outerHeight();
				yBgPosition = Math.round((offset - scrollTop) * myspeed);
				that.css({'background-position': 'center ' + yBgPosition + 'px', 'min-height': height });

				$(document).scroll(function(){
					now = Date.now();
					if (now > (lastMove + eventThrottle) ){
						scrollTop = $(window).scrollTop();
						offset = that.offset().top - mozFix; // -200 // firefox issue qould require -880

						height = that.outerHeight();
						if (offset + height <= scrollTop || offset >= scrollTop + windowHeight) {
							return;
						}
						yBgPosition = Math.round((offset - scrollTop) * myspeed);
						that.css('background-position', 'center ' + yBgPosition + 'px');
						lastMove = now;
					}
				});
			}
		});
	}



	/**====================================================================
	 *
	 * 
	 *  17. Dynamic backgrounds
	 *  
	 * 
	 ====================================================================*/
	$.fn.dynamicBackgrounds = function(targetContainer) {
		if (undefined === targetContainer) {
			targetContainer = "body";
		}
		$(targetContainer + " [data-bgimage]").each(function() {
			var that = $(this),
				bg = that.attr("data-bgimage"),
				parallax = that.attr("data-parallax"),
				myspeed = 1.5,
				bgattachment = that.attr("data-bgattachment");
			if (bgattachment === undefined) {
				bgattachment = "static";
			}
			if (bg !== '') {
				that.css({"background-image": "url("+bg+")",
					"background-size":"cover",
					"background-position":"center center",
					"background-repeat":"no-repeat" , 
					//"background-attachment":"loadingClass",
					"-webkit-transform": "translate3d(0, 0, 0)" ,
					"-webkit-backface-visibility": "hidden",
					"-webkit-perspective": "1000"
				});
				if(parallax === "1") {
					if(that.data('speed')){
						myspeed = that.data('speed');
					}
					that.parallaxV3({  speed : myspeed  });
				} else {
					that.css({"opacity": 0.55});
				}
			}
		});


	};

	/**====================================================================
	 *
	 * 
	 *  Functions to run once on first page load
	 *  
	 * 
	 ====================================================================*/
	$.fn.qtPageloadInit = function() {
		$(".button-collapse").sideNav();
		// Channels list
		$('.button-playlistswitch').sideNav({
			menuWidth: 280, // Default is 240
			edge: 'right', // Choose the horizontal origin
			closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
			draggable: false // Choose whether you can drag to open on touch screens
		});

		$.onAir2Obj.body.off("click", ".button-playlistswitch-close");
		$.onAir2Obj.body.on("click", ".button-playlistswitch-close", function(e) {
			e.preventDefault();
			$('.button-playlistswitch').sideNav('hide');
		});

		$.onAir2Obj.body.off("click", ".qt-scrolltop");
		$.onAir2Obj.body.on("click", ".qt-scrolltop", function(e) {
			e.preventDefault();
			$("html, body").animate({
				scrollTop: 0
			}, "slow");
		});
	};

	/**====================================================================
	 *
	 * 
	 *  Pushpin (uses materializecss library) 
	 *  
	 * 
	 ====================================================================*/
	$.fn.qtPushpin = function() {
		if(typeof($.fn.pushpin) !== "undefined"){
			if ($(window).width() > 1280 && $('.qt-pushpin').length > 0) {
				$('.qt-pushpin').css({
					"width": $('.qt-pushpin').width()
				});
				var containerPushpin = $('.qt-pushpin-container').parent(),
					bottom = containerPushpin.offset().top + containerPushpin.outerHeight(true) - ($(".qt-sharepage").outerHeight(true) + 40),
					top = $('.qt-pushpin-container').offset().top,
					offset = 0;
				if($('body').hasClass('qt-playertype-header') && $('body').hasClass('qt-stickymenu')) {
					offset += 140;
					top -= 140;
					bottom-= 140;
				} else {
					offset += 50;
					top -= 50;
					bottom-= 140;
				}
				if($('body').hasClass('qt-stickymenu')) {
					offset += 80;
					top -= 250;
					bottom-= 250;
				}
				$('.qt-pushpin').pushpin({
					top: top,
					offset: offset,
					bottom: bottom
				});
			}
		}
	};

	/**====================================================================
	 *
	 * 
	 *  Event countdown (requires library component) 
	 *  
	 * 
	 ====================================================================*/

	 function parseDate(input) {
	  var parts = input.match(/(\d+)/g);
	  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
	  return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
	}


	$.fn.qtCountdown = function() {
		$.each($('.qt-countdown'), function(i, c) {
			var that = $(c),
				enddate = that.attr("data-end"),
				nowdate = that.data('now'),
				endtime, nowtime,
				difference,
				end;

			if (enddate !== undefined && enddate !== "") {
				enddate = new Date(enddate);
				nowdate = new Date(nowdate);
				endtime = enddate.getTime();
				nowtime = nowdate.getTime();
				difference = endtime - nowtime;
				$(c).ClassyCountdown({
					theme: "white-wide",
					end: $.now() + (difference / 1000)
				});
				that.find(".ClassyCountdown-days .ClassyCountdown-value span").html(that.attr("data-dayslabel"));
				that.find(".ClassyCountdown-hours .ClassyCountdown-value span").html(that.attr("data-hourslabel"));
				that.find(".ClassyCountdown-minutes .ClassyCountdown-value span").html(that.attr("data-minuteslabel"));
				that.find(".ClassyCountdown-seconds .ClassyCountdown-value span").html(that.attr("data-secondslabel"));
			}
		});
	};


	

	/**====================================================================
	 *
	 * 
	 *  Share link
	 *  
	 * 
	 ====================================================================*/
	$.fn.qtSharelink = function() {
		$(".qt-sharelink").each(function(){

			// deprecated
			// 
			return;
				
			var that = $(this),
				urlencoded = encodeURIComponent(window.location.href) /* Get page URL here and encode it */, // window.location.href
				sharetype = that.attr("data-sharetype"),
				finalurl = '';
			switch (sharetype) {
				case "facebook":
					finalurl = 'https://www.facebook.com/sharer/sharer.php?u='+urlencoded;
				break;
				case "twitter":
					finalurl = 'https://twitter.com/intent/tweet?url='+urlencoded;
				break;
				case "google":
					finalurl = 'https://plus.google.com/share?url='+urlencoded;
				break;
				case "pinterest":
					finalurl = 'https://pinterest.com/pin/create/bookmarklet/?url='+urlencoded;
				break;
			}
			that.attr("href",finalurl);
		});
	};

	/**====================================================================
	 *
	 *
	 *	Masonry templates (based on default Wordpress Masonry)
	 *
	 * 
	 ====================================================================*/
	$.fn.qtMasonry = function(targetContainer){
		if(undefined === targetContainer) {
			targetContainer = "body";
		}
		$(targetContainer).find('.qt-masonry').each( function(i,c){
			var idc = $(c).attr("id");
			var container = document.querySelector('#'+idc);
			if(container){
				var msnry = new Masonry( container, {  itemSelector: '.qt-ms-item',   columnWidth: '.qt-ms-item' });
			}
		});

		$.onAir2Obj.body.imagesLoaded().then(function(){
			$(targetContainer).find('.gallery').each( function(i,c){
				var idc = $(c).attr("id");
				var container = document.querySelector('#'+idc);
				if(container){
					var msnry = new Masonry( container, {  itemSelector: '.gallery-item',   columnWidth: '.gallery-item' });
				}
			});
		});

		
		return true;
	};

	/**====================================================================
	*
	*  Sound destroy
	* 
	====================================================================*/
	$.fn.destroyAll360Sounds = function(){
		if(threeSixtyPlayer !== undefined) {
			threeSixtyPlayer.sounds.forEach(function(element, index, array){
				soundManager.stop(element.id);
				soundManager.destroySound(element.id);
			});
		}
	}

	/**====================================================================
	*
	*  360 player
	* 
	====================================================================*/
	$.fn.qt360player = function(targetContainer, action){
		var playerContainer = $("#qtplayercontainer"),
			mp3url = '',
			fullstop = playerContainer.data('fullstop'),
			qtBody = $("body");
			
		soundManager.setup({
			url: playerContainer.attr("data-soundmanagerurl"),
			allowScriptAccess: 'always',
			useHighPerformance: true,
			consoleOnly: true,
			debugMode: false,
			debugFlash: false,
			bufferTime: 2// this adds 2 seconds buffer
		});

		soundManager.flash9Options.useWaveformData = true; 
		soundManager.flash9Options.useEQData = true;
		soundManager.flash9Options.usePeakData = true;
		soundManager.preferFlash = true;
		soundManager.flashVersion = 9;
		var playerVolume = false;
		if(!navigator.userAgent.match(/mobile/i) && playerContainer.attr("data-playervolume") === "true") {
			playerVolume = true;
		}
		threeSixtyPlayer = new ThreeSixtyPlayer();
		threeSixtyPlayer.config = {
			fullStop: fullstop, // since 3.6.7 passed to qt-360player-volumecontroller.js
			playNext: false,
			autoPlay: false,
			allowMultiple: false,
			playervolume:  true,
			loadRingColor: playerContainer.attr("data-textcolor"), // ACCENT COLOR
			playRingColor:  playerContainer.attr("data-accentcolor"), // DARKER
			backgroundRingColor:playerContainer.attr("data-accentcolordark"),
			circleDiameter: 280,
			circleRadius: 140,
			animDuration: 500,
			animTransition: Animator.tx.bouncy,
			showHMSTime: true,
			useWaveformData: true,
			waveformDataColor: '#fff',
			waveformDataDownsample: 3,
			waveformDataOutside: false,
			waveformDataConstrain: false,
			waveformDataLineRatio: 0.8,
			useEQData: true,
			eqDataColor: '#FFF',
			eqDataDownsample: 2,
			eqDataOutside: true,
			eqDataLineRatio: 0.73,
			usePeakData: true,
			peakDataColor: '#FFF',
			peakDataOutside: true,
			peakDataLineRatio: 1.8,
			scaleArcWidth: 0.80,
			useAmplifier: true,
			useFavIcon: true
		}
		// hook into SM2 init
		soundManager.onready(threeSixtyPlayer.init);




		/**
		 * ================================ custom states hooks
		 */
		
		var onplay360 = threeSixtyPlayer.events.play;
		var onresume360 = threeSixtyPlayer.events.resume;
		var onfinish360 = threeSixtyPlayer.events.finish;
		var onpause360 = threeSixtyPlayer.events.pause;
		var onstop360 = threeSixtyPlayer.events.stop;

		// @since 3.6.7
		// If the customizer option of the radio says to stop, disconnects completely
		if( fullstop ){
			onpause360 = threeSixtyPlayer.events.stop;
		}



		$("#qtpausebtn .pause").hide();
		
		var myOnplay = function(){
			smState = 'play';
			qtlistenbutton.addClass("qt-btn-primary");
			$("#qtpausebtn i").addClass("dripicons-media-pause").removeClass("dripicons-media-play");
			$("#qtpausebtn .pause").show();
			$("#qtpausebtn .play").hide();
			onplay360.apply(this); // forces the scope to 'this' = the sound object
		};
		threeSixtyPlayer.events.play = myOnplay;

		var  qtlistenbutton = $(".qtlistenbutton");
		var myOnresume = function(){
			qtlistenbutton.addClass("qt-btn-primary");
			$("#qtpausebtn i").addClass("dripicons-media-pause").removeClass("dripicons-media-play");
			$("#qtpausebtn .pause").show();
			$("#qtpausebtn .play").hide();
			onplay360.apply(this); 
		};
		threeSixtyPlayer.events.resume = myOnresume;

		var myOnfinish = function(){
			onfinish360.apply(this); // forces the scope to 'this' = the sound object
		};
		threeSixtyPlayer.events.finish = myOnfinish;

		var myOnpause = function(){
			qtlistenbutton.removeClass("qt-btn-primary");
			$("#qtpausebtn i").removeClass("dripicons-media-pause").addClass("dripicons-media-play");
			$("#qtpausebtn .pause").hide();
			$("#qtpausebtn .play").show();
			onpause360.apply(this); // forces the scope to 'this' = the sound object
			if( fullstop ){
				$.fn.destroyAll360Sounds();
			}
		};
		threeSixtyPlayer.events.pause = myOnpause;

		var myOnstop = function(){
			qtlistenbutton.removeClass("qt-btn-primary");
			$("#qtpausebtn i").removeClass("dripicons-media-pause").addClass("dripicons-media-play");
			$("#qtpausebtn .pause").hide();
			$("#qtpausebtn .play").show();
			$.fn.destroyAll360Sounds();
			onstop360.apply(this); // forces the scope to 'this' = the sound object
		};
		threeSixtyPlayer.events.stop = myOnstop;




		////////////////////////////////////////////////////
		///
		
		threeSixtyPlayer.config.useWaveformData = true;
		threeSixtyPlayer.config.useEQData = true;
		// enable this in SM2 as well, as needed
		if (threeSixtyPlayer.config.useWaveformData) {
		  soundManager.flash9Options.useWaveformData = true;
		}
		if (threeSixtyPlayer.config.useEQData) {
		  soundManager.flash9Options.useEQData = true;
		}
		if (threeSixtyPlayer.config.usePeakData) {
		  soundManager.flash9Options.usePeakData = true;
		}
		if (threeSixtyPlayer.config.useWaveformData || threeSixtyPlayer.flash9Options.useEQData || threeSixtyPlayer.flash9Options.usePeakData) {
		  // even if HTML5 supports MP3, prefer flash so the visualization features can be used.
		  soundManager.preferFlash = false;
		}
		threeSixtyPlayer.config.fullStop = fullstop;

		if(action === "destroy") {
			$.fn.destroyAll360Sounds();
		}
		if(undefined === targetContainer) {
			targetContainer = "body";
		};
		var url, actualplaying, player, target, smState = false, playtrack, firstloaded = false, 
			qtTracktitle = $(targetContainer).find("#qtradiotitle"),
			qtradiosubtitle = $(targetContainer).find("#qtradiosubtitle"),
			playClass = 'dripicons-media-play',
			pauseClass= "dripicons-media-pause",
			loadingClass = "dripicons-media-play", 
			trackextension = '';

		// Load a track in the player
		//================================================
		function loadInPlayer (c, autoplay){
			$.fn.destroyAll360Sounds();
			playtrack = c.attr( "data-playtrack");
			if(playtrack === undefined) {
				return;
			}
			mp3url =  c.attr( "data-playtrack").split("geo-sample").join("sample");
			soundManager.stopAll();
			var player = $('.qt-ui360');
			player.empty();
			var random = Math.floor(Math.random()*1000000);
			player.append('<a id="playerlink" href="' + mp3url + '?ver=' + random + '"></a>');
			if(autoplay){
				threeSixtyPlayer.config.autoPlay = true;
				$(targetContainer).find("a.beingplayed").removeClass("beingplayed").find("i").removeClass(pauseClass).addClass(playClass);
				actualplaying = mp3url;
				c.addClass("beingplayed").find("i").removeClass(playClass).addClass(pauseClass);
			} else {
				$(targetContainer).find("a.beingplayed").removeClass("beingplayed").find("i").removeClass(pauseClass).addClass(playClass);				
				threeSixtyPlayer.config.autoPlay = false;
			}
			var background = c.attr("data-background"),
				logo = c.attr("data-logo"),
				title = c.attr("data-title"),
				subtitle = c.attr("data-subtitle");
			qtTracktitle.html(title);
			qtradiosubtitle.html(subtitle);
			$("#playerimage").attr("data-bgimage", background).css({"background-image": "url("+background+")"});
			$("#playerimage img").attr("src", background);
			threeSixtyPlayer.init();
			return;
		};
		// MP3 link click
		//================================================
		qtBody.off("click", "a[data-playtrack]");
		qtBody.on("click", "a[data-playtrack]", function(e) {
			e.preventDefault();
			var c = $(this);
			if(c.hasClass("beingplayed")){
				loadInPlayer($(this), false);
			} else {
				loadInPlayer(c, true);
			}
			$(".activeRadioChannel").removeClass("activeRadioChannel");
			c.addClass("activeRadioChannel");
			// We update the feed here:==================
			var qtShoutcastFeedData = $("#qtShoutcastFeedData"); // where we store the data (in the player container hidden div)
			
			var	qtIcyMetadata = c.attr("data-icymetadata"), // since 3.7.3
				qtPlaytrack = c.attr("data-playtrack"),
				qtradiofeedHost = c.attr("data-host"),
				qtradiofeedPort =  c.attr("data-port"),
				qtradiofeedChannel =  c.attr("data-channel"),
				qtradiofeedProtocol =  c.attr("data-protocol"), // 2019 08 10
				qtIcecasturl =  c.attr("data-icecasturl"),
				qticemount =  c.attr("data-icecastmountpoint"),
				qticechannel =  c.attr("data-icecastchannel"),
				qtradiodotco =  c.attr("data-radiodotco"),
				qtairtime =  c.attr("data-airtime"),
				qtradionomy =  c.attr("data-radionomy"),
				qtlive365 =  c.attr("data-live365"),
				qtSecuresystems =  c.attr("data-securesystems"),
				qtWinMedia =  c.attr("data-winmedia"),
				qttextfeed = c.attr("data-textfeed"),
				qtJazler = c.attr("data-jazler"),
				qtMediacp = c.attr("data-mediacp"),
				qtRadioId = c.attr("data-qtradioid"),
				qtFeedStyle = qtShoutcastFeedData.attr("data-style");

			if(qtradiofeedChannel === '' || qtradiofeedChannel === undefined){
				qtradiofeedChannel = '1';
			}
			qtShoutcastFeedData.attr("data-playtrack",qtPlaytrack); // since 3.7.3
			qtShoutcastFeedData.attr("data-icymetadata",qtIcyMetadata); // since 3.7.3
			qtShoutcastFeedData.attr("data-host",qtradiofeedHost);
			qtShoutcastFeedData.attr("data-port",qtradiofeedPort);
			qtShoutcastFeedData.attr("data-icecasturl",qtIcecasturl);
			qtShoutcastFeedData.attr("data-icecastmountpoint",qticemount);
			qtShoutcastFeedData.attr("data-icecastchannel",qticechannel);
			qtShoutcastFeedData.attr("data-channel",qtradiofeedChannel);
			qtShoutcastFeedData.attr("data-protocol",qtradiofeedProtocol);// 2019 08 10
			qtShoutcastFeedData.attr("data-radiodotco",qtradiodotco);
			qtShoutcastFeedData.attr("data-airtime",qtairtime);
			qtShoutcastFeedData.attr("data-radionomy",qtradionomy);
			qtShoutcastFeedData.attr("data-live365",qtlive365);
			qtShoutcastFeedData.attr("data-securesystems",qtSecuresystems);
			qtShoutcastFeedData.attr("data-winmedia",qtWinMedia);
			qtShoutcastFeedData.attr("data-textfeed",qttextfeed);
			qtShoutcastFeedData.attr("data-jazler",qtJazler);
			qtShoutcastFeedData.attr("data-qtradioid",qtRadioId);
			qtShoutcastFeedData.attr("data-mediacp",qtMediacp);
			$("#qtPlayerTrackInfo").hide();
			$.fn.qtShoutcastFeedNew();
			return false;
		});

		qtBody.on("click", "#qtpausebtn", function(e) {
			e.preventDefault();
			$(".activeRadioChannel").click();
		});
		// Preload radio channel
		var autoselect = $('.qt-autoselect-channel');
		if(autoselect.length > 0){
			loadInPlayer(autoselect, false);
		}
		
	};


	/**====================================================================
	 *
	 * 
	 *  Autoplay
	 *  
	 * 
	 ====================================================================*/
	$.fn.qtRadioAutoplay = function() {
		jQuery("#qtfirstchannel").click();
	};

	/**====================================================================
	*
	* SHOTCAST XML Feed Info
	* 
	====================================================================*/

	$.fn.qtApplyTitle = function(result){
		if(result){
			var feedsplit = result.split(" - "), author, title;
			if(feedsplit.length > 1){
				author = feedsplit[0],
				title = feedsplit[1];
			} else {
				author = "";
				title = result;
			}
			$('#qtFeedPlayerTrack').html(title);
			$('#qtFeedPlayerAuthor').html(author);
			$("#qtPlayerTrackInfo").show();
			$('.qt-short-nowonairtextual span').html(' '+author+' - '+title);
		}
		return;
	}

	$.fn.qtShoutcastFeedNew = function(){


		if( $("#qtShoutcastFeedData").length === 0 ){
			return;
		}

		if( $("body").hasClass('qt-customizer-active') ){
			$.fn.qtApplyTitle( 'Disabled during customization - Song title' );
			return;
		}
	

		var proxyURL = $("#qantumthemesproxyurl").data('proxyurl');
		var qtShoutcastFeedData = $("#qtShoutcastFeedData"),
			qtPlaytrack =  qtShoutcastFeedData.attr("data-playtrack"), // since 3.7.3
			qtIcyMetadata = qtShoutcastFeedData.attr("data-icymetadata"), // since 3.7.3
			qtradiofeedHost = qtShoutcastFeedData.attr("data-host"),
			qtradiofeedPort =  qtShoutcastFeedData.attr("data-port"),
			qtradiofeedProtocol =  qtShoutcastFeedData.attr("data-protocol"),
			qticecasturl =  qtShoutcastFeedData.attr("data-icecasturl"),
			qticecastmountpoint =  qtShoutcastFeedData.attr("data-icecastmountpoint"),
			qticecastchannel =  qtShoutcastFeedData.attr("data-icecastchannel"),
			qtradiodotco =  qtShoutcastFeedData.attr("data-radiodotco"),
			qtairtime =  qtShoutcastFeedData.attr("data-airtime"),
			qtradionomy =  qtShoutcastFeedData.attr("data-radionomy"),
			qtMediacp =  qtShoutcastFeedData.attr("data-mediacp"),
			qtlive365 =  qtShoutcastFeedData.attr("data-live365"),
			qtSecuresystems =  qtShoutcastFeedData.attr("data-securesystems"),
			qtWinMedia =  qtShoutcastFeedData.attr("data-winmedia"),
			qttextfeed =  qtShoutcastFeedData.attr("data-textfeed"),
			qtSCuseproxy =  qtShoutcastFeedData.attr("data-useproxy"),
			qtJazler =  qtShoutcastFeedData.attr("data-jazler"),
			qtFeedPlayerTrack = $('#qtFeedPlayerTrack'),
			qtFeedPlayerAuthor = $('#qtFeedPlayerAuthor'),
			theChannel = qtShoutcastFeedData.attr("data-channel"),
			qtPlayerTrackInfo = $("#qtPlayerTrackInfo"),
			qtRadioId = qtShoutcastFeedData.attr("data-qtradioid"),
			author, title, result, feedsplit;

			var timestamp = new Date().getUTCMilliseconds();

			if(qtSecuresystems ==='' && qtMediacp ==='' && qtWinMedia === '' && qtIcyMetadata ==='' && qtJazler === '' && qttextfeed === '' && qtradionomy === '' && qtlive365 === '' && qtairtime === '' && (qtradiofeedHost === '' || qtradiofeedPort === '' || typeof(qtradiofeedHost)=== 'undefined') && (qticecasturl === '' || typeof(qticecasturl)=== 'undefined') && (qtradiodotco === '' || typeof(qtradiodotco) === 'undefined')) {
				return;
			} else {

				// ====================== ICY METADATA =================================
				if(qtIcyMetadata === '1' || qtIcyMetadata === 1){

					if(!qtPlaytrack || qtPlaytrack === ''){
						return;
					}

					if(qtPlaytrack.indexOf('/proxy/') != -1 && qtPlaytrack.indexOf('https') != -1 && ( qtPlaytrack.indexOf('?mp=/') != -1 || qtPlaytrack.indexOf('/stream') != -1 )){
							qtradiofeedHost = qtPlaytrack.split('?mp=/');
							qtradiofeedHost = qtradiofeedHost[0] + '?mp=/stats';// + '&rand='+timestamp;
							qtradiofeedHost = qtradiofeedHost.split('stream').join('stats');
							// console.log('qtSCuseproxy'+qtSCuseproxy);
							// console.log(qtradiofeedHost);
							var datatosend = {};
							if(qtSCuseproxy){
								qtradiofeedHost =  proxyURL+'?qtproxycall='+window.btoa(qtRadioId+'[-]'+qtradiofeedHost);
								datatosend = {
									'qtdir' : qtRadioId,
									"qtproxycall": window.btoa(qtRadioId+'[-]'+qtradiofeedHost)
								};
							}
							// console.log(qtradiofeedHost);
							

							$.ajax({
								type: 'GET',
								url: qtradiofeedHost,
								async: true,
								cache: false,
								dataType: "xml",
								data: datatosend,
								beforeSend: function (request) {
								    request.withCredentials = false;
								},
								success: function(data) {

									$.fn.qtApplyTitle( $(data).find('SONGTITLE').html() );
								},
								error: function(e){
									$.fn.qtApplyTitle(false);
									console.log(e);
								}
							});
					} else {
						$.ajax({
						   	type: 'GET',
							url: proxyURL,
						    jsonpCallback: 'parseMusic',
							async: true,
							cache: false,
							data: {
								'qtdir' : qtRadioId,
								"qtproxycall": window.btoa(qtRadioId+'[-]'+qtPlaytrack), 
								'icymetadata': '1'
							},
							success: function(data) {
								$.fn.qtApplyTitle( data );
								return;

								$.fn.qtApplyTitle( data );
							},
							error: function(e){
								console.log('Your stream does not provide ICY metadata. Please contact your streaming provider or use another server format.');
								console.log(e);
							}
						});
					}


				// ====================== MediaCP =================================
				// 
				} else if( qtMediacp !== ''){
					$.ajax({
					   type: 'GET',
						cache: false,
						url: qtMediacp,
						async: true,
						jsonp: true,
						success: function(data) {
							$.fn.qtApplyTitle( data.nowplaying );
						},
						error: function(e){
							console.log('MediaCP Feed not working - see error:');
							console.log(e);
						}
					});
					return;

				// ====================== SECURESYSTEMS =================================
				// 
				} else if( qtSecuresystems !== ''){

					$.ajax({
						type: 'GET',
						cache: false,
						url: qtSecuresystems,
						async: true,
						dataType: "xml",
						success: function(data) {
							$.fn.qtApplyTitle( $(data).find('artist').html()+ ' - ' + $(data).find('title').html() );
						},
						error: function(e){
						}
					});


				// ====================== LIVE365 =================================
				} else if( qtlive365 !== ''){
					$.ajax({
						type: 'GET',
						cache: false,
						url: 'https://api.live365.com/station/'+qtlive365,
						async: true,
						success: function(jsondata) {
							$.fn.qtApplyTitle(jsondata['current-track'].artist+' - '+jsondata['current-track'].title);
						},
						error: function(e){
						}
					});

				// ====================== TEXT =================================
				} else if(qttextfeed !== ''){
					var jsondata, title;

					if( qtSCuseproxy !== '1') {
						$.ajax({
							type: 'GET',
							cache: false,
							url: qttextfeed,
							async: true,
							dataType: "html",
							success: function(data) {
								$.fn.qtApplyTitle( data );
							},
							error: function(e){
							}
						});
					} else {
						$.ajax({
							type: 'GET',
							cache: false,
							url: proxyURL,
							async: true,
							data: { 
								'qtdir' : qtRadioId,
								"qtproxycall": window.btoa(qtRadioId+'[-]'+qttextfeed), 
							},
							dataType: "html",
							success: function(data) {
								$.fn.qtApplyTitle( data );
							},
							error: function(e){
							}
						});
					}

				// ====================== RADIONOMY =================================
				} else if(qtradionomy !== '' ) {
					$.ajax({
						type: 'GET',
						url: qtradionomy,
						async: true,
						cache: false,
						dataType: "xml",
						success: function(data) {
							$.fn.qtApplyTitle( $(data).find('artists').html()+ ' - ' + $(data).find('title').html() );
						},
						error: function(e){
						}
					});
				// ====================== AIRTIME =================================
				} else if(qtairtime !== '' && qtairtime !== 'undefined' && qtairtime !== undefined && typeof(qtairtime) !== 'undefined'){
					var jsondata, title;
					$.ajax({
						type: 'GET',
						cache: false,
						url: proxyURL,
						async: true,
						data: {
							"qtproxycall": window.btoa(qtRadioId+'[-]'+qtairtime), 
							'qtdir' : qtRadioId,
						},
						contentType: "application/json",
						success: function(data) {
							jsondata = JSON.parse(data);
							title = jsondata.tracks.current.name;
							$.fn.qtApplyTitle(title);
						},
						error: function(e) {
						}
					});

					
				}
				// ====================== ICECAST =================================
				else if(qticecasturl !== '' && typeof(qticecasturl) !== 'undefined') {

					if( qtSCuseproxy !== '1') {
						$.ajax({
							type: 'GET', 
							url: qticecasturl,
							async: true,						    
							jsonpCallback: "parseMusic",

							/// Open mode
							jsonp: false,

							// Closed mode 
							// IT SEEMS THAT MANY ICECAST PROVIDERS ARE NOT DELIVERING THE CORRECT HTTP HEADERS SO THIS DOESN'T WORK
							// contentType: "application/json",
							// dataType: 'jsonp',
							// jsonp: true,
							
							success : function(json){
								if('object' === typeof( json )){
									var source = json.icestats.source;
									if('undefined' === typeof(source)){ return; }
									if(qticecastmountpoint !== '') {
										result = source[0][qticecastmountpoint]['title'];
										if(source[0][qticecastmountpoint]['artist']){
											result = source[0][qticecastmountpoint]['artist']+' - '+result;
										}
									} else {
										if(source[0]){
											result = source[0]['title'];
											if(source[0]['artist']){
												result = source[0]['artist']+' - '+result;
											}
										} else if( source['title'] ){
											result = source['title'];
											if(source['artist']){
												result = source['artist']+' - '+result;
											}
										}
									}
								} else if('array' === typeof( json )){
									if(qticecastmountpoint !== '') {
										if("undefined" !== typeof( json[qticecastmountpoint]) ){
											result = json[qticecastmountpoint]['title'];
										} else if( "undefined" !== typeof( json['source'][qticecastmountpoint] ) ){
											result = json['source'][qticecastmountpoint]['title'];
										}
									} else if(json['icestats']['source']['title']){
										result = (json['icestats']['source']['title']);

										if(json['icestats']['source']['artist']){
											result = json['icestats']['source']['artist']+' - '+result;
										}
									} else if(json['icestats']['source'][0]['title']){
										result = (json['icestats']['source'][0]['title']);
										if(json['icestats']['source']['artist']){
											result = json['icestats']['source']['artist']+' - '+result;
										}
									}
								}
								$.fn.qtApplyTitle(result);
							},
							error: function(e) {
								console.log("Error: your icecast feed is not available. You can try to enable the Proxy in the WP Customizer, under Radio Settings.");
								console.log(e);
							}
						});

					// ====================== ICECAST V2 =================================
					} else {

						var jsondata, title;

						
						$.ajax({
							type: 'GET',
							cache: false,
							url: proxyURL,
							async: true,
							data: { 
								"qtproxycall": window.btoa(qtRadioId+'[-]'+qticecasturl), 
								'qtdir' : qtRadioId,
							},
							contentType: "application/json",
							success: function(data) {
								console.log(data);
								if('object' !== typeof(data)){
									data = JSON.parse(data);
								}
								jsondata = data;
								if (qticecastchannel) {
									if(jsondata.icestats.source[qticecastchannel].title){
										title = jsondata.icestats.source[qticecastchannel].title;
									} else if(jsondata.icestats.source[qticecastchannel].title) {
										title = jsondata.icestats.source[qticecastchannel].title;
									} else if(jsondata.icestats.source[qticecastchannel].title) {
										title = jsondata.icestats.source[qticecastchannel].title
									}
								} else {
									if(jsondata.icestats.source.title){
										title = jsondata.icestats.source.title;
									} else if(jsondata.icestats.source[1].title) {
										title = jsondata.icestats.source[1].title;
									} else if(jsondata.icestats.source[0].title) {
										title = jsondata.icestats.source[0].title
									}
								}
								$.fn.qtApplyTitle(title);
							},
							error: function(e) {
								console.log(e);
							}
						});

					}


				// ====================== SHOUTCAST =================================
				} else if (qtradiofeedHost !== '' && qtradiofeedPort !== '' && typeof(qtradiofeedHost) !== 'undefined'){

					var protocol = 'http';
					if( qtradiofeedProtocol == 'https'){
						protocol = 'https';
					}


					var qtscurl 		= protocol + '://'+qtradiofeedHost+':'+qtradiofeedPort+'/stats?sid='+theChannel+'&json=1',
						jsondata, title;

					if(qtSCuseproxy === '1'){
						// 2017 12 16 with ssl support
						$.ajax({
							type: 'GET',
							cache: false,
							url: proxyURL,
							async: true,
							data: {
								'urltocheck' : window.btoa(qtradiofeedHost),
								"qtproxycall": window.btoa(qtRadioId+'[-]'+qtscurl), 
								'qtdir' : qtRadioId,
							},
							contentType: "application/json",
							success: function(data) {
								jsondata = JSON.parse(data);
								$.fn.qtApplyTitle(jsondata.songtitle);
							},
							error: function(e) {
								console.log(e);
							}
						});
					} else {
						$.SHOUTcast({
							host : qtradiofeedHost,
							port : qtradiofeedPort,
							protocol: qtradiofeedProtocol,
							interval: 10000,
							stream : theChannel,
							stats_path : 'stats',
							stats : function(){
								if(this.onAir()){
									result = this.get('songtitle');
									$.fn.qtApplyTitle(result);
								}
							}
						}).startStats();
					}
				// ====================== RADIO DOT CO =================================
				} else if (qtradiodotco !== '' && typeof(qtradiodotco) !== 'undefined'){
					var rUrl = 'https://public.radio.co/stations/'+qtradiodotco+'/status'
					$.ajax({
						type: 'GET',
						cache: false,
						url: rUrl,
						async: true,
						contentType: "application/json",
						success: function(data) {
							title = data['current_track']['title'];
							$.fn.qtApplyTitle(title);
						},
						error: function(e) {
							// console.log(e);
						}
					});
				}
				
			}
			
		return;
	}


	/**====================================================================
	 *
	 * 
	 *  Skrollr initialize
	 *  
	 * 
	 ====================================================================*/
	$.fn.qtSkrollrInit = function(){
		// disable skrollr if using handheld device
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			return;
		}
		$.skrollrInstance = skrollr.init({
			smoothScrolling: true,
			forceHeight: false
		});
	}



	/**====================================================================
	 *
	 * 
	 *  Popup opener (requires library component) 
	 *  
	 * 
	 ====================================================================*/
	$.fn.qtPopupwindow = function() {
		if(typeof($.fn.popupwindow) !== "undefined"){
			$.fn.popupwindow();
		}
		$.onAir2Obj.body.on('click', "#qtmainmenucontainer .qt-popupwindow", function(i,c){
			$('.sm2_playing .sm2-360btn').click();
		});
	};

	

	/**====================================================================
	 *
	 * 
	 *  Ajax elements refresh
	 *  
	 * 
	 ====================================================================*/
	$.fn.qtAjaxElementsRefresh = function(){

		var currentpageUrlBox = $("#qtcurrentpermalink");
		if(currentpageUrlBox.length <= 0){
			return;
		}
		var originalContainer, newContent, oldContent;
		var link = window.location.href,//currentpageUrlBox.attr("data-permalink"),
			itemsToRefresh = new Array(".qt-qtonairhero", "#qtupcomingshowscarousel", "#qtshowslidercontainer",  ".qtnowonairwidget", ".qt-upcoming-refresh", ".qt-nowonair-refresh", '.qt-shows-schedule-refresh', '.qt-widget-upcoming');
		$.ajax({
			url: link,
			success:function(data) {
				$.ajaxData = data;
				itemsToRefresh.forEach(function(theselector){
					$(theselector).animate({opacity: 0}, 0, function(){
						$(theselector).html( $($.ajaxData).find(theselector).html() ).animate({opacity: 1}, 0, function(){
							$.fn.dynamicBackgrounds(theselector);
							$.fn.slickGallery();
						});
					});
				});
				if( 'function' === typeof(jQuery.fn.tabs ) ){
					jQuery('.qt-shows-schedule-refresh ul.tabs').tabs();
				}
			}
		});
	}
	setInterval(function() {
		$.fn.qtAjaxElementsRefresh();
	}, 60000);


	/**====================================================================
	 *
	 * 
	 *  Open header bar player
	 *  
	 * 
	 ====================================================================*/
	$.fn.qtOpenPlayerBar = function(){
		$.onAir2Obj.body.on('click', ".qt-openplayerbar", function(e){
			e.preventDefault();
			$.onAir2Obj.body.toggleClass("qt-playerbar-open");
			return true;
		});
	}
	


	/**====================================================================
	 *
	 *	Reinitialize visual composer functions after ajax loading
	 * 
	 ====================================================================*/
	$.fn.initializeVisualComposerAfterAjax = function(){
		if(typeof vc_toggleBehaviour === "function"){
			vc_toggleBehaviour();
		}
		if(typeof vc_tabsBehaviour === "function"){
			vc_tabsBehaviour();
		}
		if(typeof vc_accordionBehaviour === "function"){
			vc_accordionBehaviour();
		}
		if(typeof vc_teaserGrid === "function"){
			vc_teaserGrid();
		}
		if(typeof vc_carouselBehaviour === "function"){
			vc_carouselBehaviour();
		}
		if(typeof vc_slidersBehaviour === "function"){
			vc_slidersBehaviour();
		}
		if(typeof vc_prettyPhoto === "function"){
			vc_prettyPhoto();
		}
		if(typeof vc_googleplus === "function"){
			vc_googleplus();
		}
		if(typeof vc_pinterest === "function"){
			vc_pinterest();
		}
		if(typeof vc_initVideoBackgrounds === "function"){
			vc_initVideoBackgrounds();
		}

		
		// Reinitialize Page Builder animation
		window.setTimeout(function() {
			
			
			jQuery(".wpb_animate_when_almost_visible:not(.wpb_start_animation)").each(function() {
				var $el = jQuery(this);
				$el.vcwaypoint(function() {
					$el.addClass("wpb_start_animation animated");
				}, {
					offset: "85%"
				})
			});

		}, 250); // set timeout in ms

		


		$("body [data-bgimagevc]").each(function() {
			var that = $(this),
				bg = that.attr("data-bgimagevc"),
				bgattachment = that.attr("data-bgattachment");
			if (bgattachment === undefined) {
				bgattachment = "static";
			}
			if (bg !== '') {
				that.css({
					"background-image": "url(" + bg + ")",
					"background-attachment": "fixed"
				});
			}
		});

	}




	/**====================================================================
	 *
	 *	Onlu After ajax page initialization
	 * 	Used by QT Ajax Pageloader. 
	 * 	MUST RETURN TRUE IF ALL OK.
	 * 
	 ====================================================================*/
	$.fn.initializeOnlyAfterAjax = function(){
		var autoselect = $('.qt-autoselect-channel');
		if(autoselect.length > 0){
			autoselect.click();
		}
	}

	

	/**====================================================================
	 *
	 *	After ajax page initialization
	 * 	Used by QT Ajax Pageloader. 
	 * 	MUST RETURN TRUE IF ALL OK.
	 * 
	 ====================================================================*/
	$.fn.initializeAfterAjax = function(){

		$.fn.slickGallery();
		$.fn.qtQtSwitch();
		$.fn.dynamicBackgrounds();
		$(".qt-pageheader").attr("data-start", "@class: qt-pageheader qt-js qt-negative").attr("data-10-start", "@class: qt-pageheader qt-js qt-negative qt-pageheader-scrolled").promise().done(function(){
			$.fn.qtSkrollrInit();
		});
		if( "undefined" !== typeof($.skrollrInstance)) {
			$.skrollrInstance.refresh();
		}
		
		$.fn.qtSharelink();
		$.fn.qtMasonry();
		$.fn.qtCountdown();
		$.fn.qtFitvids();
		$.fn.qtPushpin();
		$.fn.transformlinks("#maincontent");
		$.fn.NewYoutubeResize();

		// $(".not-collapse").on("click", function(e) { e.stopPropagation();  });
		if( "undefined" !== typeof($.fn.qtChartvoteInit)) {
			$.fn.qtChartvoteInit();
		}
		$('.qt-collapsible').collapsible();

		if( 'function' === typeof(jQuery.fn.tabs ) ){
			jQuery('ul.tabs').tabs(); // todisable
		}

		if(false === $.fn.qtIsMobileBrowser() && $(window).width() > 1279 ) {
			$('.qt-tooltipped').tooltip({delay: 50});
		}
		
		if(typeof jQuery.vdl_Init === "function"){
			jQuery.vdl_Init();
		}


		if(typeof $.qtSwipeboxFunction === "function"){
			$.qtSwipeboxFunction();
		}


		if(typeof $.fn.qtDynamicMaps === "function"){
			$.fn.qtDynamicMaps();
		}
		if(typeof $.fn.qtPlacesInit === "function"){
			$.fn.qtPlacesInit();
		}
		$( "#qwShowDropdown" ).on("change", function() {
			$(this).closest('.qt-show-schedule').find("#"+this.value).click();
		});

		$.fn.qtPopupwindow();
		if(!$('body').hasClass('qt-html5audio-disable')){
			if( 'function' === typeof(jQuery.fn.mediaelementplayer ) ){
				jQuery('video').mediaelementplayer();
				jQuery('audio').mediaelementplayer();
			}
		}

		return true;
	}
	
	/**====================================================================
	 *
	 *	Page Ready Trigger
	 * 	This needs to call only $.fn.qtInitTheme
	 * 
	 ====================================================================*/
	jQuery(document).ready(function() {

		$.fn.qtPageloadInit();
		$.fn.qtMobileNav();
		$.fn.qt360player();
		$.fn.qtShoutcastFeedNew();
		$.fn.qtOpenPlayerBar ();
		qtShoutcastInterval = setInterval( function() { $.fn.qtShoutcastFeedNew(); } , 15000);
		$.fn.initializeAfterAjax();
		$.fn.qtRadioAutoplay();  
		
	});

})(jQuery);
