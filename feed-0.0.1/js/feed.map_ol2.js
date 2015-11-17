/**********************************
 * feed.map.js
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
      doc_path : 'doc/',
      settable_map : {
        map_model       : true,
        people_model    : true,
        reports_model   : true,
        set_map_anchor  : true
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

    setOl2Map,      setMarkerPosition,  getMarker,    setMarker,
    clearMarkers,   setPopup,           onSetReport,
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
	$map 	    = stateMap.map,
	$map_div    = stateMap.$mapdiv
    ;

    ol2Map = {
	$layers_markers	: 
	$layer_new	: 
	$map_div	: $map_div,
	$report_list    : { "type": "FeatureCollection", "features": [] },
	$marker_list    : [],
	$icon_red       :
	$icon_orange    :
	$icon_blue      :
    }
  };


  //--------------------- eo dom methods ------------------------
  //--------------------- EVENT HANDLERS ------------------------

  //--------------------- eo event handlers ---------------------

  //--------------------- PUBLIC METHODS ------------------------
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


