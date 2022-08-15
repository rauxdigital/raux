/**====================================================================
 *
 *  QT Ajax Page Loader main script
 *  @author QantumThemes
 *  
 ====================================================================**/
(function($) {
	"use strict";
	$("body").append('<div id="qtajaxpreloadericon"><i class="dripicons-loading" ></i></div>');
	var qtAplSelector ="#maincontent",
		qtAplMaincontent = $(qtAplSelector),
		atAplPreloader = $("#qtajaxpreloadericon");
	
	/**
	 * [Before switching content let's scroll to top]
	 * @return {[bol]}
	 */
	$.fn.qtAplScrollTop = function(){
		$('html, body').animate({
			scrollTop: 0
		},100, 'easeOutExpo');
		return true;
	};
	

	// WPML exclusion
	$('.wpml-ls-item').on("click",'a', function(e) {
		window.location.replace( $(this).attr('href') );
		return e;
	});



	/**
	 * [Main ajax initialization function]
	 */
	$.fn.qtAplInitAjaxPageLoad = function(){
		$("body").off("click",'a');

		/**
		 * [Bind click function to all the links]
		 */
		$("body").on("click",'a', function(e) {
			var that = $(this),
				href = $(this).attr('href');

			if(href === undefined){
				return e;
			}
			if(href === ""){
				return e;
			}


			// Since 2019 04 18 + support internal links
			var pageURL = $(location).attr("href"),
				pageURL_array = pageURL.split('#'),
				pageURL_naked = pageURL_array[0],
				href_array = href.split('#'),
				href_naked = href_array[0];
			if(href_naked === pageURL_naked) {
				return e;
			}


			/**
			 * [exceptions that will skip ajax loading]
			 */

			var qtAjaxpatt = /(\/respond|\/wp-admin|mailto:|\/checkout|\.zip|\.jpg|\.gif|\.mp3|\.pdf|\.png|\.rar|\/product|\/shop|\/cart|#noajax|download_file)/;
			if ( that.hasClass("ajax_add_to_cart") || that.parent().hasClass("noajax") || ( !href.match(document.domain) )  || that.attr("target") === '_blank' || that.hasClass("noajax") || that.attr("type") === 'submit' || that.attr("type") === 'button' || href.match(qtAjaxpatt) ) {
				return e;
			} 
			if(href.match(document.domain) ){
				e.preventDefault();
				try {
					if (window.history.pushState) {
						var pageurl = href;
						if (pageurl !== window.location) {
							window.history.pushState({
							path: pageurl,
							state:'new'
							}, '', pageurl);
						}
					}
				} catch (e) {
					console.log (e);
				}
				
				/**
				 * Close the sidebar and player
				 */
				$('.button-collapse').sideNav('hide');
				$('.button-playlistswitch').sideNav('hide');
				$("li.current_page_item").removeClass("current_page_item");
				that.closest("li").addClass("current_page_item");
				atAplPreloader.addClass("qt-visible");

				qtAplMaincontent.fadeTo( "fast" ,0, function() {
					 $.fn.qtAplScrollTop();
				}).promise().done(function(){
					qtAplExecuteAjaxLink(href);
				});
			}
		});

		/**
		 * [ajax call]
		 * @param  {[text]} link [url to load]
		 * @return {[bol]}
		 */
		function qtAplExecuteAjaxLink(link){
			var docClass, parser;
			$.ajax({
				url: link,
				success:function(data) {
					/*
					*   Retrive the contents
					*/
					

				
					$.ajaxData = data;
					parser = new DOMParser();
					$.qtAplAjaxContents = $($.ajaxData).filter(qtAplSelector).html();
					$.qtAplAjaxTitle = $($.ajaxData).filter("title").text();
					docClass = $($.ajaxData).filter("body").attr("class");

					$.qtAplBodyMatches = data.match(/<body.*class=["']([^"']*)["'].*>/);

					
					if(typeof($.qtAplBodyMatches) !== 'undefined'){
					   	docClass = $.qtAplBodyMatches[1];
					}else{
						window.location.replace(link);
					}


					// New method better working: 
					var modifiedAjaxResult = data.replace(/<body/i,'<div id="re_body"').replace(/<\/body/i,'</div'),
						bodyClassesNew = $(modifiedAjaxResult).filter("#re_body").attr("class"),
						//20190527
						//Custom css change id
						js_composer_front_css= $(modifiedAjaxResult).filter('#js_composer_front-inline-css').text();

					if(bodyClassesNew){
						docClass = bodyClassesNew;
					}

					// since 2.2 checkbox skip
					if(  bodyClassesNew.indexOf("qtapl-skip") >= 0 ){
						return window.location.replace(link);
					}

					$.wpadminbar = $($.ajaxData).filter("#wpadminbar").html(); 
					$.visual_composer_styles = $($.ajaxData).filter('style[data-type=vc_shortcodes-custom-css]').text();					
					/**
					 * [if we have WPML plugin language selector]
					 */
					if($("#qwLLT")){
						$.langswitcher = $($.ajaxData).find("#qwLLT").html(); 
					}

					/*
					*   Start putting the data in the page
					*/
					if(docClass !== undefined && $.qtAplAjaxContents !== undefined){
						$.fn.closeModal();
						

						

						$("body").attr("class",docClass);
						$("title").text($.qtAplAjaxTitle);
						$("#wpadminbar").html($.wpadminbar);
						$("#qwLLT").html($.langswitcher);

						if($("style[data-type=vc_shortcodes-custom-css]").length > 0){
							$("style[data-type=vc_shortcodes-custom-css]").append($.visual_composer_styles);
						} else {
							$("head").append('<style type="text/css"  data-type="vc_shortcodes-custom-css">'+$.visual_composer_styles+'</style>');
						}

						// 2019 may 27 js composer update css
						if( js_composer_front_css != '' && js_composer_front_css != false && js_composer_front_css != undefined ){
							if($("style#js_composer_front-inline-css").length > 0){
								$("style#js_composer_front-inline-css").html(js_composer_front_css);
							} else {
								$("head").append('<style id="js_composer_front-inline-css">'+js_composer_front_css+'</style>');
							}
						} else {
							$("head style#js_composer_front-inline-css").remove();
						}

						
						qtAplMaincontent.html( $.qtAplAjaxContents ).delay(100).promise().done(function(){
							var scripts = qtAplMaincontent.find("script");
							if(scripts.length > 0){
								scripts.each(function(){
									if($(this).hasClass('wp-playlist-script')){
										// Do not eval this
									} else {
										var code = $(this).html();
										code = '('+code+')'; // not really needed
										try{
											eval($(this).html());
										} catch(e){
											console.log(e);
										}
									}
								});	
							}


							if(true === $.fn.initializeAfterAjax()){
								$.fn.initializeVisualComposerAfterAjax();
								$.fn.initializeOnlyAfterAjax();
								atAplPreloader.removeClass("qt-visible");
								qtAplMaincontent.fadeTo( "fast" ,1).promise().done(function(){
									// After reloading we scroll till the place of the anchor
									// Since 2019 04 18 + support internal links
									var link_array = link.split('#'),
										internal_link = false;
									if( link_array.length > 1){
										var targetDiv = $('#'+link_array[1] );
										if( targetDiv.length > 0 ){
											var point = targetDiv.offset().top;
											$('html, body').animate(
											    {
											      scrollTop: point,
											    },
											    1500,
											    'swing'
											  );
											 return;
										}
									}
								});


								
								/**
								 * @since  2.5 reload playlist
								 */
								
								$( '.wp-playlist' ).each( function() {
									new WPPlaylistView( { el: this } );
								} );

								/**
								 * @since  2.4
								 * Execute custom javascript
								 */
								$.getScript(  $('#qt-ajax-customscript-url').data('customscripturl') )
								  .done(function( script, textStatus ) {
								    
								  })
								  .fail(function( jqxhr, settings, exception ) {
								});

							}else{
								window.location.replace(link);
							}
						});   

					}else{
						window.location.replace(link);
					}
				},
				error: function () {
					//Go to the link normally
					window.location.replace(link);
				}
			});
			return true;
		}
		/**
		 * Manage browser back and forward arrows
		 */
		$(window).on("popstate", function(e) {
			var href;
			if (e.originalEvent.state !== null) {
				href = location.href;
				if(href !== undefined){
					if (!href.match(document.domain))    {
						window.location.replace(href);
					} else {
						qtAplMaincontent.fadeTo( "fast" ,0, function() {
							$.fn.qtAplScrollTop();
						}).promise().done(function(){
							qtAplExecuteAjaxLink(href);
						});
					}
				}
			} else {
				href = location.href;
				if(href !== undefined){

					if (!href.match(document.domain))    {
						window.location.replace(href);

					} else {

						// Since 2019 04 18 + support internal links
						var pageURL = $(location).attr("href"),
							pageURL_array = pageURL.split('#'),
							pageURL_naked = pageURL_array[0],
							href_array = href.split('#'),
							href_naked = href_array[0];
						if(href_naked === pageURL_naked) {
							if( undefined !== href_array[1]){
								var targetDiv = $('#'+href_array[1] );
								if( targetDiv.length > 0 ){
									var point = targetDiv.offset().top;
									e.preventDefault();
									$('html, body').animate(
									    {
									      scrollTop: point,
									    },
									    1500,
									    'swing'
									  );
									 return false;			

									// return e;
								} else {
									return e;
								}
							}
						}
						qtAplMaincontent.fadeTo( "fast" ,0, function() {
							$.fn.qtAplScrollTop();
						}).promise().done(function(){
							qtAplExecuteAjaxLink(href);
						});
					}
								
				}
			}
		});
	}; // $.fn.qtAplInitAjaxPageLoad

	/**====================================================================
	 *
	 *	Page Ready Trigger
	 * 	This needs to call only $.fn.qtInitTheme
	 * 
	 ====================================================================*/
	jQuery(document).ready(function() {
		$.fn.qtAplInitAjaxPageLoad();		
	});

})(jQuery);
