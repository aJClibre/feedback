/**********************************
 * feed.map.js
 *
 * Map feature module
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
      //doc_path : 'doc/', // have to be idem to feed.sidebar.js TODO : put outside of this file
      settable_map : {
        map_model       : true,
        people_model    : true,
        reports_model   : true,
        set_map_anchor  : true,
        doc_path        : true
      },
      map_model           : null,
      people_model        : null,
      reports_model       : null,
      set_content_anchor  : null
    },
    stateMap    = {
      map             : null,
      $mapdiv         : null,
      current_marker  : null,
      drag_enable     : false
    },
    leafletMap  = {},

    setLeafletMap,  setMarkerPosition,  getMarker,    setMarker,
    clearMarkers,   setPopup,           onSetReport,
    onListchange,   onHoverList,        onLogout,
    configModule,   initModule;
  //--------------------- eo Module scope -----------------------
  
  //--------------------- UTILITY METHODS -----------------------
  //--------------------- eo utility methods --------------------

  //--------------------- DOM METHODS ---------------------------
  // DOM method /setJqueryMap/
  //
  setLeafletMap = function () {
    var 
      $map = stateMap.map,
      $map_div = stateMap.$mapdiv
    ;

    leafletMap = {
      $layer_markers  : L.featureGroup(),
      $layer_new      : L.marker(),
      // $popup          : L.DomUtil.create( 'div', 'tiny-popup', $map.getContainer() ),
      $map_div        : $map_div,
      $report_list    : { "type": "FeatureCollection", "features": [] },
      $marker_list    : [],
      $icon_red       : L.AwesomeMarkers.icon({icon: 'file', markerColor: 'red'}),
      $icon_orange    : L.AwesomeMarkers.icon({icon: 'file', markerColor: 'orange'}),
      $icon_blue      : L.AwesomeMarkers.icon({icon: 'file', markerColor: 'blue'})
    }
  };

  // call by the shell when the tab change
  //
  setMarkerPosition = function ( position_type, tab_name, callback ) {
    var marker;
    switch ( position_type ) {
      case 'opened' :
        if ( tab_name === 'create' ) {
          leafletMap.$layer_new = L.marker( stateMap.map.getCenter(), {
            draggable     : true,
            icon          : leafletMap.$icon_blue,
            zIndexOffset  : 3000,
            opacity       : 0.9,
            keyboard      : false,
            riseOnHover   : false
          }).on( 'drag', function(e) {
            $.gevent.publish( 'feed-coord', { x: e.target._latlng.lng.toFixed(3), y: e.target._latlng.lat.toFixed(3) } );
          }).addTo( stateMap.map );

          $.gevent.publish( 'feed-coord', { x: leafletMap.$layer_new.toGeoJSON().geometry.coordinates[0].toFixed(3), y: leafletMap.$layer_new.toGeoJSON().geometry.coordinates[1].toFixed(3) } );
        }
        else {
          if ( leafletMap.$layer_new ) {
            stateMap.map.removeLayer( leafletMap.$layer_new );
          }
        }
        if ( tab_name === 'report' ) {
          stateMap.drag_enable = true;

        }
        else {
          stateMap.drag_enable = false;
        }
      break;
      case 'hidden' : 
        if ( leafletMap.$layer_new ) {
          stateMap.map.removeLayer( leafletMap.$layer_new );
        }
      break;
      case 'closed' : 
      if ( leafletMap.$layer_new ) {
          stateMap.map.removeLayer( leafletMap.$layer_new );
        }
      break;
      default : return false;

    }
  };

  getMarker = function( report_id ) {
    var marker = null;

    if ( report_id ) {
      marker = leafletMap.$marker_list[ report_id ]; 
    }

    return marker;
  };

  setMarker = function( report_id ) {
    var marker, report, popu_html;

    if ( report_id ) {
      marker = getMarker( report_id );

      if ( marker ) {
        stateMap.current_marker = marker;
        marker.setIcon( leafletMap.$icon_orange );
        marker.setZIndexOffset( 2000 );

        report = configMap.reports_model.get_by_cid( report_id );

        if ( report ) {
          marker.setLatLng( [report.locate_map.y, report.locate_map.x] );
          stateMap.map.panTo( 
            L.latLng( report.locate_map.y, report.locate_map.x ), 
            { animate: true, duration: 0.8, easeLinearity: 1, noMoveStart: true }
          );
        }
        else {
          stateMap.map.panTo( marker.getLatLng(), { animate: true, duration: 0.8, easeLinearity: 1, noMoveStart: true });
        }

        marker.openPopup();
      }
    }
  };

  clearMarkers = function () {
    var i, feat;

    for ( i=0; i < leafletMap.$report_list.features.length; i++ ) {
      feat = leafletMap.$marker_list[ leafletMap.$report_list.features[i].id ];
      if (feat ) {
        feat.setIcon( leafletMap.$icon_red );
        feat.setZIndexOffset( 20 );
        feat.closePopup();
      }
    }
  };

  setPopup = function ( popup_map ) {
    var
      popup_html = String()
        + '<span id="marker-popup">'
        + ' <strong>' + popup_map.id + '</strong><br/>'
        + ' <em>' + feed.util_b.encodeHtml( popup_map.title ) + '</em><br/>';

    if ( popup_map.doc ) {
      
      if ( (/\.(gif|jpg|jpeg|tiff|png)$/i).test(popup_map.doc) ) {
        popup_html += '<a data-toggle="modal" href="#modalImg"><img class="feed-map-popup-img img-responsive img-thumbnail center-block" alt="No image" src="' + configMap.doc_path + popup_map.doc + '"></a>'
      }
      else {
        popup_html += '<div><a href="' + configMap.doc_path + popup_map.doc + '" target="_blank">' + popup_map.doc + '</a></div>'
      }
    }
    popup_html += ' <small>Lon: ' + popup_map.locate_map.x + ' - Lat: ' + popup_map.locate_map.y + '</small></span>';

    return popup_html;
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
        setMarker( marker.feature.id ); 
      }

      // the same report is asked so reload it
      if ( arg_map.new_report == arg_map.old_report ) {
// console.log('map onSetReport: ' + arg_map.new_report.title );
        marker.setPopupContent( setPopup( arg_map.new_report ) );
      }
    }
  };

  // event handler for the feed-listchange model event.
  // renders the markers list, highlighted the current marker if defined
  //
  onListchange = function( event ) {
    // console.log( 'feed.map.onListchange' );
    var 
      reports_db = configMap.reports_model.get_db(),
      current_report = configMap.reports_model.get_current();

    leafletMap.$layer_markers.clearLayers();

    reports_db().each( function ( report, idx ) {
      var point, 
        feat = { "type": "Feature", "id": report.id, "properties": report, "geometry": { "type": "Point", "coordinates": [ report.locate_map.x, report.locate_map.y ] }};
      
      leafletMap.$report_list.features.push( feat );

      point = L.geoJson( feat, {
        pointToLayer: function( feature, latLng ) {
          //var icon = icons[cat];
          var id, tmp_feat, pos, new_report, popup_html, marker,
          new_map = { locate_map: {} };
          
          new_map.id            = feature.id;
          new_map.locate_map.x  = feature.properties.locate_map.x;
          new_map.locate_map.y  = feature.properties.locate_map.y;
          new_map.title         = feed.util_b.encodeHtml( feature.properties.title );
          new_map.img           = feature.properties.img;
          new_map.doc           = feature.properties.doc;

          marker = L.marker( latLng, {
            draggable: false,
            title: feature.id,
            icon: leafletMap.$icon_red,
            keyboard: false,
            riseOnHover: true
          }).bindPopup( setPopup( new_map ) );

          leafletMap.$marker_list[ feature.id ] = marker;

          if ( ! L.touch ) {
            marker.on( 'mouseover', function(e) {
              id  = e.target.feature.id;
              pos = map.latLngToContainerPoint(e.latlng);

              if ( stateMap.drag_enable && stateMap.current_marker && stateMap.current_marker.feature.id === id ) {
                this.dragging.enable();
              }
              else {
               this.dragging.disable(); 
              }

              // TODO put the publish in the map model ?
              $.gevent.publish( 'feed-hover', id );

            }).on( 'mouseout', function(e) {
              // TODO put the publish in the map model
              $.gevent.publish( 'feed-hover', '' );

            }).on( 'click', function(e) {
              tmp_feat  = e.target.feature;
              pos       = map.latLngToContainerPoint(e.latlng);

              // if ( configMap.reports_model.get_current().id !== tmp_feat.id ) {
              $.gevent.publish( 'feed-clickmarker', tmp_feat.id );
              // }
            }).on( 'drag', function(e) {  
              $.gevent.publish( 'feed-setcoord', { x: e.target._latlng.lng.toFixed(3), y: e.target._latlng.lat.toFixed(3) } );
            }).on( 'dragend', function(e) {
              new_map.id            = feature.id;
              new_map.locate_map.x  = e.target._latlng.lng.toFixed(3);
              new_map.locate_map.y  = e.target._latlng.lat.toFixed(3);
              new_map.title         = feature.properties.title;
              
              marker.setLatLng( [ e.target._latlng.lat.toFixed(3), e.target._latlng.lng.toFixed(3) ] );
              marker.setPopupContent( setPopup( new_map ) );
              marker.openPopup();
            });
          } // eo if
          return marker;
        } // eo pointToLayer
      }); // eo point
      leafletMap.$layer_markers.addLayer( point );
    }); // eo each

    if ( current_report ) {
      setMarker( current_report.id );
    }
    
    leafletMap.$layer_markers.addTo( stateMap.map );
  };

  // event handler for the feed-listhover sidebar event.
  // renders the reports list, highlighted the current report if defined
  //
  onHoverList = function ( event, marker_id ) {
    var mark_sel,
    markers = leafletMap.$map_div.find( '.awesome-marker-icon-red' );

    if ( marker_id ) {

//         mark_sel = leafletMap.$marker_list[ marker_id ];
//         if ( mark_sel ) {
//           $( mark_sel ).addClass( 'marker-selected' );  
//         } 
        mark_sel = $.grep(markers, function( m ) { return m.title == marker_id });
        if ( mark_sel.length >0 ) {
          $(mark_sel[0]).addClass( 'marker-selected' );
        } 
      }
      else {
        markers.removeClass( 'marker-selected' );
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
    var $map = $('#map');
    
    stateMap.map = append_target;
    stateMap.$mapdiv = $map; // append_target.getContainer();
    setLeafletMap();

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

