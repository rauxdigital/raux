(function ($) {
    "use strict";

    function fmwave_cursor_scripts_load() {
        var $ = jQuery;

        /*-------------------------------------
           Custom Cursor
        -------------------------------------*/
        function handleCustomCursor() {
            if ( $('body').hasClass( 'custom-cursor' ) ) {
                const cursorInnerEl = document.querySelector('.circle-cursor--inner');
                const cursorOuterEl = document.querySelector('.circle-cursor--outer');
                let lastY, lastX = 0;
                let magneticFlag = false;

                // move
                window.onmousemove = function (event) {
                    if (!magneticFlag) {
                        cursorOuterEl.style.transform = 'translate('+ event.clientX + 'px, ' + event.clientY + 'px' +')';
                    }
                    cursorInnerEl.style.transform = 'translate('+ event.clientX + 'px, ' + event.clientY + 'px' +')';
                    lastY = event.clientY;
                    lastX = event.clientX;
                }

                // links hover
                $('body').on('mouseenter', 'a, button', function() {
                    cursorInnerEl.classList.add('cursor-link-hover');
                    cursorOuterEl.classList.add('cursor-link-hover');
                });
                $('body').on('mouseleave', 'a, button', function() {
                    if ( $(this).is('a') && $(this).closest('button').length ) {
                        return;
                    }
                    cursorInnerEl.classList.remove('cursor-link-hover');
                    cursorOuterEl.classList.remove('cursor-link-hover');
                });

                cursorInnerEl.style.visibility = 'visible';
                cursorOuterEl.style.visibility = 'visible';
            }
        }


        /*-------------------------------------
            Custom cursor Init
        -------------------------------------*/
        handleCustomCursor();
    }

    // Window Load+Resize
    $(window).on('load resize', function (){
        // Elementor Frontend Load
        $(window).on('elementor/frontend/init', function () {
            if (elementorFrontend.isEditMode()) {
                elementorFrontend.hooks.addAction('frontend/element_ready/widget', function () {
                    fmwave_cursor_scripts_load();
                });
            }
        });
    });

    // Window Load
    $(window).on('load', function (){
        fmwave_cursor_scripts_load();
    });

})(jQuery);