(function ($) {
    "use strict";

    //function Load
    function fmwave_scripts_load() {

        // audio view count
        $( document ).ready(function() {

             $('.item-action button').on('click', function() {
                 let post_id = $(this).closest( ".item-action").data('post-id');
                 let $this = $(this);
                 $this.closest('.audio-container').toggleClass('icon-play');
                 $('.mejs-pause').closest('.audio-container.icon-play').removeClass('icon-play');
            
                $.ajax({
                    type: "post",
                    dataType: "json",
                    url: ThemeObj.ajaxurl,
                    data: {
                        action: 'audio_view_count',
                        post_id: post_id,
                    },
                    success: function(data){
                        if( data.success ) {
                            let total_view = data.data;
                            if ( total_view >= 10 ) {
                                $this.closest( ".audio-container").find('i.fas').addClass('fa-caret-up');
                            } else {
                                $this.closest( ".audio-container").find('i.fas').addClass('fa-caret-down');
                            }
                        }
                    }
                });
            });
			
        });

        /*------------------------------
        Music Player - js
        ------------------------------ */
        $('.fmwave-audio-track').each(function () {
            new MediaElementPlayer($(this).get(0), {
                    startVolume: 0.8,
                    features: ['playpause', 'progress'],
                    autoRewind: true,
                    autoplay: true,
                    audioWidth: 250,
                    audioHeight: 40,
                    controls: false,
                    loop: true,
                }
            )
        });

        $('.fmwave-audio-full-track').each(function () {
            new MediaElementPlayer($(this).get(0), {
                    startVolume: 0.8,
                }
            )
        });

        $('.fmwave-audio-plybtn').each(function () {
            new MediaElementPlayer($(this).get(0), {
                    startVolume: 0.8,
                    features: ['playpause'],
                    audioWidth: 50,
                    audioHeight: 40,
                }
            )
        });

        $('.mejs-button > button').each(function () {
            // console.log('ffff');
            $(this).on('click', function() {
                // let test = $(this).closest('.mejs-container');
                // console.log(test);
                console.log(355345);
            });
        });

        /*-------------------------------------
        Offcanvas Menu activation code
        -------------------------------------*/
        $('#wrapper').on('click', '.offcanvas-menu-btn', function (e) {
            e.preventDefault();
            var $this = $(this),
                wrapper = $(this).parents('body').find('>#wrapper'),
                wrapMask = $('<div />').addClass('offcanvas-mask'),
                offCancas = $('#offcanvas-wrap'),
                position = offCancas.data('position') || 'top';

            if ($this.hasClass('menu-status-open')) {
                wrapper.addClass('open').append(wrapMask);
                $this.removeClass('menu-status-open').addClass('menu-status-close');
                offCancas.css({
                    'visibility': 'visible',
                    'opacity': '1',
                    'top': '50%',
                    'height': '100%'
                });
            } else {
                removeOffcanvas();
            }

            function removeOffcanvas() {
                wrapper.removeClass('open').find('> .offcanvas-mask').remove();
                $this.removeClass('menu-status-close').addClass('menu-status-open');
                if (position === 'top') {
                    offCancas.css({
                        'visibility': 'hidden',
                        'opacity': '0',
                        'top': '0',
                        'height': '0'

                    });
                } else {
                    offCancas.css({
                        'visibility': 'hidden',
                        'opacity': '0',
                        'top': '0',
                        'height': '0'
                    });
                }
            }

            $(".offcanvas-mask, .offcanvas-close").on('click', function () {
                removeOffcanvas();
            });

            return false;
        });
		
        /*Slider Script*/
        if ($.fn.nivoSlider) {
			$('#ensign-nivoslider-3').nivoSlider({

				effect: 'fold', // Specify sets like: 'sliceDownLeft sliceUp sliceUpLeft sliceUpDown sliceUpDownLeft fold fade random slideInRight slideInLeft boxRandom boxRain boxRainReverse boxRainGrow boxRainGrowReverse'
				slices: 15, // For slice animations
				boxCols: 8, // For box animations
				boxRows: 4, // For box animations
				animSpeed: 1000, // Slide transition speed
				pauseTime: 9000, // How long each slide will show
				startSlide: 0, // Set starting Slide (0 index)
				directionNav: true, // Next & Prev navigation
				controlNav: false, // 1,2,3... navigation
				controlNavThumbs: false, // Use thumbnails for Control Nav
				pauseOnHover: false, // Stop animation while hovering
				manualAdvance: true, // Force manual transitions
				prevText: 'Prev', // Prev directionNav text
				nextText: 'Next', // Next directionNav text
				randomStart: false, // Start on a random slide
				beforeChange: function () {
				}, // Triggers before a slide transition
				afterChange: function () {
				}, // Triggers after a slide transition
				slideshowEnd: function () {
				}, // Triggers after all slides have been shown
				lastSlide: function () {
				}, // Triggers when last slide is shown
				afterLoad: function () {
				} // Triggers when slider has loaded

			});

			if ($('.zoom-gallery').length) {
				$('.zoom-gallery').each(function() {
					$(this).magnificPopup({
						delegate: 'a.popup-zooms',
						type: 'image',
						gallery: {
							enabled: true
						}
					});
				});
			}
		}

        $('.offcanvas-menu, .menu-list').on('click', '.menu-item>a', function (e) {
            if ($(this).parents('body').hasClass('has-offcanvas')) {
                var animationSpeed = 500,
                    subMenuSelector = '.sub-menu',
                    $this = $(this),
                    checkElement = $this.next();
                if (checkElement.is(subMenuSelector) && checkElement.is(':visible')) {
                    checkElement.slideUp(animationSpeed, function () {
                        checkElement.removeClass('menu-open');
                    });
                    checkElement.parent(".menu-item").removeClass("active");
                } else if ((checkElement.is(subMenuSelector)) && (!checkElement.is(':visible'))) {
                    var parent = $this.parents('ul').first();
                    var ul = parent.find('ul:visible').slideUp(animationSpeed);
                    ul.removeClass('menu-open');
                    var parent_li = $this.parent("li");
                    checkElement.slideDown(animationSpeed, function () {
                        checkElement.addClass('menu-open');
                        parent.find('.menu-item.active').removeClass('active');
                        parent_li.addClass('active');
                    });
                }
                if (checkElement.is(subMenuSelector)) {
                    e.preventDefault();
                }
            } else {
                if ($(this).attr('href') === "#") {
                    e.preventDefault();
                }
            }
        });


        /*-------------------------------------
        Section background image
        -------------------------------------*/
        $("[data-bg-image]").each(function () {
            var img = $(this).data("bg-image");
            $(this).css({
                backgroundImage: "url(" + img + ")"
            });
        });

        /*-------------------------------------
        Countdown activation code
        -------------------------------------*/
		$('.countdown').each(function () {
            var date = $(this).data('date');
            $(this).countdown(date, function (event) {
                var $this = $(this).html(event.strftime("<div class='countdown-section'><div class='countdown-number'>%D</div> <div class='countdown-unit'>Day%!D</div> </div><div class='countdown-section'><div class='countdown-number'>%H</div> <div class='countdown-unit'>Hour%!H</div> </div><div class='countdown-section'><div class='countdown-number'>%M</div> <div class='countdown-unit'>Minutes</div> </div><div class='countdown-section'><div class='countdown-number'>%S</div> <div class='countdown-unit'>Second</div> </div>"));
            });
        });
		
		if ($.fn.slick) {
			$('.logo-slick-carousel').each(function () {
				let $carousel = $(this);
				$carousel.imagesLoaded(function () {
					var data = $carousel.data('slick'),
						slidesToShow = data.slidesToShow,
						slidesToShowTab = data.slidesToShowTab,
						slidesToShowMobile = data.slidesToShowMobile,
						slidesToShowMobiles = data.slidesToShowMobiles;
					$carousel.not('.slick-initialized').slick({
						slidesToShow: slidesToShow,
						slidesToScroll: 1,
						speed: 1000,
						infinite: true,
						centerMode: false,
						centerPadding: '0px',
						pauseOnHover: true,
						cssEase: 'ease-in-out',
						responsive: [{
								breakpoint: 1024,
								settings: {
									slidesToShow: slidesToShowTab,
									slidesToScroll: 1
								}
							},
							{
								breakpoint: 768,
								settings: {
									slidesToShow: slidesToShowMobile,
									slidesToScroll: 1
								}
							},
							{
								breakpoint: 576,
								settings: {
									slidesToShow: slidesToShowMobiles,
									slidesToScroll: 1
								}
							}
						]
					});
				});
			});
		}
        /*-------------------------------------
            Mouse Scroll Slider
        -------------------------------------*/
        if ($.fn.slick) {
            const slider = $(".swiper-slide");
            slider.not('.slick-initialized').slick({
                dots: false,
                arrows: false
            });
            slider.on('wheel', (function (e) {
                e.preventDefault();
                if (e.originalEvent.deltaY < 0) {
                    $(this).slick('slickNext');
                } else {
                    $(this).slick('slickPrev');
                }
            }));
        }

        sal({ threshold: 1, once: true });

        /*--------------------------------------
        Isotope initialization
        --------------------------------------*/
        function galleryStyleLoading() {

            var $container = $(document).find(".isotope-wrap");

            if ($container.length > 0) {
                $(".isotope-wrap").each(function () {
                    var $container = $(this);
                    var isoContainer = $(".featuredContainer", $container);
                    isoContainer.imagesLoaded(function () {

                        var $isotope = isoContainer.isotope({
                            filter: $container.find(".isotope-classes-tab a.current").attr("data-filter") || '*',
                            transitionDuration: "1s",
                            hiddenStyle: {
                                opacity: 0,
                                transform: "scale(0.001)"
                            },
                            visibleStyle: {
                                transform: "scale(1)",
                                opacity: 1
                            }
                        });

                        $container.find(".isotope-classes-tab").on("click", "a", function () {
                            var $this = $(this);
                            $this
                                .parent(".isotope-classes-tab")
                                .find("a")
                                .removeClass("current");
                            $this.addClass("current");
                            var selector = $this.attr("data-filter");

                            $isotope.isotope({
                                filter: selector
                            });
                            return false;
                        });
                    });
                });
            }

            /*-------------------------------------
                Masonry
            -------------------------------------*/
            var galleryIsoContainer = $("#no-equal-gallery");
            if (galleryIsoContainer.length) {
                var imageGallerIso = galleryIsoContainer.imagesLoaded(function () {
                    imageGallerIso.isotope({
                        itemSelector: ".no-equal-item",
                        masonry: {
                            columnWidth: ".no-equal-item",
                            horizontalOrder: true
                        }
                    });
                });
            }
            /*-------------------------------------
                YouTube Popup
            -------------------------------------*/
            var yPopup = $(".popup-youtube");
            if (yPopup.length) {
                yPopup.magnificPopup({
                    disableOn: 320,
                    type: 'iframe',
                    mainClass: 'mfp-fade',
                    removalDelay: 160,
                    preloader: false,
                    fixedContentPos: false,
                    iframe: {
                        patterns: {
                            dailymotion: {
                                index: 'dailymotion.com',
                                id: function (url) {
                                    var m = url.match(/^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/);
                                    if (m !== null) {
                                        if (m[4] !== undefined) {

                                            return m[4];
                                        }
                                        return m[2];
                                    }
                                    return null;
                                },

                                src: 'https://www.dailymotion.com/embed/video/%id%'
                            }
                        }
                    }
                });
            }

        }
		
		/* Owl Custom Nav */
		if (typeof $.fn.owlCarousel == 'function') {
			$(".owl-custom-nav .owl-next").on('click', function () {
				$(this).closest('.owl-wrap').find('.owl-carousel').trigger('next.owl.carousel');
			});
			$(".owl-custom-nav .owl-prev").on('click', function () {
				$(this).closest('.owl-wrap').find('.owl-carousel').trigger('prev.owl.carousel');
			});

			$(".rt-owl-carousel").each(function () {
				var options = $(this).data('carousel-options');
				if (ThemeObj.rtl == 'yes') {
					options['rtl'] = true; //@rtl
				}
				$(this).owlCarousel(options);
			});
		}

        /*-------------------------------------
        Intersection Observer
        -------------------------------------*/
        function sidebar_title_change() {
            let observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        var heading = $(entry.target).find('.heading-title').data('heading') || '';
                        $('#wrapper').find(".section-name").text(heading);
                    }
                });
            }, {rootMargin: "0% 0% -70% 0%"});
            document.querySelectorAll('.has-obserbation').forEach(block => {
                observer.observe(block)
            });
        }


        /*-------------------------------------
            Custom Init
        -------------------------------------*/
        galleryStyleLoading();
        sidebar_title_change();

        /*-------------------------------------
            Proof Gallery
        -------------------------------------*/
        $('.proof-gallery .img-box').click(function () {
            $(this).toggleClass('checked');
            $(this).next('.item-icon').slideToggle('500');
            $(this).find('i').toggleClass('fa-plus fa-check');
        });

    }

    /*-------------------------------------
    Page Preloader
    -------------------------------------*/
    $("#preloader").fadeOut("slow", function () {
        $(this).remove();
    });	

    /*-------------------------------------
     Search Form
    -------------------------------------*/
    //Header Search
    $('a[href="#header-search"]').on("click", function (event) {
        event.preventDefault();
        $("#header-search").addClass("open");
        $('#header-search > form > input[type="search"]').focus();
    });

    $("#header-search, #header-search button.close").on("click keyup", function (
        event
    ) {
        if (
            event.target === this ||
            event.target.className === "close" ||
            event.keyCode === 27
        ) {
            $(this).removeClass("open");
        }
    });

    /*---------------------------------------
    On Click Section Switch
    --------------------------------------- */
    $('[data-type="section-switch"]').on('click', function () {
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
            var target = $(this.hash);
            if (target.length > 0) {

                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });

    /*-------------------------------------
    Scroll to Bottom
    -------------------------------------*/
    $("#mybutton").on('click', 'a', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#about-us").offset().top
        }, 1000);
    });

    /*-------------------------------------
    On Scroll
    -------------------------------------*/
    $(window).on('scroll', function () {

        if ($(window).scrollTop() >= $("body").offset().top + 50)
            $('body').addClass('mn-top');
        else
            $('body').removeClass('mn-top');

        // Heading Title Show/Hide
        var targetHeight = $("#sidebar-wrap").outerHeight() || 0;
        if ($(window).scrollTop() > targetHeight) {
            $('#sidebar-wrap').addClass('sidebar-sticky');
        } else {
            $('#sidebar-wrap').removeClass('sidebar-sticky');
        }

        // Back Top Button
        if ($(window).scrollTop() > 500) {
            $('.scrollup').addClass('back-top');
        } else {
            $('.scrollup').removeClass('back-top');
        }

        // Sticky mobile menu
        if ($(window).scrollTop() > 0) {
            $('.rt-header-menu').addClass('sticky-mobile');
        } else {
            $('.rt-header-menu').removeClass('sticky-mobile');
        }

        // Sticky Header
        if ($('body').hasClass('sticky-header')) {
            var stickyPlaceHolder = $("#rt-sticky-placeholder"),
                menu = $("#header-menu"),
                menuH = menu.outerHeight(),
                topHeaderH = $('#header-topbar').outerHeight() || 0,
                middleHeaderH = $('#header-middlebar').outerHeight() || 0,
                targrtScroll = topHeaderH + middleHeaderH;
            if ($(window).scrollTop() > targrtScroll) {
                menu.addClass('rt-sticky');
                stickyPlaceHolder.height(menuH);
            } else {
                menu.removeClass('rt-sticky');
                stickyPlaceHolder.height(0);
            }
        }
    });

    function body_class_added() {
        let observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    $('body').addClass('remove-header')
                } else {
                    $('body').removeClass('remove-header')

                }
            });
        }, {rootMargin: "0% 0% -10% 0%"});
        document.querySelectorAll('#rt-author').forEach(block => {
            observer.observe(block)
        });
    }

    if (window.IntersectionObserver) {
        // For Remove Parallax Home Page Header
        body_class_added();
    }   

    /*-------------------------------------
    MeanMenu activation code
    --------------------------------------*/
	var a = $('.offscreen-navigation .menu');

    if (a.length) {
        a.children("li").addClass("menu-item-parent");
        a.find(".menu-item-has-children > a").on("click", function (e) {
            e.preventDefault();
            $(this).toggleClass("opened");
            var n = $(this).next(".sub-menu"),
                s = $(this).closest(".menu-item-parent").find(".sub-menu");
            a.find(".sub-menu").not(s).slideUp(250).prev('a').removeClass('opened'), n.slideToggle(250)
        });
        a.find('.menu-item:not(.menu-item-has-children) > a').on('click', function (e) {
            $('.rt-slide-nav').slideUp();
            $('body').removeClass('slidemenuon');
        });
    }

	$('.mean-bar .sidebarBtn').on('click', function (e) {
	e.preventDefault();
	if ($('.rt-slide-nav').is(":visible")) {
		$('.rt-slide-nav').slideUp();
		$('body').removeClass('slidemenuon');
	} else {
		$('.rt-slide-nav').slideDown();
		$('body').addClass('slidemenuon');
	}

	});

    $('.menu-box nav').navpoints({
        updateHash:true
    });


    /*--------------------------------------
    Tooltip initialization
    --------------------------------------*/
    $('[data-toggle="tooltip"]').tooltip()


    //PP Nav Remove
    $('#pp-nav').remove();

    // Window Load+Resize
    $(window).on('load resize', function () {
        // Elementor Frontend Load
        $(window).on('elementor/frontend/init', function () {
            if (elementorFrontend.isEditMode()) {
                elementorFrontend.hooks.addAction('frontend/element_ready/widget', function () {
                    fmwave_scripts_load();
                });
            }
        });
    });

    // Window Load
    $(window).on('load', function () {
        fmwave_scripts_load();
    });
	
	//woocommerce ajax	
	var WooCommerce = {
	   quantity_change: function quantity_change() {
		   $(document).on('click', '.quantity .input-group-btn .quantity-btn', function() {
			   var $input = $(this).closest('.quantity').find('.input-text');

			   if ($(this).hasClass('quantity-plus')) {
				   $input.trigger('stepUp').trigger('change');
			   }

			   if ($(this).hasClass('quantity-minus')) {
				   $input.trigger('stepDown').trigger('change');
			   }
		   });
	   },
	   wishlist_icon: function wishlist_icon() {
		   $(document).on('click', '.rdtheme-wishlist-icon', function() {
			   if ($(this).hasClass('rdtheme-add-to-wishlist')) {
				   var $obj = $(this),
					   productId = $obj.data('product-id'),
					   afterTitle = $obj.data('title-after');
				   var data = {
					   'action': 'fmwave_add_to_wishlist',
					   'context': 'frontend',
					   'nonce': $obj.data('nonce'),
					   'add_to_wishlist': productId
				   };
				   $.ajax({
					   url: ThemeObj.ajaxurl,
					   type: 'POST',
					   data: data,
					   beforeSend: function beforeSend() {
						   $obj.find('.wishlist-icon').hide();
						   $obj.find('.ajax-loading').show();
						   $obj.addClass('rdtheme-wishlist-ajaxloading');
					   },
					   success: function success(data) {
						   if (data['result'] != 'error') {
							   $obj.find('.ajax-loading').hide();
							   $obj.removeClass('rdtheme-wishlist-ajaxloading');
							   $obj.find('.wishlist-icon').removeClass('far fa-heart').addClass('fas fa-heart').show();
							   $obj.removeClass('rdtheme-add-to-wishlist').addClass('rdtheme-remove-from-wishlist');
							   $obj.attr('title', afterTitle);
							   $obj.find('.wl-btn-text').text(afterTitle);
							   $(".wl-btn-text").text(function(index, text){
								   return text.replace( "Add to Wishlist", "Added in Wishlist! View Wishlist" );  
							   });
						   } else {
							   console.log(data['message']);
						   }
					   }
				   });
				   return false;
			   }
		   });
	   }
	};
	WooCommerce.wishlist_icon();
	WooCommerce.quantity_change();

})(jQuery);