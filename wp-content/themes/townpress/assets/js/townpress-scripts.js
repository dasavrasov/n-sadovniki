/**
 * Table of contents
 *
 * 1. General
 * 2. Components
 * 3. Header
 * 4. Core
 * 5. Widgets
 * 6. Elements
 * 7. Other
 * 8. Accessibility
 * 9. Plugins
 */

(function($){ "use strict";
$(document).ready( function() {

/* -----------------------------------------------------------------------------

	1. GENERAL

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		IMPROVE ACCESSIBILITY
	-------------------------------------------------------------------------- */

	if ( $( 'body' ).hasClass( 'lsvr-accessibility' ) ) {

		// User is using mouse
		$(document).on( 'mousedown', function() {
			$('body').addClass( 'lsvr-using-mouse' );
			$('body').removeClass( 'lsvr-using-keyboard' );
		});

		// User is using keyboard
		$(document).on( 'keyup', function(e) {
			if ( e.key === "Tab" ) {
				$('body').addClass( 'lsvr-using-keyboard' );
				$('body').removeClass( 'lsvr-using-mouse' );
			}
		});

	}


/* -----------------------------------------------------------------------------

	2. COMPONENTS

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		LEAFLET MAP
	-------------------------------------------------------------------------- */

	if ( $.fn.lsvrTownpressMapLeaflet && 'object' === typeof L ) {

		$( '.c-map--leaflet .c-map__canvas' ).each(function() {
			$(this).lsvrTownpressMapLeaflet();
		});

	}

	/* -------------------------------------------------------------------------
		GOOGLE MAP
	-------------------------------------------------------------------------- */

	if ( $.fn.lsvrTownpressMapGmaps ) {

		$( '.c-map--gmaps .c-map__canvas' ).each(function() {
			$(this).lsvrTownpressMapGmaps();
		});

	}


/* -----------------------------------------------------------------------------

	3. HEADER

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		HEADER MENU
	------------------------------------------------------------------------- */

	$( '.header-menu' ).each(function() {

		var $this = $(this);

		// Hide desktop all submenus function
		function resetMenu() {
			$this.find( '.header-menu__item' ).removeClass( 'header-menu__item--hover header-menu__item--active' );
			$this.find( '.header-menu__item-link' ).attr( 'aria-expanded', false );
			$this.find( '.header-menu__submenu' ).removeAttr( 'style' ).attr( 'aria-expanded', false );
		}

		// Reset menu when click on link without submenu
		$this.find( '.header-menu__item-link' ).each(function() {
			$(this).on( 'click', function() {
				if ( $(this).parent().find( '> .header-menu__submenu' ).length < 1 ) {
					resetMenu();
				}
			});
		});

		// Parse submenus
		$this.find( '.header-menu__item--dropdown .header-menu__submenu--level-0, .header-menu__item--dropdown .header-menu__submenu--level-1, .header-menu__item--megamenu .header-menu__submenu--level-0' ).each(function() {

			var $submenu = $(this),
				$parent = $(this).parent(),
				$link = $parent.find( '> .header-menu__item-link' );

			// Show submenu function
			function showSubmenu() {
				$parent.addClass( 'header-menu__item--hover' );
				$submenu.show();
				$link.attr( 'aria-expanded', true );
				$submenu.attr( 'aria-expanded', true );
			}

			// Hide submenu function
			function hideSubmenu() {
				$parent.removeClass( 'header-menu__item--hover' );
				$submenu.hide();
				$link.attr( 'aria-expanded', false );
				$submenu.attr( 'aria-expanded', false );
			}

			// Mouseover and focus action
			$parent.on( 'mouseover focus', function() {
				showSubmenu();
			});

			// Mouseleave and blur action
			$parent.on( 'mouseleave blur', function() {
				hideSubmenu();
			});

			// On click or key enter
			$link.on( 'click', function( event ) {
				if ( ! $parent.hasClass( 'header-menu__item--hover' ) ) {

					// Hide opened submenus
					$parent.siblings( '.header-menu__item.header-menu__item--hover' ).each(function() {
						$(this).removeClass( 'header-menu__item--hover' );
						$(this).find( '> .header-menu__submenu' ).hide();
						$(this).find( '> .header-menu__item-link' ).attr( 'aria-expanded', false );
						$(this).find( '> .header-menu__submenu' ).attr( 'aria-expanded', false );
					});

					// Show submenu
					showSubmenu();

					// Hide on click outside
					$( 'html' ).on( 'click.lsvrTownpressHeaderMenuCloseSubmenuOnClickOutside', function(e) {

						hideSubmenu();
						$( 'html' ).unbind( 'click.lsvrTownpressHeaderMenuCloseSubmenuOnClickOutside' );

					});

					// Disable link
					$parent.on( 'click touchstart', function(e) {
						e.stopPropagation();
					});
					return false;

				}
				hideSubmenu();
			});

		});

		// Close submenu on ESC key
		$(document).on( 'keyup.lsvrTownpressHeaderMenuCloseSubmenuOnEscKey', function(e) {

			if ( e.key === "Escape" ) {

				// Find focused link parent
				if ( $( '*:focus' ).closest( '.header-menu__item--hover' ).length > 0 ) {

					$( '*:focus' ).closest( '.header-menu__item--hover' ).each(function() {

						// Close active submenu
						$(this).removeClass( 'header-menu__item--hover' );
						$(this).find( '> .header-menu__submenu' ).hide();
						$(this).find( '> .header-menu__item-link' ).attr( 'aria-expanded', false );
						$(this).find( '> .header-menu__submenu' ).attr( 'aria-expanded', false );

						// Change focus
						$(this).find( '> .header-menu__item-link' ).focus();

					});

				}

				// Otherwise hide all submenus
				else {

					$( '.header-menu__item--hover' ).each(function() {

						$(this).removeClass( 'header-menu__item--hover' );
						$(this).find( '> .header-menu__submenu' ).hide();
						$(this).find( '> .header-menu__item-link' ).attr( 'aria-expanded', false );
						$(this).find( '> .header-menu__submenu' ).attr( 'aria-expanded', false );

					});

				}

			}

		});

		// Reset on screen transition
		$(document).on( 'lsvrTownpressScreenTransition', function() {
			resetMenu();
		});

	});

	/* -------------------------------------------------------------------------
		STICKY NAVBAR
	-------------------------------------------------------------------------- */

	$( '.header-navbar--sticky' ).each(function() {

		if ( $.fn.lsvrTownpressGetMediaQueryBreakpoint() > 991 ) {

			var $navbar = $(this),
				$placeholder = $( '.header-navbar__placeholder' ),
				navbarHeight = $navbar.outerHeight();

			$placeholder.css( 'height', navbarHeight );

		}

	});

	/* -------------------------------------------------------------------------
		HEADER MAP
	-------------------------------------------------------------------------- */

	$( '.header-map' ).each(function() {

		var $this = $(this),
			$canvas = $this.find( '.header-map__canvas' ),
			$close = $this.find( '.header-map__close' ),
			$toggle = $( '.header-map-toggle' ),
			$spinner = $this.find( '.c-spinner' ),
			mapPlatform = $canvas.data( 'map-platform' ),
			map;

		// Toggle map
		$toggle.on( 'click', function() {

			$this.slideToggle( 100, function() {

				// Load map on first display
				if ( $this.hasClass( 'header-map--loading' ) ) {

					// Google maps
					if ( 'gmaps' === mapPlatform && $.fn.lsvrTownpressMapGmaps ) {
						$canvas.lsvrTownpressMapGmaps();
					}

					// Leaflet
					else if ( 'leaflet' === mapPlatform && $.fn.lsvrTownpressMapLeaflet && 'object' === typeof L ) {
						$canvas.lsvrTownpressMapLeaflet();
					}

				}

				// Display already loaded map
				else if ( $this.is( ':visible' ) ) {

					// Reize on open
					if ( typeof $canvas.data( 'map' ) !== 'undefined' ) {
						map = $canvas.data( 'map' );

						// Google map
						if ( 'gmaps' === mapPlatform && 'object' == typeof map && 'object' === typeof google && 'object' === typeof google.maps ) {
							google.maps.event.trigger( map, 'resize' );
						}

						// Leaflet
						else if ( 'leaflet' === mapPlatform && 'object' == typeof map && 'function' === typeof map['invalidateSize'] ) {
							map.invalidateSize()
						}

					}

				}

				$toggle.toggleClass( 'header-map-toggle--active' );
				$this.removeClass( 'header-map--loading' );

			});

			$( '#header' ).toggleClass( 'header--map-open' );
			$( 'body' ).toggleClass( 'lsvr-header-map-open' );

		});

		// Close map
		$close.on( 'click', function() {
			$this.slideUp( 100 );
			$toggle.removeClass( 'header-map-toggle--active' );
			$( '#header' ).removeClass( 'header--map-open' );
			$( 'body' ).removeClass( 'lsvr-header-map-open' );
		});

	});

	/* -------------------------------------------------------------------------
		MOBILE TOOLBAR
	-------------------------------------------------------------------------- */

	// Toogle
	$( '.header-toolbar-toggle__menu-button' ).each(function() {
		$(this).on( 'click', function() {

			$( '.header-toolbar-toggle' ).toggleClass( 'header-toolbar-toggle--active' );
			$(this).toggleClass( 'header-toolbar-toggle__menu-button--active' );
			$( '.header-toolbar' ).slideToggle( 200 );

			if ( $(this).hasClass( 'header-toolbar-toggle__menu-button--active' ) ) {
				$(this).attr( 'aria-expanded', true );
			} else {
				$(this).attr( 'aria-expanded', false );
			}


		});
	});

	// Mobile menu
	$( '.header-mobile-menu' ).each(function() {

		var expandSubmenuLabel = $(this).data( 'label-expand-submenu' ),
			collapseSubmenuLabel = $(this).data( 'label-collapse-submenu' );

		// Submenu toggle
		$(this).find( '.header-mobile-menu__toggle' ).each(function() {

			var $toggle = $(this),
				$parent = $toggle.parent(),
				$submenu = $parent.find( '> .header-mobile-menu__submenu' );

			$toggle.on( 'click', function( event ) {

				$toggle.toggleClass( 'header-mobile-menu__toggle--active' );
				$parent.toggleClass( 'header-mobile-menu__item--active' );
				$submenu.slideToggle( 200 );

				if ( $toggle.hasClass( 'header-mobile-menu__toggle--active' ) ) {

					$toggle.attr( 'aria-label', collapseSubmenuLabel );
					$toggle.attr( 'aria-expanded', true );
					$submenu.attr( 'aria-expanded', true );

				} else {

					$toggle.attr( 'aria-label', expandSubmenuLabel );
					$toggle.attr( 'aria-expanded', false );
					$submenu.attr( 'aria-expanded', false );

				}

			});

		});

		// Close mobile submenu on ESC key
		$(document).on( 'keyup.lsvrTownpressHeaderMobileMenuCloseSubmenuOnEscKey', function(e) {

			if ( e.key === "Escape" ) {

				// Find focused link parent
				if ( $( '*:focus' ).closest( '.header-mobile-menu__item--active' ).length > 0 ) {

					$( '*:focus' ).closest( '.header-mobile-menu__item--active' ).each(function() {

						// Close active submenu
						$(this).removeClass( 'header-mobile-menu__item--active' );
						$(this).find( '> .header-mobile-menu__submenu' ).hide();
						$(this).find( '> .header-mobile-menu__toggle' ).removeClass( 'header-mobile-menu__toggle--active' );
						$(this).find( '> .header-mobile-menu__toggle' ).attr( 'aria-label', expandSubmenuLabel );
						$(this).find( '> .header-mobile-menu__toggle' ).attr( 'aria-expanded', false );
						$(this).find( '> .header-mobile-menu__submenu' ).attr( 'aria-expanded', false );

						// Change focus
						$(this).find( '> .header-mobile-menu__toggle' ).focus();

					});

				}

				// Otherwise hide all submenus
				else {

					$( '.header-mobile-menu__item' ).each(function() {

						$(this).removeClass( 'header-mobile-menu__item--active' );
						$(this).find( '> .header-mobile-menu__submenu' ).hide();
						$(this).find( '> .header-mobile-menu__toggle' ).removeClass( 'header-mobile-menu__toggle--active' );
						$(this).find( '> .header-mobile-menu__toggle' ).attr( 'aria-label', expandSubmenuLabel );
						$(this).find( '> .header-mobile-menu__toggle' ).attr( 'aria-expanded', false );
						$(this).find( '> .header-mobile-menu__submenu' ).attr( 'aria-expanded', false );

					});

				}

			}

		});

		// Reset on screen transition
		$(document).on( 'lsvrTownpressScreenTransition', function() {

			$( '.header-toolbar-toggle' ).removeClass( 'header-toolbar-toggle--active' );
			$( '.header-toolbar-toggle__menu-button' ).removeClass( 'header-toolbar-toggle__menu-button--active' ).attr( 'aria-expanded', false );
			$( '.header-toolbar' ).removeAttr( 'style' );
			$( '.header-mobile-menu__item--active' ).removeClass( 'header-mobile-menu__item--active' );
			$( '.header-mobile-menu__submenu' ).removeAttr( 'style' ).attr( 'aria-expanded', false );
			$( '.header-mobile-menu__toggle--active' ).removeClass( 'header-mobile-menu__toggle--active' );
			$( '.header-mobile-menu__toggle' ).attr( 'aria-expanded', false ).attr( 'aria-label', $( '.header-mobile-menu' ).data( 'label-expand-submenu' ) );

		});

	});


	/* -------------------------------------------------------------------------
		BACKGROUND SLIDESHOW
	-------------------------------------------------------------------------- */

	$( '.header-background--slideshow, .header-background--slideshow-home' ).each(function() {

		var $this = $(this),
			$images = $this.find( '.header-background__image' ),
			slideshowSpeed = $this.data( 'slideshow-speed' ) ? parseInt( $this.data( 'slideshow-speed' ) ) * 1000 : 10,
			animationSpeed = 2000;

		// Continue if there are at least two images
		if ( $images.length > 1 ) {

			// Set default active image
			$images.filter( '.header-background__image--default' ).addClass( 'header-background__image--active' );
			var $active = $images.filter( '.header-background__image--active' ),
				$next;

			// Change image to next one
			var changeImage = function() {

				// Determine next image
				if ( $active.next().length > 0 ) {
					$next = $active.next();
				}
				else {
					$next = $images.first();
				}

				// Hide active
				$active.fadeOut( animationSpeed, function() {
					$(this).removeClass( 'header-background__image--active'  );
				});

				// Show next
				$next.fadeIn( animationSpeed, function() {
					$(this).addClass( 'header-background__image--active' );
					$active = $(this);
				});

				// Repeat
				setTimeout( function() {
					changeImage();
				}, slideshowSpeed );

			};

			// Init
			if ( $.fn.lsvrTownpressGetMediaQueryBreakpoint() > 1199 ) {
				setTimeout( function() {
					changeImage();
				}, slideshowSpeed );
			}

		}

	});

/* -----------------------------------------------------------------------------

	4. CORE

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		GALLERIES
	------------------------------------------------------------------------- */

	// Gallery masonry
	if ( $.fn.masonry && $.fn.imagesLoaded ) {
		$( '.lsvr_gallery-post-archive .lsvr-grid--masonry, .lsvr_gallery-post-single .post__image-list--masonry' ).each(function() {

			var $this = $(this),
				isRTL = $( 'html' ).attr( 'dir' ) && 'rtl' === $( 'html' ).attr( 'dir' ) ? true : false;

			// Wait for images to load
			$this.imagesLoaded(function() {
				$this.masonry({
					isRTL: isRTL
				});
			});

		});
	}

	/* -------------------------------------------------------------------------
		DOCUMENTS
	------------------------------------------------------------------------- */

	// Categorized attachments
	$( '.lsvr_document-post-archive--categorized-attachments .post-tree' ).each(function() {

		var expandSubmenuLabel = $(this).data( 'label-expand-submenu' ),
			collapseSubmenuLabel = $(this).data( 'label-collapse-submenu' );

		$(this).find( '.post-tree__item-toggle' ).each(function() {

			var $toggle = $(this),
				$parent = $toggle.parent(),
				$submenu = $parent.find( '> .post-tree__children' );

			$toggle.on( 'click', function() {

				$toggle.toggleClass( 'post-tree__item-toggle--active' );
				$parent.toggleClass( 'post-tree__item--active' );
				$submenu.slideToggle( 200 );

				if ( $toggle.hasClass( 'post-tree__item-toggle--active' ) ) {

					$toggle.attr( 'aria-label', collapseSubmenuLabel );
					$toggle.attr( 'aria-expanded', true );
					$submenu.attr( 'aria-expanded', true );

				} else {

					$toggle.attr( 'aria-label', expandSubmenuLabel );
					$toggle.attr( 'aria-expanded', false );
					$submenu.attr( 'aria-expanded', false );

				}

			});

		});

		// Close mobile submenu on ESC key
		$(document).on( 'keyup.lsvrTownpressDocumentArchiveCategorizedAttachmentsCloseSubmenuOnEscKey', function(e) {

			if ( e.key === "Escape" ) {

				// Find focused link parent
				if ( $( '*:focus' ).closest( '.post-tree__item--active' ).length > 0 ) {

					$( '*:focus' ).closest( '.post-tree__item--active' ).each(function() {

						// Close active submenu
						$(this).removeClass( 'post-tree__item--active' );
						$(this).find( '> .post-tree__children' ).hide();
						$(this).find( '> .post-tree__item-toggle' ).removeClass( 'post-tree__item-toggle--active' );
						$(this).find( '> .post-tree__item-toggle' ).attr( 'aria-label', expandSubmenuLabel );
						$(this).find( '> .post-tree__item-toggle' ).attr( 'aria-expanded', false );
						$(this).find( '> .post-tree__children' ).attr( 'aria-expanded', false );

						// Change focus
						$(this).find( '> .post-tree__item-toggle' ).focus();

					});

				}

				// Otherwise hide all submenus
				else {

					$( '.post-tree__item' ).each(function() {

						$(this).removeClass( 'header-post-tree__item--active' );
						$(this).find( '> .post-tree__children' ).hide();
						$(this).find( '> .post-tree__item-toggle' ).removeClass( 'post-tree__item-toggle--active' );
						$(this).find( '> .post-tree__item-toggle' ).attr( 'aria-label', expandSubmenuLabel );
						$(this).find( '> .post-tree__item-toggle' ).attr( 'aria-expanded', false );
						$(this).find( '> .post-tree__children' ).attr( 'aria-expanded', false );

					});

				}

			}

		});

		// Reset on screen transition
		$(document).on( 'lsvrTownpressScreenTransition', function() {

			$( '.post-tree__children' ).removeAttr( 'style' );
			$( '.post-tree__item-toggle' ).removeClass( 'post-tree__item-toggle--active' ).attr( 'aria-label', expandSubmenuLabel ).attr( 'aria-expanded', false );
			$( '.post-tree__children' ).attr( 'aria-expanded', false );

		});

	});


/* -----------------------------------------------------------------------------

	5. WIDGETS

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		MENU WIDGET
	------------------------------------------------------------------------- */

	$( '.lsvr-townpress-menu-widget__nav' ).each(function() {

		var $this = $(this),
			expandPopupLabel = $(this).data( 'label-expand-submenu' ),
			collapsePopupLabel = $(this).data( 'label-collapse-submenu' );

		// Hide desktop all submenus function
		function resetMenu() {
			$this.find( '.lsvr-townpress-menu-widget__item' ).removeClass( 'lsvr-townpress-menu-widget__item--hover lsvr-townpress-menu-widget__item--active' );
			$this.find( '.lsvr-townpress-menu-widget__item-link' ).attr( 'aria-expanded', false );
			$this.find( '.lsvr-townpress-menu-widget__submenu' ).removeAttr( 'style' ).attr( 'aria-expanded', false );
			$this.find( '.lsvr-townpress-menu-widget__submenu-toggle' ).removeClass( 'lsvr-townpress-menu-widget__submenu-toggle--active' ).attr( 'title', expandPopupLabel ).attr( 'aria-expanded', false );
		}

		// Reset menu when click on link without submenu
		$this.find( '.lsvr-townpress-menu-widget__item-link' ).each(function() {
			$(this).on( 'click', function() {
				if ( $(this).parent().find( '> .lsvr-townpress-menu-widget__submenu' ).length < 1 ) {
					resetMenu();
				}
			});
		});

		$(this).find( '.lsvr-townpress-menu-widget__submenu--level-0, .lsvr-townpress-menu-widget__submenu--level-1' ).not( ':visible' ).each(function() {

			var $submenu = $(this),
				$parent = $(this).parent(),
				$link = $parent.find( '> .lsvr-townpress-menu-widget__item-link' ),
				$toggle = $parent.find( '> .lsvr-townpress-menu-widget__toggle' );

			// Show submenu function
			function showSubmenu() {
				$parent.addClass( 'lsvr-townpress-menu-widget__item--hover lsvr-townpress-menu-widget__item--active' );
				$submenu.show();
				$link.attr( 'aria-expanded', true );
				$submenu.attr( 'aria-expanded', true );
			}

			// Hide submenu function
			function hideSubmenu() {
				$parent.removeClass( 'lsvr-townpress-menu-widget__item--hover lsvr-townpress-menu-widget__item--active' );
				$submenu.hide();
				$link.attr( 'aria-expanded', false );
				$submenu.attr( 'aria-expanded', false );
			}

			// Desktop hover and touch
			if ( $.fn.lsvrTownpressGetMediaQueryBreakpoint() > 991 ) {

				// Mouseover and focus action
				$parent.on( 'mouseover focus', function() {
					showSubmenu();
				});

				// Mouseleave and blur action
				$parent.on( 'mouseleave blur', function() {
					hideSubmenu();
				});

				// Touch
				$link.on( 'click', function() {
					if ( ! $parent.hasClass( 'lsvr-townpress-menu-widget__item--hover' ) ) {

						// Hide opened submenus
						$parent.siblings( '.lsvr-townpress-menu-widget__item--hover' ).each(function() {
							$(this).removeClass( 'lsvr-townpress-menu-widget__item--hover' );
							$(this).find( '> .lsvr-townpress-menu-widget__submenu' ).hide();
							$(this).find( '> .lsvr-townpress-menu-widget__item-link' ).attr( 'aria-expanded', false );
							$(this).find( '> .lsvr-townpress-menu-widget__submenu' ).attr( 'aria-expanded', false );
						});

						// Show subemnu
						showSubmenu();

						// Hide on click outside
						$( 'html' ).on( 'click.lsvrTownpressMenuWidgetCloseSubmenuOnClickOutside', function(e) {

							hideSubmenu();
							$( 'html' ).unbind( 'click.lsvrTownpressMenuWidgetCloseSubmenuOnClickOutside' );

						});

						// Disable link
						$parent.on( 'click touchstart', function(e) {
							e.stopPropagation();
						});
						return false;

					}
					hideSubmenu();
				});

			}

			// Toggle
			$toggle.on( 'click', function() {

				$toggle.toggleClass( 'lsvr-townpress-menu-widget__toggle--active' );
				$parent.toggleClass( 'lsvr-townpress-menu-widget__item--active' );
				$submenu.slideToggle( 200 );

				if ( $toggle.hasClass( 'lsvr-townpress-menu-widget__toggle--active' ) ) {

					$toggle.attr( 'aria-label', collapsePopupLabel );
					$toggle.attr( 'aria-expanded', true );
					$submenu.attr( 'aria-expanded', true );

				} else {

					$toggle.attr( 'aria-label', expandPopupLabel );
					$toggle.attr( 'aria-expanded', false );
					$submenu.attr( 'aria-expanded', false );

				}

			});

		});

		// Close submenu on ESC key
		$(document).on( 'keyup.lsvrTownpressMenuWidgetCloseSubmenuOnEscKey', function(e) {

			if ( e.key === "Escape" ) {

				// Find focused link parent
				if ( $( '*:focus' ).closest( '.lsvr-townpress-menu-widget__item--active' ).length > 0 ) {

					$( '*:focus' ).closest( '.lsvr-townpress-menu-widget__item--active' ).each(function() {

						// Close active submenu
						$(this).removeClass( 'lsvr-townpress-menu-widget__item--hover lsvr-townpress-menu-widget__item--active' );
						$(this).find( '> .lsvr-townpress-menu-widget__submenu' ).hide();
						$(this).find( '> .lsvr-townpress-menu-widget__item-link' ).attr( 'aria-expanded', false );
						$(this).find( '> .lsvr-townpress-menu-widget__submenu' ).attr( 'aria-expanded', false );
						$(this).find( '> .lsvr-townpress-menu-widget__toggle' ).removeClass( 'lsvr-townpress-menu-widget__toggle--active lsvr-townpress-menu-widget__toggle--hover' );
						$(this).find( '> .lsvr-townpress-menu-widget__toggle' ).attr( 'aria-label', expandPopupLabel );
						$(this).find( '> .lsvr-townpress-menu-widget__toggle' ).attr( 'aria-expanded', false );

						// Change focus
						$(this).find( '> .lsvr-townpress-menu-widget__item-link' ).focus();

					});

				}

				// Otherwise hide all submenus
				else {

					$( '.lsvr-townpress-menu-widget__item--active' ).each(function() {

						$(this).removeClass( 'lsvr-townpress-menu-widget__item--active lsvr-townpress-menu-widget__item--hover' );
						$(this).find( '> .lsvr-townpress-menu-widget__submenu' ).hide();
						$(this).find( '> .lsvr-townpress-menu-widget__item-link' ).attr( 'aria-expanded', false );
						$(this).find( '> .lsvr-townpress-menu-widget__submenu' ).attr( 'aria-expanded', false );
						$(this).find( '> .lsvr-townpress-menu-widget__toggle' ).removeClass( 'lsvr-townpress-menu-widget__toggle--active lsvr-townpress-menu-widget__toggle--hover' );
						$(this).find( '> .lsvr-townpress-menu-widget__toggle' ).attr( 'aria-label', expandPopupLabel );
						$(this).find( '> .lsvr-townpress-menu-widget__toggle' ).attr( 'aria-expanded', false );

					});

				}

			}

		});

		// Reset on screen transition
		$(document).on( 'lsvrTownpressScreenTransition', function() {
			resetMenu();
		});

	});



/* -----------------------------------------------------------------------------

	6. ELEMENTS

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		POST SLIDER
	-------------------------------------------------------------------------- */

	if ( $.fn.owlCarousel ) {
		$( '.lsvr-townpress-post-slider' ).each( function() {

			var $this = $(this),
				$sliderInner = $this.find( '.lsvr-townpress-post-slider__inner' ),
				$slideList = $this.find( '.lsvr-townpress-post-slider__list' ),
				$slides = $this.find( '.lsvr-townpress-post-slider__post' ),
				$indicator = $this.find( '.lsvr-townpress-post-slider__indicator-inner' ),
				slideCount = $slides.length,
				autoplay = $this.data( 'autoplay' ) && parseInt( $this.data( 'autoplay' ) ) > 0 ? true : false,
				autoplayTimeout = $this.data( 'autoplay' ) && parseInt( $this.data( 'autoplay' ) ) > 0 ? parseInt( $this.data( 'autoplay' ) ) * 1000 : 0,
				rtl = $( 'html' ).attr( 'dir' ) && $( 'html' ).attr( 'dir' ) == 'rtl' ? true : false;

			if ( slideCount > 1 ) {

				// Init carousel
				$slideList.owlCarousel({
					rtl: rtl,
					autoHeight: true,
					loop: true,
					nav: true,
					navText: new Array( '<span class="lsvr-townpress-post-slider__indicator-icon lsvr-townpress-post-slider__indicator-icon--left icon-angle-left" aria-hidden="true"></span>', '<span class="lsvr-townpress-post-slider__indicator-icon lsvr-townpress-post-slider__indicator-icon--right icon-angle-right" aria-hidden="true"></span>' ),
					navRewind: true,
					dots: false,
					autoplay: autoplay,
					autoplayTimeout: autoplayTimeout,
					autoplayHoverPause: true,
					responsive:{
						0: {
							items: 1
						}
					},
					onTranslated: function() {

						// Refresh indicator
						if ( autoplay ) {
							$indicator.stop( 0, 0 );
						}
						if ( autoplay && $.fn.lsvrTownpressGetMediaQueryBreakpoint() > 991 ) {
							$indicator.css( 'width', 0 );
							if ( ! $this.hasClass( 'lsvr-townpress-post-slider--paused' ) ) {
								$indicator.stop( 0, 0 ).animate({ width : "100%" }, autoplayTimeout );
							}
						}

					}
				});

				// Autoplay indicator
				if ( true === autoplay ) {

					$this.addClass( 'lsvr-townpress-post-slider--has-indicator' );

					// Initial animation
					$indicator.animate({
						width : "100%"
					}, autoplayTimeout, 'linear' );

					// Pause
					var sliderPause = function() {
						$this.addClass( 'lsvr-townpress-post-slider--paused' );
						$indicator.stop( 0, 0 );
					};
					var sliderResume = function() {
						$this.removeClass( 'lsvr-townpress-post-slider--paused' );
						$indicator.stop( 0, 0 ).animate({
							width : "100%"
						}, autoplayTimeout, 'linear' );
					};

					$this.on( 'mouseenter', function() {
						sliderPause();
					});

					$this.on( 'mouseleave', function() {
						sliderResume();
					});

					// Stop on smaller resolutions
					$( document ).on( 'lsvrTownpressScreenTransition', function() {
						if ( $.fn.lsvrTownpressGetMediaQueryBreakpoint() <= 991 ) {
							sliderPause();
						}
					});
					if ( $.fn.lsvrTownpressGetMediaQueryBreakpoint() <= 991 ) {
						sliderPause();
					}

				}

			}

		});
	}


/* -----------------------------------------------------------------------------

	7. OTHER

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		BACK TO TOP
	------------------------------------------------------------------------- */

	$( '.back-to-top__link' ).each(function() {

		$(this).on( 'click', function() {
			$( 'html, body' ).animate({ scrollTop: 0 }, 100 );
			return false;
		});

	});

	/* -------------------------------------------------------------------------
		MAGNIFIC POPUP
	------------------------------------------------------------------------- */

	if ( $.fn.magnificPopup ) {

		// Lightbox config
		if ( 'undefined' !== typeof lsvr_townpress_js_labels && lsvr_townpress_js_labels.hasOwnProperty( 'magnific_popup' ) ) {

			var js_strings = lsvr_townpress_js_labels.magnific_popup;
			$.extend( true, $.magnificPopup.defaults, {
				tClose: js_strings.mp_tClose,
				tLoading: js_strings.mp_tLoading,
				gallery: {
					tPrev: js_strings.mp_tPrev,
					tNext: js_strings.mp_tNext,
					tCounter: '%curr% / %total%'
				},
				image: {
					tError: js_strings.mp_image_tError,
				},
				ajax: {
					tError: js_strings.mp_ajax_tError,
				}
			});

		}

		// Init lightbox
		$( '.lsvr-open-in-lightbox, body:not( .elementor-page ) .gallery .gallery-item a, .wp-block-gallery .blocks-gallery-item a' ).magnificPopup({
			type: 'image',
			removalDelay: 300,
			mainClass: 'mfp-fade',
			gallery: {
				enabled: true
			}
		});

	}

});
})(jQuery);

(function($){ "use strict";

/* -----------------------------------------------------------------------------

	8. PLUGINS

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		MEDIA QUERY BREAKPOINT
	------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrTownpressGetMediaQueryBreakpoint ) {
		$.fn.lsvrTownpressGetMediaQueryBreakpoint = function() {

			if ( $( '#lsvr-media-query-breakpoint' ).length < 1 ) {
				$( 'body' ).append( '<span id="lsvr-media-query-breakpoint" style="display: none;"></span>' );
			}
			var value = $( '#lsvr-media-query-breakpoint' ).css( 'font-family' );
			if ( typeof value !== 'undefined' ) {
				value = value.replace( "\"", "" ).replace( "\"", "" ).replace( "\'", "" ).replace( "\'", "" );
			}
			if ( isNaN( value ) ) {
				return $( window ).width();
			}
			else {
				return parseInt( value );
			}

		};
	}

	var lsvrTownpressMediaQueryBreakpoint;
	if ( $.fn.lsvrTownpressGetMediaQueryBreakpoint ) {
		lsvrTownpressMediaQueryBreakpoint = $.fn.lsvrTownpressGetMediaQueryBreakpoint();
		$(window).on( 'resize', function(){
			if ( $.fn.lsvrTownpressGetMediaQueryBreakpoint() !== lsvrTownpressMediaQueryBreakpoint ) {
				lsvrTownpressMediaQueryBreakpoint = $.fn.lsvrTownpressGetMediaQueryBreakpoint();
				$.event.trigger({
					type: 'lsvrTownpressScreenTransition',
					message: 'Screen transition completed.',
					time: new Date()
				});
			}
		});
	}
	else {
		lsvrTownpressMediaQueryBreakpoint = $(document).width();
	}

	/* -------------------------------------------------------------------------
		LEAFLET MAP
	-------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrTownpressMapLeaflet ) {
		$.fn.lsvrTownpressMapLeaflet = function() {

			// Prepare params
			var $this = $(this),
				mapProvider = $this.data( 'map-provider' ) ? $this.data( 'map-provider' ) : 'osm',
				zoom = $this.data( 'zoom' ) ? $this.data( 'zoom' ) : 17,
				enableMouseWheel = $this.data( 'mousewheel' ) && true === String( $this.data( 'mousewheel' ) ) ? true : false,
				elementId = $this.attr( 'id' ),
				address = $this.data( 'address' ) ? $this.data( 'address' ) : false,
				latLong = $this.data( 'latlong' ) ? $this.data( 'latlong' ) : false,
				latitude = false, longitude = false;

			// Parse latitude and longitude
			if ( false !== latLong ) {
				var latLongArr = latLong.split( ',' );
				if ( latLongArr.length == 2 ) {
					latitude = latLongArr[0].trim();
					longitude = latLongArr[1].trim();
				}
			}

			// Proceed only if latitude and longitude were obtained
			if ( false !== latitude && false !== longitude ) {

				// Prepare map options
				var mapOptions = {
					center : [ latitude, longitude ],
					zoom : zoom,
					scrollWheelZoom : enableMouseWheel,
				};

				// Init the map object
				var map = L.map( elementId, mapOptions );
				$this.data( 'map', map );

				// Load tiles from Mapbox
				if ( 'mapbox' === mapProvider ) {

					var apiKey = typeof lsvr_townpress_mapbox_api_key !== 'undefined' ? lsvr_townpress_mapbox_api_key : false;
					if ( false !== apiKey ) {

						L.tileLayer( 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + apiKey, {
							attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
							id: 'mapbox/streets-v11',
							tileSize: 512,
							zoomOffset: -1,
							accessToken: apiKey
						}).addTo( map );

					}

				}

				// Load tiles from Open Street Map
				else if ( 'osm' === mapProvider ) {

					L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
					    subdomains: ['a','b','c']
					}).addTo( map );

				}

				// Marker HTML
	 			var marker = L.divIcon({
	 				iconAnchor : [15, 40],
	 				className : 'c-map__marker-wrapper',
	 				html : '<div class="c-map__marker"><div class="c-map__marker-inner"></div></div>'
	        	});

				// Add marker
				L.marker([ latitude, longitude ], {
					icon : marker
				}).addTo(map);

				// Remove loading
				$this.removeClass( 'c-map__canvas--loading' );
				$this.parent().find( '.c-spinner' ).fadeOut( 200,
					function() {
						$(this).remove();
					}
				);

			}

			// Otherwise hide the map
			else {
				$this.hide();
			}

		};
	}

	/* -------------------------------------------------------------------------
		GOOGLE MAP
	-------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrTownpressMapGmaps ) {
		$.fn.lsvrTownpressMapGmaps = function() {

			// Prepare params
			var $this = $(this),
				mapType = $this.data( 'maptype' ) ? $this.data( 'maptype' ) : 'terrain',
				zoom = $this.data( 'zoom' ) ? $this.data( 'zoom' ) : 17,
				enableMouseWheel = $this.data( 'mousewheel' ) && true === String( $this.data( 'mousewheel' ) ) ? true : false,
				elementId = $this.attr( 'id' ),
				address = $this.data( 'address' ) ? $this.data( 'address' ) : false,
				latLong = $this.data( 'latlong' ) ? $this.data( 'latlong' ) : false,
				latitude = false, longitude = false;

			// Parse latitude and longitude
			if ( false !== latLong ) {
				var latLongArr = latLong.split( ',' );
				if ( latLongArr.length == 2 ) {
					latitude = latLongArr[0].trim();
					longitude = latLongArr[1].trim();
				}
			}

			// Load Google Maps API
			if ( $.fn.lsvrTownpressLoadGoogleMapsApi ) {
				$.fn.lsvrTownpressLoadGoogleMapsApi();
			}

			// Set basic API settings
			var apiSetup = function() {

				// Get map type
				switch ( mapType ) {
					case 'roadmap':
						mapType = google.maps.MapTypeId.ROADMAP;
						break;
					case 'satellite':
						mapType = google.maps.MapTypeId.SATELLITE;
						break;
					case 'hybrid':
						mapType = google.maps.MapTypeId.HYBRID;
						break;
					default:
						mapType = google.maps.MapTypeId.TERRAIN;
				}

				// Prepare map options
				var mapOptions = {
					'zoom' : zoom,
					'mapTypeId' : mapType,
					'scrollwheel' : enableMouseWheel,
				};

				// Set custom styles
				if ( 'undefined' !== typeof lsvr_townpress_google_maps_style_json ) {
					mapOptions.styles = JSON.parse( lsvr_townpress_google_maps_style_json );
				}
				else if ( 'undefined' !== typeof lsvr_townpress_google_maps_style ) {
					mapOptions.styles = lsvr_townpress_google_maps_style;
				}

				// Init the map object
				var map = new google.maps.Map( document.getElementById( elementId ),
					mapOptions );
				$this.data( 'map', map );

				// If latitude and longitude were obtained, center the map
				if ( false !== latitude && false !== longitude ) {
					var location = new google.maps.LatLng( latitude, longitude );
 					map.setCenter( location );
 					var marker = new google.maps.Marker({
            			position: location,
            			map: map
        			});
 					$this.removeClass( 'c-map__canvas--loading' );
 					$this.parent().find( '.c-spinner' ).fadeOut( 200,
 						function() {
 							$(this).remove();
 						}
					);
				}

				// Otherwise hide the map
				else {
					$this.hide();
				}

			};

			// Check if API is already loaded, if not, wait for trigger
			if ( 'object' === typeof google && 'object' === typeof google.maps ) {
				apiSetup();
			}
			else {
				$( document ).on( 'lsvrTownpressGoogleMapsApiLoaded', function() {
					apiSetup();
				});
			}

		};
	}

	/* -------------------------------------------------------------------------
		LOAD GOOGLE MAPS API
	-------------------------------------------------------------------------- */

	if ( ! $.fn.lsvrTownpressLoadGoogleMapsApi ) {
		$.fn.lsvrTownpressLoadGoogleMapsApi = function() {

			// Check if Google Maps API isn't already loaded
			if ( ! $( 'body' ).hasClass( 'lsvr-google-maps-api-loaded' ) ) {

				// Check if Google Maps API object doesn't already exists
				if ( 'object' === typeof google && 'object' === typeof google.maps ) {
					$.fn.lsvrTownpressGoogleMapsApiLoaded();
				}

				// If there is not existing instance of Google Maps API, let's create it
				else if ( ! $( 'body' ).hasClass( 'lsvr-google-maps-api-being-loaded' ) ) {

					$( 'body' ).addClass( 'lsvr-google-maps-api-being-loaded' );

					var script = document.createElement( 'script' ),
						apiKey = typeof lsvr_townpress_google_api_key !== 'undefined' ? lsvr_townpress_google_api_key : false,
						language = $( 'html' ).attr( 'lang' ) ? $( 'html' ).attr( 'lang' ) : 'en';

					// Parse language
					language = language.indexOf( '-' ) > 0 ? language.substring( 0, language.indexOf( '-' ) ) : language;

					// Append the script
					if ( apiKey !== false ) {
						script.type = 'text/javascript';
						script.src = 'https://maps.googleapis.com/maps/api/js?language=' + encodeURIComponent( language ) + '&key=' + encodeURIComponent( apiKey ) + '&callback=jQuery.fn.lsvrTownpressGoogleMapsApiLoaded';
						document.body.appendChild( script );
					}

				}

			}

		};
	}

	// Trigger event
	if ( ! $.fn.lsvrTownpressGoogleMapsApiLoaded ) {
		$.fn.lsvrTownpressGoogleMapsApiLoaded = function() {

			// Make sure that Google Maps API object does exist
			if ( 'object' === typeof google && 'object' === typeof google.maps ) {

				// Trigger the event
				$.event.trigger({
					type: 'lsvrTownpressGoogleMapsApiLoaded',
					message: 'Google Maps API is ready.',
					time: new Date()
				});

				// Add class to BODY element
				$( 'body' ).removeClass( 'lsvr-google-maps-api-being-loaded' );
				$( 'body' ).addClass( 'lsvr-google-maps-api-loaded' );

			}

		};
	}

})(jQuery);