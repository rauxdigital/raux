/**====================================================================
 *
 *  QT Ajax Page Loader main script
 *  @author QantumThemes
 *  
 ====================================================================**/
!function($){"use strict";$("body").append('<div id="qtajaxpreloadericon"><i class="dripicons-loading" ></i></div>');var qtAplSelector="#maincontent",qtAplMaincontent=$(qtAplSelector),atAplPreloader=$("#qtajaxpreloadericon");
/**
	 * [Before switching content let's scroll to top]
	 * @return {[bol]}
	 */$.fn.qtAplScrollTop=function(){return $("html, body").animate({scrollTop:0},100,"easeOutExpo"),!0},
// WPML exclusion
$(".wpml-ls-item").on("click","a",function(t){return window.location.replace($(this).attr("href")),t}),
/**
	 * [Main ajax initialization function]
	 */
$.fn.qtAplInitAjaxPageLoad=function(){
/**
		 * [ajax call]
		 * @param  {[text]} link [url to load]
		 * @return {[bol]}
		 */
function qtAplExecuteAjaxLink(link){var docClass,parser;return $.ajax({url:link,success:function(data){
/*
					*   Retrive the contents
					*/
$.ajaxData=data,parser=new DOMParser,$.qtAplAjaxContents=$($.ajaxData).filter(qtAplSelector).html(),$.qtAplAjaxTitle=$($.ajaxData).filter("title").text(),docClass=$($.ajaxData).filter("body").attr("class"),$.qtAplBodyMatches=data.match(/<body.*class=["']([^"']*)["'].*>/),void 0!==$.qtAplBodyMatches?docClass=$.qtAplBodyMatches[1]:window.location.replace(link);
// New method better working: 
var modifiedAjaxResult=data.replace(/<body/i,'<div id="re_body"').replace(/<\/body/i,"</div"),bodyClassesNew=$(modifiedAjaxResult).filter("#re_body").attr("class"),
//20190527
//Custom css change id
js_composer_front_css=$(modifiedAjaxResult).filter("#js_composer_front-inline-css").text();
// since 2.2 checkbox skip
if(bodyClassesNew&&(docClass=bodyClassesNew),0<=bodyClassesNew.indexOf("qtapl-skip"))return window.location.replace(link);$.wpadminbar=$($.ajaxData).filter("#wpadminbar").html(),$.visual_composer_styles=$($.ajaxData).filter("style[data-type=vc_shortcodes-custom-css]").text(),
/**
					 * [if we have WPML plugin language selector]
					 */
$("#qwLLT")&&($.langswitcher=$($.ajaxData).find("#qwLLT").html())
/*
					*   Start putting the data in the page
					*/,void 0!==docClass&&void 0!==$.qtAplAjaxContents?($.fn.closeModal(),$("body").attr("class",docClass),$("title").text($.qtAplAjaxTitle),$("#wpadminbar").html($.wpadminbar),$("#qwLLT").html($.langswitcher),0<$("style[data-type=vc_shortcodes-custom-css]").length?$("style[data-type=vc_shortcodes-custom-css]").append($.visual_composer_styles):$("head").append('<style type="text/css"  data-type="vc_shortcodes-custom-css">'+$.visual_composer_styles+"</style>"),
// 2019 may 27 js composer update css
""!=js_composer_front_css&&0!=js_composer_front_css&&null!=js_composer_front_css?0<$("style#js_composer_front-inline-css").length?$("style#js_composer_front-inline-css").html(js_composer_front_css):$("head").append('<style id="js_composer_front-inline-css">'+js_composer_front_css+"</style>"):$("head style#js_composer_front-inline-css").remove(),qtAplMaincontent.html($.qtAplAjaxContents).delay(100).promise().done(function(){var scripts=qtAplMaincontent.find("script");0<scripts.length&&scripts.each(function(){if($(this).hasClass("wp-playlist-script"));else{var code=$(this).html();code="("+code+")";// not really needed
try{eval($(this).html())}catch(t){console.log(t)}}}),!0===$.fn.initializeAfterAjax()?($.fn.initializeVisualComposerAfterAjax(),$.fn.initializeOnlyAfterAjax(),atAplPreloader.removeClass("qt-visible"),qtAplMaincontent.fadeTo("fast",1).promise().done(function(){
// After reloading we scroll till the place of the anchor
// Since 2019 04 18 + support internal links
var t=link.split("#"),a=!1;if(1<t.length){var e=$("#"+t[1]);if(0<e.length){var o=e.offset().top;return void $("html, body").animate({scrollTop:o},1500,"swing")}}}),
/**
								 * @since  2.5 reload playlist
								 */
// $( '.wp-playlist' ).each( function() {
// 	new WPPlaylistView( { el: this } );
// } );
/**
								 * @since  2.4
								 * Execute custom javascript
								 */
$.getScript($("#qt-ajax-customscript-url").data("customscripturl")).done(function(t,a){}).fail(function(t,a,e){})):window.location.replace(link)})):window.location.replace(link)},error:function(){
//Go to the link normally
window.location.replace(link)}}),!0}
/**
		 * Manage browser back and forward arrows
		 */$("body").off("click","a"),
/**
		 * [Bind click function to all the links]
		 */
$("body").on("click","a",function(t){var a=$(this),e=$(this).attr("href");if(void 0===e)return t;if(""===e)return t;
// Since 2019 04 18 + support internal links
var o,s,n=$(location).attr("href").split("#")[0],i,l;if(e.split("#")[0]===n)return t;
/**
			 * [exceptions that will skip ajax loading]
			 */var r=/(\/respond|\/wp-admin|mailto:|\/checkout|\.zip|\.jpg|\.gif|\.mp3|\.pdf|\.png|\.rar|\/product|\/shop|\/cart|#noajax|download_file)/;if(a.hasClass("ajax_add_to_cart")||a.parent().hasClass("noajax")||!e.match(document.domain)||"_blank"===a.attr("target")||a.hasClass("noajax")||"submit"===a.attr("type")||"button"===a.attr("type")||e.match(r))return t;if(e.match(document.domain)){t.preventDefault();try{if(window.history.pushState){var c=e;c!==window.location&&window.history.pushState({path:c,state:"new"},"",c)}}catch(t){console.log(t)}
/**
				 * Close the sidebar and player
				 */$(".button-collapse").sideNav("hide"),$(".button-playlistswitch").sideNav("hide"),$("li.current_page_item").removeClass("current_page_item"),a.closest("li").addClass("current_page_item"),atAplPreloader.addClass("qt-visible"),qtAplMaincontent.fadeTo("fast",0,function(){$.fn.qtAplScrollTop()}).promise().done(function(){qtAplExecuteAjaxLink(e)})}}),$(window).on("popstate",function(t){var a;if(null!==t.originalEvent.state)void 0!==(a=location.href)&&(a.match(document.domain)?qtAplMaincontent.fadeTo("fast",0,function(){$.fn.qtAplScrollTop()}).promise().done(function(){qtAplExecuteAjaxLink(a)}):window.location.replace(a));else if(void 0!==(a=location.href))if(a.match(document.domain)){
// Since 2019 04 18 + support internal links
var e,o,s=$(location).attr("href").split("#")[0],n=a.split("#"),i;if(n[0]===s&&void 0!==n[1]){var l=$("#"+n[1]);if(0<l.length){var r=l.offset().top;return t.preventDefault(),$("html, body").animate({scrollTop:r},1500,"swing"),!1;
// return e;
}return t}qtAplMaincontent.fadeTo("fast",0,function(){$.fn.qtAplScrollTop()}).promise().done(function(){qtAplExecuteAjaxLink(a)})}else window.location.replace(a)})},// $.fn.qtAplInitAjaxPageLoad
/**====================================================================
	 *
	 *	Page Ready Trigger
	 * 	This needs to call only $.fn.qtInitTheme
	 * 
	 ====================================================================*/
jQuery(document).ready(function(){$.fn.qtAplInitAjaxPageLoad()})}(jQuery);