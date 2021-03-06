/**********************************
 * feed.map_ol2.js
 *
 * Map feature module for OpenLayers2 lib
 *
                 XXXX
                X    XX
               X  ***  X              XXXXX
             X  *****  X           XXX     XX
         XXXX ******* XXX      XXXX          XX
       XX   X ******  XXXXXXXXX                XX XXX
     XX      X ****  X                           X** X       ***************************************
    X        XX    XX     X                      X***X      *  ___ ____              ___
   X         //XXXX       X                      XXXX       *   |   |     \        /  |   |    |
  X         //   X                             XX          **   |   |      \  /\  /   |   |    |
 X         //    X          XXXXXXXXXXXXXXXXXX/         ***    _|_  |       \/  \/   _|_  |___ |___
 X     XXX//    X          X                          **                        _____    _______
 X    X   X     X         X                  *********        |    |  |     |  |     \      |     |
 X    X    X    X        X                           **       |____|  |     |  |_____/      |     |
  X   X    X    X        X                    XX      **      |    |  |     |  |     \      |     |
  X    X   X    X        X                 XXX  XX     **     |    |  |_____|  |      \     |     o
   X    XXX      X        X               X  X X  X     **
   X             X         X              XX X  XXXX      *******************************************
    X             X         XXXXXXXX/     XX   XX  X
     XX            XX              X     X    X  XX
       XX            XXXX   XXXXXX/     X     XXXX
         XXX             XX***         X     X
            XXXXXXXXXXXXX *   *       X     X
                         *---* X     X     X
                        *-* *   XXX X     X
                       *- *       XXX   X
                       *- *X          XXX
                       *- *X  X          XXX
                      *- *X    X            XX
                      *- *XX    X             X
                     *  *X* X    X             X
                     *  *X * X    X             X
                    *  * X**  X   XXXX          X
                    *  * X**  XX     X          X
                   *  ** X** X     XX          X
                   *  **  X*  XXX   X         X
                  *  **    XX   XXXX       XXX
                 *  * *      XXXX     X      X
                *   * *          X    X      X
  =======*******   * *           X    X       XXXXXXXX/
             *     * *      /XXXXX     XXXXXXXXX/      )
    =====**********  *     X                     )  /  )
      ====*         *     X              /  /    )XXXXX
 =========**********       XXXXXXXXXXXXXXXXXXXXXX

 *********************************/


/*jslint        browser : true, continue: true,
  devel : true, indent  : 4,    maxerr  : 50,
  newcap: true, nomen   : true, plusplus: true,
  regexp: true, sloppy  : true, vars    : true,
  white : true
*/
/*global $, feed */

feed.map = (function () {
    'use strict';
  //--------------------- MODULE SCOPE VARIABLES ----------------
  var
    configMap   = {
      //doc_path : '/media/doc/', // have to be idem to feed.sidebar.js TODO : put outside of this file
      settable_map : {
        map_model           : true,
        people_model        : true,
        reports_model       : true,
        set_map_anchor      : true,
        doc_path            : true
      },
      map_model             : null,
      people_model          : null,
      reports_model         : null,
      set_content_anchor    : null
    },
    stateMap    = {
      map                   : null,
      $mapdiv               : null,
      current_marker        : null,
      current_popup         : null,
      marker_hover          : null,
      marker_clicked        : null,
      new_marker            : null,
      drag_enable           : false
    },
    ol2Map  = {},

    setOl2Map,      setMarkerPosition,  getMarker,          setMarker,
    clearMarkers,   setPopup,           hideCurrentPopup,   onSetReport,
    onListchange,   onHoverList,        onLogout,
    configModule,   initModule;
  //--------------------- eo Module scope -----------------------
  
  //--------------------- UTILITY METHODS -----------------------

  //--------------------- eo utility methods --------------------
  //--------------------- DOM METHODS ---------------------------
  // DOM method /setOl2Map/
  //
  setOl2Map = function () {
    var
        styleMarker, styleNew, styleSelect, layer_markers, layer_new, layer_select, 
        layerListeners, dragMarkers, dragNew, clickFeature,
	    $map 	    = stateMap.map,
	    $map_div    = stateMap.$mapdiv,
	    size	    = new OpenLayers.Size(21,25),
	    offset 	    = new OpenLayers.Pixel(-(size.w/2), -size.h)
    ;

    styleMarker     = new OpenLayers.StyleMap({
        'default'   : {
            //externalGraphic:markerInfo.icon,
            fillColor       : '#ff0',
            fillOpacity     : 0.9,
            graphicWidth    : 24,
            graphicHeight   : 24,
            strokeColor     : "#ee9900",
            strokeOpacity   : 1,
            strokeWidth     : 1,
            pointRadius     : 7,
            title           : '${tooltip}'
        },
        'over'      : {
            fillColor       : '#ff0',
            fillOpacity     : 0.9,
            graphicWidth    : 24,
            graphicHeight   : 24,
            strokeColor     : "#ee9900",
            strokeOpacity   : 1,
            strokeWidth     : 3,
            pointRadius     : 7,
            graphicZIndex   : 200,
            title           : '${tooltip}'
        },
        'selected'  : OpenLayers.Util.applyDefaults(
            { pointRadius     : 5 },
            OpenLayers.Feature.Vector.style.default
        )
    });

    styleNew        = new OpenLayers.StyleMap({
        'default'   : OpenLayers.Util.applyDefaults(
            { fillColor : '#ff0000', fillOpacity : 1, graphicZIndex : 2000 },
            OpenLayers.Feature.Vector.style.default
        )
    });

    styleSelect     = new OpenLayers.StyleMap({
        'default'   : OpenLayers.Util.applyDefaults(
            { fillColor : '#ff0000', fillOpacity : 1, pointRadius : 8, graphicZIndex : 2000 },
            OpenLayers.Feature.Vector.style.select
        )
    });

    layerListeners  = {
        featureclick    : function(e) {
            var mark_sel = e.feature
            ;
console.log("featureclick e.feature.popup.id: " + e.feature.popup.id);
            if ( stateMap.current_popup ) {
console.log("featureclick stateMap.current_popup.id: " + stateMap.current_popup.id);            
                if ( stateMap.current_popup.id !== e.feature.popup.id ) {
                    hideCurrentPopup();
                }
                else {
                    ol2Map.$click_feature.unselectAll();
                    stateMap.marker_clicked = null;
                }
            }
            
            e.feature.popup.toggle();

            if ( e.feature.popup.visible() ) {
                stateMap.current_popup = e.feature.popup;
            }
            return false;
        },
        nofeatureclick  : function( e ) {
           hideCurrentPopup();
        },
        featureover     : function( e ) {
           var feat     = e.feature,
                id      = feat.attributes.id;

            if ( feat.renderIntent == "default" ) {
                e.feature.renderIntent = "over";
                e.feature.layer.drawFeature( e.feature );
            }

            if ( stateMap.drag_enable && stateMap.current_marker && stateMap.current_marker.attributes.id === id ) {
                dragMarkers.activate();
            }
            else {
                dragMarkers.deactivate();
            }
            $.gevent.publish( 'feed-hover', id );
        },
        featureout      : function(e) {
            // if hover not the clicked marker : renderIntent => default
            if ( e.feature.renderIntent == "over" ) {
                if ( stateMap.marker_clicked ) {
                    if ( e.feature.id !== stateMap.marker_clicked.id ) {
                        e.feature.renderIntent = "default";
                        e.feature.layer.drawFeature(e.feature);
                    }
                }
                else {
                    e.feature.renderIntent = "default";
                    e.feature.layer.drawFeature(e.feature);
                }
            }
            $.gevent.publish( 'feed-hover', '' );
        }
    };

    layer_markers   = new OpenLayers.Layer.Vector("layer_markers", {
        styleMap        : styleMarker,
        eventListeners  : layerListeners
    });
    layer_new       = new OpenLayers.Layer.Vector("layer_new", { 
        styleMap        : styleNew
    });
    layer_select    =  new OpenLayers.Layer.Vector("layer_select", {
        styleMap        : styleSelect
     });
    
    dragMarkers     = new OpenLayers.Control.DragFeature( layer_markers, {
        onStart         : function( feat, pix ) {
            if ( stateMap.drag_enable ) {
                hideCurrentPopup();
            }
            else {
                return;
            }
        },
        onDrag          : function( feat, pix ) {
            $.gevent.publish( 'feed-setcoord', { x: feat.geometry.x.toFixed(0), y: feat.geometry.y.toFixed(0) } );
        },
        onComplete      : function( feat, pix ) {
            var 
                tmp_marker,
                new_map = { locate_map: {} },
                report = configMap.reports_model.get_by_cid( feat.data.id );
            
            ol2Map.$layer_select.destroyFeatures();

            new_map.id              = feat.data.id;
            new_map.locate_map.x    = feat.geometry.x.toFixed(0);
            new_map.locate_map.y    = feat.geometry.y.toFixed(0);

            if ( report ) {
                new_map.title   = report.title;
                new_map.img     = report.img;
                new_map.doc     = report.doc;
            }

            tmp_marker = new OpenLayers.Feature.Vector( new OpenLayers.Geometry.Point( new_map.locate_map.x, new_map.locate_map.y ) );
            ol2Map.$layer_select.addFeatures( [ tmp_marker ] );

            feat.popup.setContentHTML( setPopup( new_map ) );
            feat.popup.lonlat.lon = feat.geometry.x;
            feat.popup.lonlat.lat = feat.geometry.y;
            //feat.popup.show();
            //stateMap.current_popup = feat.popup;
        }
    });
    stateMap.map.addControl( dragMarkers );

    stateMap.map.events.register( 'moveend', stateMap.map, function(evt){
        if( stateMap.new_marker ) {
            stateMap.new_marker.move( this.getCenter() ); 
            $.gevent.publish( 'feed-coord', { x: stateMap.new_marker.geometry.x.toFixed(0), y: stateMap.new_marker.geometry.y.toFixed(0) } );
        }
    });
/*    
    dragNew         = new OpenLayers.Control.DragFeature( layer_new, {
        onDrag      : function( feat, pix ) {
            $.gevent.publish( 'feed-coord', { x: feat.geometry.x.toFixed(1), y: feat.geometry.y.toFixed(1) } );
        }
    });
    stateMap.map.addControl( dragNew );
    dragNew.activate();
*/

    clickFeature   = new OpenLayers.Control.SelectFeature( layer_markers, {
        renderIntent: 'over',
        clickout    : true,
        toggle      : true,
        multiple    : false
    });
    stateMap.map.addControl( clickFeature );
    clickFeature.activate();
    
    stateMap.map.addLayer( layer_select );
    stateMap.map.addLayer( layer_new );
    stateMap.map.addLayer( layer_markers );

/* Test values *
    var marker1 = new OpenLayers.Feature.Vector(
                    new OpenLayers.Geometry.Point( 607349, 5389815 ),
                                    { id : '150802_10', title : 'titre 1' }
                                                );
    var marker2 = new OpenLayers.Feature.Vector(
                    new OpenLayers.Geometry.Point( 605349, 5379999 ),
                                    { id : '150708_11', title : 'titre 5' }
                                                );
layer_markers.addFeatures( [marker1, marker2] );                                                
/* eo test */

    ol2Map = {
	    $layer_markers	: layer_markers,
    	$layer_new	    : layer_new,
        $layer_select   : layer_select,
	    $map_div	    : $map_div,
    	$marker_list    : [],
        $click_feature  : clickFeature,
        $styleMarker    : styleMarker
  //      $report_list    : { "type": "FeatureCollection", "features": [] },
  //  	$icon_red       : new OpenLayers.Icon('http://dev.openlayers.org/releases/OpenLayers-2.6/img/marker.png',size,offset),
//	    $icon_green     : new OpenLayers.Icon('http://dev.openlayers.org/releases/OpenLayers-2.6/img/marker-green.png',size,offset),
  //  	$icon_blue      : new OpenLayers.Icon('http://dev.openlayers.org/releases/OpenLayers-2.6/img/marker-blue.png',size,offset)
    }
  };

  // call by the shell when the tab change
  //
  setMarkerPosition = function ( position_type, tab_name, callback ) {
  	var marker, center;
	switch ( position_type ) {
		case 'opened' :
			if ( tab_name === 'create' ) {
                center = stateMap.map.getCenter();
			
                stateMap.new_marker = new OpenLayers.Feature.Vector( new OpenLayers.Geometry.Point( center.lon, center.lat ) );
				ol2Map.$layer_new.addFeatures( [ stateMap.new_marker ] );
                
                
				$.gevent.publish( 'feed-coord', { x: stateMap.new_marker.geometry.x.toFixed(0), y: stateMap.new_marker.geometry.y.toFixed(0) } );
			}
			else {
				ol2Map.$layer_new.removeAllFeatures();
				stateMap.new_marker = null;
			}
			if ( tab_name === 'report' ) {
				stateMap.drag_enable = true;
			}
			else {
				stateMap.drag_enable = false;
			}
		break;
		case 'hidden' : 
			if ( stateMap.new_marker ) {
				ol2Map.$layer_new.removeMarker( stateMap.new_marker );
			}
		break;
		case 'closed' :
			if ( stateMap.new_marker ) {
				ol2Map.$layer_new.removeMarker( stateMap.new_marker );
			}
		break;
		default : return false;
	}
  };

  getMarker = function( report_id ) {
    var marker = null;

    if ( report_id ) {
        marker = ol2Map.$marker_list[ report_id ]; 
    }
    return marker;
  };

  // modify and move the marker according to the 
  // selected report modifications.
  // The selected marker becomes the stateMap.current_marker
  setMarker = function( report_id ) {
    var marker, tmp_marker, report, popup, move;
console.log("setMarker ");
    if ( report_id ) {
      marker = getMarker( report_id );

      if ( marker ) {
        stateMap.current_marker = marker;
        tmp_marker = new OpenLayers.Feature.Vector( new OpenLayers.Geometry.Point( marker.geometry.x, marker.geometry.y ) );
        ol2Map.$layer_select.addFeatures( [ tmp_marker ] );
        
        stateMap.current_marker.renderIntent = 'selected';
        ol2Map.$layer_markers.drawFeature( stateMap.current_marker );

        popup = ol2Map.$marker_list[ marker.data.id ].popup;
        stateMap.current_popup = popup;
console.log("setMarker stateMap.current_popup.id: " + stateMap.current_popup.id);
        report = configMap.reports_model.get_by_cid( report_id );

        if ( report ) {
            move = new OpenLayers.LonLat( report.locate_map.x, report.locate_map.y );
            marker.move( move );
            tmp_marker.move( move );
            stateMap.map.panTo( [ report.locate_map.x, report.locate_map.y ] );
        }
        else {
            stateMap.map.panTo( [ marker.geometry.x, marker.geometry.y ] );
        }

        //popup.show();
      }
    }
  };

  clearMarkers = function () {
//    ol2Map.$click_feature.unselectAll();
//console.dir(ol2Map.$click_feature.selectedFeatures);    
    ol2Map.$layer_select.destroyFeatures();
    if ( stateMap.current_marker ) {
        stateMap.current_marker.renderIntent = 'default';
        ol2Map.$layer_markers.drawFeature( stateMap.current_marker );
        stateMap.current_marker = null;
    }

    hideCurrentPopup();
  };

  setPopup = function ( popup_map ) {
    var
      popup_html = String()
        + '<span id="marker-popup">'
        + ' <strong>' + popup_map.id + '</strong><br/>'
        + ' <em>' + feed.util_b.encodeHtml( popup_map.title ) + '</em><br/>';

    if ( popup_map.doc ) {
      
      if ( (/\.(gif|jpg|jpeg|tiff|png)$/i).test(popup_map.doc) ) {
        popup_html += '<a data-toggle="modal"><img class="feed-map-popup-img img-responsive img-thumbnail center-block" alt="No image" src="' + configMap.doc_path + popup_map.doc + '"></a>'
      }
      else {
        popup_html += '<div><a href="' + configMap.doc_path + popup_map.doc + '" target="_blank">' + popup_map.doc + '</a></div>'
      }
    }
    popup_html += ' <small>Lon: ' + popup_map.locate_map.x + ' - Lat: ' + popup_map.locate_map.y + '</small></span>';

    return popup_html;
  };

  hideCurrentPopup = function () {
console.log("hideCurrentPopup ");
    if ( stateMap.current_popup ) {
console.log("hideCurrentPopup stateMap.current_popup.id: " + stateMap.current_popup.id);    
        stateMap.current_popup.hide();
        stateMap.current_popup = null;
    }
  };

  //--------------------- eo dom methods ------------------------
  //--------------------- EVENT HANDLERS ------------------------
  // event handler for the feed-setreport model event. Selects the
  // new marker and deselects the old one.
  //
  onSetReport = function ( event, arg_map ) {
    var marker;

    clearMarkers();

    if ( arg_map.new_report ) {
        marker = getMarker( arg_map.new_report.id );
        
        if ( marker ) { 
            setMarker( marker.attributes.id ); 
        }

        // the same report is asked so reload it
        if ( arg_map.new_report == arg_map.old_report ) {
            stateMap.current_popup.setContentHTML( setPopup( arg_map.new_report ) );
            // TODO
            stateMap.current_popup.lonlat.lon = arg_map.new_report.locate_map.x;
            stateMap.current_popup.lonlat.lat = arg_map.new_report.locate_map.y;
        }
    }
    return false;
  };

  // event handler for the feed-listchange model event.
  // renders the markers list, highlighted the current marker if defined
  //
  onListchange = function( event ) {
        var 
            reports_db      = configMap.reports_model.get_db(),
            current_report  = configMap.reports_model.get_current(),
            features        = [];


        ol2Map.$layer_markers.removeAllFeatures();

        reports_db().each( function ( report, idx ) {
            var 
                marker, popup, 
                new_map = { locate_map: {} };

            new_map.id              = report.id;
            new_map.locate_map.x    = report.locate_map.x;
            new_map.locate_map.y    = report.locate_map.y;
            new_map.title           = feed.util_b.encodeHtml( report.title );
            new_map.img             = report.img;
            new_map.doc             = report.doc;

            marker                  = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point( report.locate_map.x, report.locate_map.y ),
                { id : report.id, tooltip : report.id } // tooltip is used by the layer style
            );

            popup                   = new OpenLayers.Popup.FramedCloud(report.id,
                OpenLayers.LonLat.fromString(marker.geometry.toShortString()),
                null,
                setPopup( new_map ),
                null, 
                true,
                function( e ){ 
//console.dir(e);
                    hideCurrentPopup(); 
                }
            );
            popup.panMapIfOutOfView             = false;
            popup.autoSize                      = true;
            popup.keepInMap                     = true;
            popup.disableFirefoxOverflowHack    = true;
            marker.popup                        = popup;

            stateMap.map.addPopup( marker.popup );
            marker.popup.hide();

            features.push( marker );
            ol2Map.$marker_list[ report.id ] = marker;
        });
        ol2Map.$layer_markers.addFeatures( features );
        
        if ( current_report ) {
            setMarker( current_report.id );
        }
        return false;
  };

  // event handler for the feed-listhover sidebar event.
  // renders the marker 'over' if not selected before or 
  // deselect if no marker_id
  //
  onHoverList = function ( event, marker_id ) {
    var mark_sel, 
        toRender = false;
    
    // if hover a marker
    if ( marker_id ) {
        mark_sel = getMarker( marker_id );
        // if a marker selected
        if ( stateMap.current_marker ) {
            // if is different as the hover
            if ( mark_sel && mark_sel.id !== stateMap.current_marker.id ) {
                toRender = true;
            }
            // if hover = selected : nothing to do but remind the marker_hover
            else {
                stateMap.marker_hover = mark_sel;
            }
        }
        // if no marker selected
        else {
            toRender = true;
        }
    }
    // if no marker hover
    else {
        // if a marker was hover
        if ( stateMap.marker_hover ) {
            // if a marker selected
            if ( stateMap.current_marker ) {
                // if the marker is not selected
                if ( stateMap.marker_hover.id !== stateMap.current_marker.id ) {
                    stateMap.marker_hover.renderIntent = "default";
                    ol2Map.$layer_markers.drawFeature( stateMap.marker_hover );
                    ol2Map.$click_feature.unselectAll();
                }
            }
            else {
                stateMap.marker_hover.renderIntent = "default";
                ol2Map.$layer_markers.drawFeature( stateMap.marker_hover );
                ol2Map.$click_feature.unselectAll();
            }
            stateMap.marker_hover = null;
        }
    }
    if ( toRender ) {
        mark_sel.renderIntent = "over";
        ol2Map.$layer_markers.drawFeature( mark_sel );
        stateMap.marker_hover = mark_sel;
    }
  };

  onLogout = function ( event, logout_user ) {
    leafletMap.$layer_markers.clearLayers();
  };
  //--------------------- eo event handlers ---------------------

  //--------------------- PUBLIC METHODS ------------------------
  // Public method /configModule/
  // Example   : feed.map.configModule({  });
  // Purpose   : Adjust configuration of allowed keys to initialization
  // Arguments :
  //   * set_map_anchor - a callback to modify the URI anchor to
  //      indicate the state. This callback must return
  //      false if the requested state cannot be met
  //   * sidebar_model - the sidebar model object provides methods
  //      to interact with our instant report and user
  //   * people_model - the people model object which provides
  //      methods to manage the list of people the model maintains
  //   * reports_model - the reports model object wich provides
  //      methods to manage the list of reports the model maintains
  //   * page_* settings. All these are optional scalars.
  //      See mapConfig.settable_map for a full list
  //      Example: ####
  // Action    :
  //   The internal configuration data structure (configMap) is
  //   updated with provided arguments. No other actions are taken.
  // Returns   : true
  // Throws    : JavaScript error object and stack trace on
  //             unacceptable or missing arguments
  //
  configModule = function ( input_map ) {
      feed.util.setConfigMap({
          input_map   : input_map,
          settable_map: configMap.settable_map,
          config_map  : configMap
      });
      return true;
  }; // eo /configModule/

  // Public method /initModule/
  // Example : feed.sidebar.initModule( $('#div_id') );
  // Purpose :
  // Directs Content to offer its capability to the user
  // Arguments :
  // * $append_target (example: $('#container')).
  // A jQuery collection that should represent
  // a single DOM container
  // Action :
  // Appends the sidebar to the provided container and fills
  // it with HTML sidebar. It then initializes elements,
  // events, and handlers to provide the user with a sidebar
  // 
  // Returns : true on success, false on failure
  // Throws : none
  //
  initModule = function ( append_target ) {
    // TODO : trouver le moyen de recuperer #map a partir de $append_target qui correspond a l'objet map
    var $map = $('#mappanel');
    
    stateMap.map        = append_target;
    stateMap.$mapdiv    = $map; // append_target.getContainer();

    setOl2Map();

    $.gevent.subscribe( $map, 'feed-listchange', onListchange );
    $.gevent.subscribe( $map, 'feed-setreport', onSetReport );
    $.gevent.subscribe( $map, 'feed-logout', onLogout );
    $.gevent.subscribe( $map, 'feed-listhover', onHoverList );

  }; // eo /initModule/
  return {
    setMarkerPosition   : setMarkerPosition,
    configModule        : configModule,
    initModule          : initModule
  };
  //--------------------- eo public methods ---------------------
}());


