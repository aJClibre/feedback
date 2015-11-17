/**********************************
 * feed.shell.js
 *
 * Feedback Information application
 * Fill the sidebar element with the map feature
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

feed.shell = (function () {
    'use strict';
    //--------------------- MODULE SCOPE VARIABLES -------------------
    var
        // Configuration values
        // set constants
        configMap = {
            anchor_schema_map : {
                sidebar : {opened : true, closed : true },
                tab     : {home : true, report: true, create: true, settings: true}
            },
            main_html : String()
                + '<div class="feed-shell-acct">TOTOT</div>'
                + '<div class="feed-shell-nav">TATATA</div>'
        },
        stateMap    = { 
            anchor_map  : {},
        }, 
        jqueryMap   = {},

        // Declare all other module scope variables
        copyAnchorMap,      setJqueryMap,       onHashchange,
        onTapAcct,          onLogin,            onLogout,
        setSidebarAnchor,   setMapAnchor,       changeAnchorPart,   initModule;
    //--------------------- eo Module scope --------------------------
    
    //--------------------- UTILITY METHODS --------------------------
    // Returns copy of stored anchor_map; minimizes overhead
    // Util because Javascripts objects are passed by reference.
    //
    copyAnchorMap = function () {
        return $.extend( true, {}, stateMap.anchor_map );
    };
    //--------------------- eo utility methods -----------------------

    //--------------------- DOM METHODS ------------------------------
    // DOM method /setJqueryMap/
    //
    setJqueryMap = function () {
        
        var $container = stateMap.$container;

        jqueryMap = { 
            $container  : $container,
            $acct : $container.find('.feed-shell-acct'),
            $nav : $container.find('.feed-shell-nav')
        };
    };


    // DOM method /changeAnchorPart/
    // Purpose  : Changes part of the URI anchor component
    // call when the onClickTreeView is call
    // Arguments:
    //   * arg_map - The map describing what part of the URI anchor
    //     we want changed.
    // Returns  : boolean
    //   * true  - the Anchor portion of the URI was update
    //   * false - the Anchor portion of the URI could not be updated
    // Action   :
    //   The current anchor rep stored in stateMap.anchor_map.
    //   See uriAnchor for a discussion of encoding.
    //   This method
    //     * Creates a copy of this map using copyAnchorMap().
    //     * Modifies the key-values using arg_map.
    //     * Manages the distinction between independent
    //       and dependent values in the encoding.
    //     * Attempts to change the URI using uriAnchor.
    //     * Returns true on success, and false on failure.
    //
    changeAnchorPart = function ( arg_map ) {
        var
            anchor_map_revise = copyAnchorMap(),
            bool_return = true,
            key_name, key_name_dep;

        // Begin merge changes into anchor map
        KEYVAL:
        for ( key_name in arg_map ) {
            if ( arg_map.hasOwnProperty( key_name ) ) {

                // skip dependent keys during iteration
                if ( key_name.indexOf( '_' ) === 0 ) { continue KEYVAL; }

                // update independent key value
                anchor_map_revise[key_name] = arg_map[key_name];

                // update matching dependent key
                key_name_dep = '_' + key_name;
                if ( arg_map[key_name_dep] ) {
                    anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
                }
                else {
                    delete anchor_map_revise[key_name_dep];
                    delete anchor_map_revise['_s' + key_name_dep];
                }
            }
//console.log('changeAnchorPart end for');            
        }       
        // End changes parts into anchor

        // Begin attempt to update URI; revert if not successful
        try {
            $.uriAnchor.setAnchor( anchor_map_revise );
//console.log('changeAnchorPart end try');            
        }
        catch ( error ) {
            // replace URI with existing state
            $.uriAnchor.setAnchor( stateMap.anchor_map,null,true );
            bool_return = false;
        }
        // End attempt to update URI...

        return bool_return;
    }; // eo /changeAnchorPart/
    //--------------------- eo dom methods ------------------------
    
    //--------------------- EVENT HANDLERS ------------------------
    // Begin Event handler /onHashchange/
    // Purpose  : Handles the hashchange event call binds to
    // the haschange event $(window) so when the uri is changed
    // Arguments:
    //   * event - jQuery event object.
    // Settings : none
    // Returns  : false
    // Action   :
    //   * Parses the URI anchor component
    //   * Compares proposed application state with current
    //   * Adjust the application only where proposed state
    //     differs from existing and is allowed by anchor schema 
    // 
    onHashchange = function ( event ) {
       var
            anchor_map_proposed,    _s_sidebar_previous,   _s_sidebar_proposed,
            s_sidebar_proposed,
            is_ok = true,
            anchor_map_previous = copyAnchorMap();
//console.log('onHashchange begin ');
        // attempt to parse anchor
        try { anchor_map_proposed = $.uriAnchor.makeAnchorMap(); }
        catch ( error ) {
            $.uriAnchor.setAnchor( anchor_map_previous, null, true );
            return false;
        }
        stateMap.anchor_map = anchor_map_proposed;

        // convenience vars
        _s_sidebar_previous = anchor_map_previous._s_sidebar; // ex: anchor_map_previous = {profile: true}
        _s_sidebar_proposed = anchor_map_proposed._s_sidebar;

        // Begin adjust chat component if changed
        s_sidebar_proposed = anchor_map_proposed.sidebar;
//console.log('anchor_map_proposed.tab: ' + anchor_map_proposed.tab);          
console.log('feed.shell TODO 2 : restore feed.map');
        switch ( s_sidebar_proposed ) {
            case 'opened' :               
                is_ok = feed.sidebar.setSliderPosition( 'opened', anchor_map_proposed.tab );
//                feed.map.setMarkerPosition( 'opened', anchor_map_proposed.tab );
            break;
            case 'closed' :
                is_ok = feed.sidebar.setSliderPosition( 'closed', anchor_map_proposed.tab );
//                feed.map.setMarkerPosition( 'closed', anchor_map_proposed.tab );
            break;
            default : 
                feed.sidebar.setSliderPosition( 'closed', anchor_map_proposed.tab );
                delete anchor_map_proposed.sidebar;
             //   $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
        }
        // eo adjust chat component 

        // Begin revert anchor if slider change denied
        if ( ! is_ok ){
            if ( anchor_map_previous ){
                $.uriAnchor.setAnchor( anchor_map_previous, null, true );
                stateMap.anchor_map = anchor_map_previous;
            }
            else {
                delete anchor_map_proposed.sidebar;
                $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
            }
        }
        // eo revert anchor

        return false;
    };// End Event handler /onHashchange/

    // Calls when the account element is tapped
    // prompt for a user name and invoke feed.model.people.login(<user_name>) if 
    // the user is anonymous or invoke feed.model.people.logout()
    //
    onTapAcct = function ( event ) {
        var acct_text, user_name, user = feed.model.people.get_user();
        if ( user.get_is_anon() ) {
            user_name = prompt( 'Please sign-in' );
            feed.model.people.login( user_name );
//console.info('shell.onTapAcct after feed.model.people.login( user_name )');
            jqueryMap.$acct.text( '... processing ...' );
        }
        else {
            feed.model.people.logout();
        }
        return false;
    };

    // onLogin event handler. Update the text by the login_user object distributed 
    // by the feed-login event
    //
    onLogin = function ( event, login_user ) {
        jqueryMap.$acct.text( login_user.name );
    };

    // onLogout event handler
    //
    onLogout = function ( event, logout_user ) {
        jqueryMap.$acct.text( 'Please sign-in' );
    };
    //--------------------- eo event handlers ---------------------

    //--------------------- CALLBACKS -----------------------------
    // callback method /setContentAnchor/
    // Example  : setContentAnchor( 'toto' );
    // Purpose  : Change the sidebar component of the anchor
    // Arguments:
    //   *  position_type - may be 'closed' or 'opened'
    // Action   :
    //   Changes the URI anchor parameter to the requested
    //   value if possible.
    // Returns  :
    //   * true  - requested anchor part was updated
    //   * false - requested anchor part was not updated
    // Throws   : none
    //
    setSidebarAnchor = function ( position_map ){
        return changeAnchorPart( position_map );
    };

    // callback method /setContentAnchor/
    // Example  : setContentAnchor( 'toto' );
    // Purpose  : Change the sidebar component of the anchor
    // Arguments:
    //   *  position_type - may be 'closed' or 'opened'
    // Action   :
    //   Changes the URI anchor parameter to the requested
    //   value if possible.
    // Returns  :
    //   * true  - requested anchor part was updated
    //   * false - requested anchor part was not updated
    // Throws   : none
    //
    setMapAnchor = function ( position_map ){
        return changeAnchorPart( position_map );
    };
    //--------------------- eo callbacks --------------------------

    //--------------------- PUBLIC METHODS ------------------------
    // Public method /initModule/
    // Example : feed.shell.initModule( $('#app_div_id') );
    // Purpose :
    // Directs the Shell to offer its capability to the user
    // Arguments :
    //   * $container (example: $('#app_div_id')).
    //     A jQuery collection that should represent
    //     a single DOM container
    // Action :
    //   Populates $container with the shell of the UI
    //   and then configures and initializes feature modules.
    //   The Shell is also responsible for browser-wide issues
    //   such as URI anchor and cookie management.
    // Returns : none
    // Throws  : none
    //
    initModule = function ( $container, map ) {
        // load HTML and map jQuery collections
        stateMap.$container = $container;
        //$container.html( configMap.main_html );
        setJqueryMap();

        // configure and initialize feature modules
        // corresponding to the configMap
        //
        $.uriAnchor.configModule({
            schema_map : configMap.anchor_schema_map
        });
        
        // configure and initialize feature modules
        feed.sidebar.configModule({
            set_sidebar_anchor  : setSidebarAnchor,
            sidebar_model       : feed.model.sidebar,
            people_model        : feed.model.people,
            reports_model       : feed.model.reports
        });
        feed.sidebar.initModule( jqueryMap.$container );

console.log('feed.shell TODO : restore feed.map');	
/****************************
	feed.map.configModule({
            set_map_anchor      : setMapAnchor,
            map_model           : feed.model.map,
            // sidebar_model       : feed.model.sidebar,
            people_model        : feed.model.people,
            reports_model       : feed.model.reports
        });
        feed.map.initModule( map );
*******************************/

        // Handle URI anchor change events.
        // This is done /after/ all feature modules are configured
        // and initialized, otherwise they will not be ready to handle
        // the trigger event, which is used to ensure the anchor
        // is considered on-load
        //
        $(window)
            .bind( 'hashchange', onHashchange )
            .trigger( 'hashchange' ); // call onHashchange direct
        
        // the container subscribe the event handlers to the events 
        $.gevent.subscribe( $container, 'feed-login', onLogin );
        $.gevent.subscribe( $container, 'feed-logout', onLogout );

        jqueryMap.$acct
            .text( 'Please sign-in')
            .bind( 'utap', onTapAcct );

        console.log('Direct login into the application!');
        feed.model.people.login( 'Alfred' );

    };// End PUBLIC method /initModule/

    return { 
        initModule          : initModule 
    };
    //--------------------- eo public methods --------------------
}());
