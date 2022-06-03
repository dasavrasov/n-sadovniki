(function($){ "use strict";

	// Actions to fire after all resources are loaded
	$(document).ready(function() {

		// Init directory map
		if ( $.fn.lsvrTownpressDirectoryMapLeaflet && 'object' === typeof L ) {
			$( '.lsvr_listing-map--leaflet #lsvr_listing-map__canvas' ).each(function() {
				$(this).lsvrTownpressDirectoryMapLeaflet();
			});
		}

	});

	// Main directory map
	if ( ! $.fn.lsvrTownpressDirectoryMapLeaflet ) {

		// Ajax request var
		var lsvrTownpressDirectoryMapLeafletAjaxRequest;

		// Plugin methods
		var lsvrTownpressDirectoryMapLeafletMethods = {

			// Init map
			init : function() {

				// Prepare params
				var $this = $(this),
					zoom = $this.data( 'zoom' ) ? $this.data( 'zoom' ) : 17,
					enableMouseWheel = $this.data( 'mousewheel' ) && true === String( $this.data( 'mousewheel' ) ) ? true : false,
					elementId = $this.attr( 'id' ),
					query = $this.data( 'query' ) ? $this.data( 'query' ) : {};

				// Prepare map options
				var mapOptions = {
					zoom : zoom,
					scrollWheelZoom : enableMouseWheel,
				};

				// Init the map object
				var map = L.map( elementId, mapOptions );
				$this.data( 'map', map );

		        // Make ajax request
		        $this.lsvrTownpressDirectoryMapLeaflet( 'ajaxRequest', query );

			},

			// Ajax request
			ajaxRequest : function( query ) {
				if ( typeof query != 'undefined' ) {

					var $this = this;

			        if ( typeof lsvr_townpress_ajax_directory_map_var !== 'undefined' ) {

						if ( 'undefined' !== typeof lsvrTownpressDirectoryMapLeafletAjaxRequest ) {
							lsvrTownpressDirectoryMapLeafletAjaxRequest.abort();
						}
			        	lsvrTownpressDirectoryMapLeafletAjaxRequest = jQuery.ajax({
			            	type: 'post',
			            	dataType: 'JSON',
			            	url: lsvr_townpress_ajax_directory_map_var.url,
			            	data: {
			            		action : 'lsvr-townpress-ajax-directory-map',
			            		nonce : encodeURIComponent( lsvr_townpress_ajax_directory_map_var.nonce ),
			            		query : query,
			            	},
			            	success: function( response ) {

			            		// Refresh the map with new data
			            		$this.lsvrTownpressDirectoryMapLeaflet( 'refresh', response );

			            	}
			            });

			        }

            	}
			},

			// Refresh map
			refresh : function( response ) {

				// Check for map object
				if ( this.data( 'map' ) ) {

					var $this = this,
						map = $this.data( 'map' ),
						zoom = $this.data( 'zoom' ),
						mapProvider = $this.data( 'map-provider' ) ? $this.data( 'map-provider' ) : 'osm';

					// Get locations data from response
					var responseLocations = response.hasOwnProperty( 'locations' ) ? response.locations : false,
						responseLabels = response.hasOwnProperty( 'labels' ) ? response.labels : false;

					// Check if there is at least one location
					if ( false !== responseLocations && responseLocations.length > 0 ) {

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

						// Prepare marker cluster
						var markerGroup = L.markerClusterGroup({
							iconCreateFunction : function( cluster ) {
								return L.divIcon({
									html : '<div class="lsvr_listing-map__marker-cluster"><div class="lsvr_listing-map__marker-cluster-inner">' + cluster.getChildCount() + '</div></div>'
								});
							},
							showCoverageOnHover: false
						});

	    				// Parse all markers
	    				for ( var i = 0; i < responseLocations.length; i++ ) {

	    					if ( responseLocations[ i ].hasOwnProperty( 'latitude' ) && responseLocations[ i ].hasOwnProperty( 'longitude' ) ) {

        						// Infobox HTML
	        					var boxHtml = '';

	        					if ( responseLocations[ i ].hasOwnProperty( 'thumburl' ) ) {
	        						boxHtml += '<div class="lsvr_listing-map__infobox lsvr_listing-map__infobox--has-thumb">';
	        					} else {
	        						boxHtml += '<div class="lsvr_listing-map__infobox">';
	        					}
	        					boxHtml += '<div class="lsvr_listing-map__infobox-inner">';

	        					// Thumb
	        					if ( responseLocations[ i ].hasOwnProperty( 'thumburl' ) && responseLocations[ i ].hasOwnProperty( 'permalink' ) ) {
									boxHtml += '<a href="' + responseLocations[ i ].permalink + '" class="lsvr_listing-map__infobox-thumb" style="background-image: url( \'' + responseLocations[ i ].thumburl + '\' ); "></a>';
	        					}

	        					// Category
	        					if ( responseLocations[ i ].hasOwnProperty( 'category' ) && 'undefined' !== typeof responseLabels.marker_infowindow_cat_prefix ) {
	        						var categoryHtml = '';
	        						for ( var j = 0; j < responseLocations[ i ].category.length; j++ ) {
	        							if ( responseLocations[ i ].category[ j ].hasOwnProperty( 'name' ) && responseLocations[ i ].category[ j ].hasOwnProperty( 'url' ) ) {
											categoryHtml += '<a href="' + responseLocations[ i ].category[ j ].url + '" class="lsvr_listing-map__infobox-category-link">' + responseLocations[ i ].category[ j ].name + '</a>';
											if ( j < responseLocations[ i ].category.length - 1 ) {
												categoryHtml += ', ';
											}
	        							}
	        						}
	        						boxHtml += '<p class="lsvr_listing-map__infobox-category">' + responseLabels.marker_infowindow_cat_prefix.replace( '%s', categoryHtml ) + '</p>';
	        					}

	        					// Title
	        					if ( responseLocations[ i ].hasOwnProperty( 'title' ) && responseLocations[ i ].hasOwnProperty( 'permalink' ) ) {
									boxHtml += '<h4 class="lsvr_listing-map__infobox-title">';
									boxHtml += '<a href="' + responseLocations[ i ].permalink + '" class="lsvr_listing-map__infobox-title-link">' + responseLocations[ i ].title;
									boxHtml +='</a></h4>';
	        					}

	        					// Address
	        					if ( responseLocations[ i ].hasOwnProperty( 'address' ) ) {
	        						boxHtml +='<p class="lsvr_listing-map__infobox-address">' + responseLocations[ i ].address.replace( /(?:\r\n|\r|\n)/g, '<br>' ) + '</p>';
	        					}

	        					// More
	        					if ( 'undefined' !== typeof responseLabels.marker_infowindow_more_link && responseLocations[ i ].hasOwnProperty( 'permalink' ) ) {
									boxHtml += '<p class="lsvr_listing-map__infobox-more"><a href="' + responseLocations[ i ].permalink + '" class="lsvr_listing-map__infobox-more-link">' + responseLabels.marker_infowindow_more_link + '</a></p>';
	        					}

	        					boxHtml += '</div></div>';

	    						// Marker with thumb
		    					if ( responseLocations[ i ].hasOwnProperty( 'thumburl' ) ) {

		    						markerGroup.addLayer(

										L.marker( [ responseLocations[ i ].latitude, responseLocations[ i ].longitude ],
											{ icon : L.divIcon(
												{
													popupAnchor : [0, -50],
													iconAnchor : [15, 40],
													className : 'lsvr_listing-map__marker-wrapper',
													html : '<div class="lsvr_listing-map__marker lsvr_listing-map__marker--has-thumb lsvr_listing-map__marker--id-' + responseLocations[ i ].id + '"><div class="lsvr_listing-map__marker-inner lsvr_listing-map__marker-inner--has-thumb" style="background-image: url(\'' + responseLocations[ i ].thumburl + '\');"></div></div>'
												}
											)})
											.bindPopup( boxHtml )

									);

		    					}

		    					// Marker without thumb
		    					else {

	    							markerGroup.addLayer(

										L.marker( [ responseLocations[ i ].latitude, responseLocations[ i ].longitude ],
											{ icon : L.divIcon(
												{
													popupAnchor : [0, -40],
													iconAnchor : [15, 40],
													className : 'lsvr_listing-map__marker-wrapper',
													html : '<div class="class="lsvr_listing-map__marker lsvr_listing-map__marker--id-' + responseLocations[ i ].id + '"><div class="lsvr_listing-map__marker-inner"></div></div>'
												}
											)})
											.bindPopup( boxHtml )

									);

		    					}

							}

	    				}

 						// Add markers to map
						map.addLayer( markerGroup )
							.fitBounds( markerGroup.getBounds() );

	    				// If there is only single location on the map, set zoom
	    				if ( 1 === responseLocations.length ) {
	    					map.setZoom( zoom );
	    				}

						// Remove loading
						$this.removeClass( 'lsvr_listing-map__canvas--loading' );
						$this.parent().find( '.lsvr_listing-map__spinner' ).remove();

					}

					// If there are no locations to display, hide the map
					else {

						$this.parent().hide();

					}

				}

			}

		};

		// Plugin
		$.fn.lsvrTownpressDirectoryMapLeaflet = function( method ) {

			if ( lsvrTownpressDirectoryMapLeafletMethods[ method ] ) {
				return lsvrTownpressDirectoryMapLeafletMethods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
			} else {
				return lsvrTownpressDirectoryMapLeafletMethods.init.apply( this, arguments );
			}

		};

	}

})(jQuery);