( function( $ ) {
	
	/**
	 * ==========================================
	 * ==========================================
	 * 
	 * IMPORTANT!!
	 * -----------------------------------------
	 * Ignore jshint because this script is an 
	 * extension of Elementor
	 * 
	 * ==========================================
	 * ==========================================
	 */
	
	 
	/* jshint ignore:start */
	var WidgetElementorRadioPlayer = function( $scope, $ ) {
		if(!$('body').hasClass('elementor-editor-active')){
			return;
		} else {
			try {
				$.elementorRadioPlayerInit();
			} catch(e) {
				console.log(e);
			}
		}
	};
	$( window ).on( 'elementor/frontend/init', function() {
		
		elementorFrontend.hooks.addAction( 'frontend/element_ready/elementor-radio-player.default', WidgetElementorRadioPlayer );
		
	} );
	/* jshint ignore:end */
} )( jQuery );