/**********************************
 * feed.model.js
 *
 * Model module
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
/*global TAFFY, $, feed */

feed.model = (function () {
    'use strict';
    var
        configMap   = { 
            anon_id         : 'a0', 
            anon_profil     : 'p0',
            anon_rules_map  : { list_   : true,
                                read_   : false,
                                create_ : false,
                                update_ : false,
                                delete_ : false
                              },
            anon_name       : 'anonymous',
            empty_id        : 'e0',
            empty_title     : '',
            empty_textarea  : '',
            empty_locate_map: { x : 0, y : 0 }
        },
        stateMap    = {
            anon_user           : null, // anonymous person object
            cid_serial          : 0,
            report_cid_serial   : 0,
            people_cid_map      : {}, // person objects keyed by client ID
            people_db           : TAFFY(),
            user                : null,
            empty_report        : null,
            reports_cid_map     : {},
            reports_db          : TAFFY(),
            report              : null
        },

        isFakeData = true,

        personProto,    makeUserCid,    clearPeopleDb,  completeLogin,
        makePerson,     removePerson,   people,         
        reportProto,    makeReportCid,  clearReportsDb, completeCreate,
        makeReport,     removeReport,   reports,
        sidebar,        map,            initModule;

    // The people object API
    // ---------------------
    // The people object is available at feed.model.people.
    // The people object provides methods and events to manage
    // a collection of user objects. Its public methods include:
    //   * get_user() - return the current user object.
    //     If the current user not exist, an anonymous person
    //     object is returned.
    //   * get_db() - return the TaffyDB database of all the person
    //     objects - including the current user - presorted.
    //   * get_by_cid( <user_id> ) - return a user object with
    //     provided unique id.
    //   * login( <user_name> ) - login as the user with the provided
    //      user name. The current user object is changed to reflect
    //      the new identity.
    //   * logout()- revert the current user object to anonymous.
    //
    // jQuery global custom events published by the object include:
    //   * 'feed-login' is published when a user login process
    //      completes. The updated user object is provided as data.
    //   * 'feed-logout' is published when a logout completes.
    //      The former user object is provided as data.
    //
    // Each user is represented by a person object.
    // Person objects provide the following methods:
    //   * get_is_user() - return true if object is the current user
    //   * get_is_anon() - return true if object is anonymous
    //
    // The attributes for a person object include:
    //   * cid - string client id. This is always defined, and
    //      is only different from the id attribute
    //      if the client data is not synced with the backend.
    //   * id - the unique id. This may be undefined if the
    //      object is not synced with the backend.
    //   * name - the string name of the user.
    //   * id_profil - the id of the user profil
    //   * rules_map - the rule map of the user.
    //
    personProto = {
        get_is_user : function () {
            return this.cid === stateMap.user.cid;
        },
        get_is_anon : function () {
            return this.cid === stateMap.anon_user.cid;
        }
    };

    // Client ID generator.
    // used for user who don't yet have a server ID
    //
    makeUserCid = function () {
        return 'c' + String( stateMap.cid_serial++ );
    };
    
    // Remove all person objects except the anonymous person and
    // if a user is signed in, the current user object
    //
    clearPeopleDb = function () {
        var user = stateMap.user;
        stateMap.people_db = TAFFY();
        stateMap.people_cid_map = {};
        if ( user ) {
            stateMap.people_db.insert( user );
            stateMap.people_cid_map[ user.cid ] = user;
        }
    };

    // Complete user sign-in after backend confirmation.
    // Updates the current user information, and publishes
    // the sign-in success using an feed-login event
    //
    completeLogin = function ( user_list ) {
        var user_map = user_list[ 0 ];
        delete stateMap.people_cid_map[ user_map.cid ];
        stateMap.user.cid       = user_map._id;
        stateMap.user.id        = user_map._id;
        stateMap.user.id_profil = user_map.id_profil;
        stateMap.user.rules_map = user_map.rules_map;
        stateMap.people_cid_map[ user_map._id ] = stateMap.user;

        sidebar.get_list();
//console.info('model.completeLogin before $.gevent.publish( "feed-login", [ stateMap.user ] )');
        $.gevent.publish( 'feed-login', [ stateMap.user ] );
    };

    // Creates a person object and stores it in the TaffyDB collection
    // It also updates the index in the people_cid_map
    //
    makePerson = function ( person_map ) {
        var person,
        cid         = person_map.cid,
        id          = person_map.id,
        id_profil   = person_map.id_profil,
        rules_map   = person_map.rules_map,
        name        = person_map.name;

        if ( cid === undefined || ! name ) {
            throw 'client id and name required';
        }
        
        // Creates an object from the prototype personProto
        person              = Object.create( personProto );
        person.cid          = cid;
        person.name         = name;
        person.id_profil    = id_profil;
        person.rules_map    = rules_map;

        if ( id ) { person.id = id; }

        stateMap.people_cid_map[ cid ] = person;
        // database insertion
        stateMap.people_db.insert( person );
        return person;
    };

    // Remove a person object from the people list
    // doesn't remove the the current user or anonymous 
    // person objects
    //
    removePerson = function ( person ) {
        if ( ! person ) { return false; }
        // can't remove anonymous person
        if ( person.id === configMap.anon_id ) {
            return false;
        }

        stateMap.people_db({ cid : person.cid }).remove();
        if ( person.cid ) {
        delete stateMap.people_cid_map[ person.cid ];
        }
        return true;
    };

    // Define the people closure
    //
    people = (function () {
        var get_by_cid, get_db, get_user, login, logout;

        get_by_cid = function ( cid ) {
            return stateMap.people_cid_map[ cid ];
        };

        // Returns the TaffyDB collection of person objects
        //
        get_db = function () { 
            return stateMap.people_db; 
        };

        // Returns the current user person object
        //
        get_user = function () { 
            return stateMap.user; 
        };

        login = function ( name ) {
            var sio = isFakeData ? feed.fake.mockSio : feed.data.getSio();

            stateMap.user = makePerson({
                cid         : makeUserCid(),
                id_profil   : 'pro_01', // admin profil
                name        : name
            });

            // Register a callback to complete sign-in when
            // backend publishes a userupdate message
            sio.on( 'userupdate', completeLogin );
//console.info('model.login before emit adduser');
            // Send an adduser message to the backend
            sio.emit( 'adduser', {
                cid         : stateMap.user.cid,
                //id_profil   : stateMap.user.id_profil,
                name        : stateMap.user.name
            });
        };

        // Publishes an feed-logout event
        //
        logout = function () {
            var user = stateMap.user;
            
            sidebar._leave();
            stateMap.user   = stateMap.anon_user;
            clearPeopleDb();

            $.gevent.publish( 'feed-logout', [ user ] );
        };

        // export public people methods
        return {
            get_by_cid  : get_by_cid,
            get_db      : get_db,
            get_user    : get_user,
            login       : login,
            logout      : logout
        };
    }());


    // The reports object API
    // ---------------------
    // The reports object is available at feed.model.reports.
    // The reports object provides methods and events to manage
    // a collection of report objects. Its public methods include:
    //   * get_current() - return the current report object.
    //     If no report an empty report object is returned.
    //   * get_db() - return the TaffyDB database of all the report
    //     objects - including the current report - presorted.
    //   * get_by_cid( <report_id> ) - return a report object with
    //     provided unique id.
    //   * create_( <report_id> ) - send the report with the provided
    //     user name. The current report object is changed to reflect
    //     the new identity. Successful completion of create
    //     publishes a 'feed-create' global custom event.
    //  * update_( <report_id> ) - send the update_report_map to the
    //    backend. This results in an 'updatereport' event which publishes the
    //    updated reports list. The update_report_map must have the form : 
    //    { report_id : 'id_03', locate_map : {} }
    //    If the user is anonymous or the report is null, it aborts and returns false.
    //  * delete_( <report_id> ) - remove a report identified by report_id. It 
    //    publishes a 'feed-updatereport' and a 'deletereport' global custom event. 
    //    If the report_id does not exist in the reports list remove_report() aborts and
    //    returns false.
    //
    // jQuery global custom events published by the object include:
    //   * feed-create - This is published when a report create process
    //     completes. The updated report object is provided as data.
    //   * feed-delete - This is published when a report delete completes.
    //   * feed-update - This is published when a report update completes.
    //
    // Each report is represented by a report object.
    // Report objects provide the following methods:
    //   * get_is_report() - return true if object is the current report
    //   * get_is_empty() - return true if object is anonymous
    //
    // The attributes for a report object include:
    //   * cid - string report id. This is always defined, and
    //     is only different from the id attribute
    //     if the report data is not synced with the backend.
    //   * id - the unique id. This may be undefined if the
    //     object is not synced with the backend.
    //   * title - the string title of the report.
    //   * locate_map - a map of locate attributes used for localisation.
    //
    reportProto = {
        get_is_report : function () {
          return this.cid === stateMap.report.cid;
        },
        get_is_empty : function () {
          return this.cid === configMap.empty_id;
        }
    };

    makeReportCid = function () {
        return 'c' + String( stateMap.report_cid_serial++ );
    };

    clearReportsDb = function () {
        var report              = stateMap.report;
        stateMap.reports_db     = TAFFY();
        stateMap.reports_cid_map= {};
        // if ( report ) {
        //     stateMap.reports_db.insert( report );
        //     stateMap.reports_cid_map[ report.cid ] = report;
        // }
    };

    completeCreate = function ( reports_list ) {
        
    };

    makeReport = function ( report_map ) {
        var report,
          cid           = report_map.cid,
          id            = report_map.id,
          title         = report_map.title,
          textarea      = report_map.textarea,
          locate_map    = report_map.locate_map,
          // img           = report_map.img,
          doc           = report_map.doc;

        if ( cid === undefined ) {
            throw 'report id required';
        }

        report              = Object.create( reportProto );
        report.cid          = cid;
        report.title        = title;
        report.textarea     = textarea;
        report.locate_map   = locate_map;
        // report.img          = img;
        report.doc          = doc;

        if ( id ) { report.id = id; }

        stateMap.reports_cid_map[ cid ] = report;

        stateMap.reports_db.insert( report );
// console.log( 'makeReport : ' + report.id );        
        return report;
    };

    removeReport = function ( report ) {
        if ( ! report ) { return false; }
        
        // cannot remove empty report
        if ( report.get_is_empty() ) {
            return false;
        }

        stateMap.reports_db({ cid : report.cid }).remove();
        if ( report.cid ) {
            delete stateMap.reports_cid_map[ report.cid ];
        }
        return true;
    };

    reports = (function () {
        var 
            get_by_cid,     get_db,     get_current, create_, 
            delete_,        update_,    cancel_
        ;

        get_by_cid = function ( cid ) {
            return stateMap.reports_cid_map[ cid ];
        };

        get_current = function () { return stateMap.report; };
        
        get_db = function () { 
//stateMap.reports_db().each( function ( report, idx ) { // console.log('reports.get_db : ' + report.id ); });
            return stateMap.reports_db; 
        };

        // have to receipt data from the form to send data to backend
        create_ = function ( report_create_map ) {
            var sio;
            
            // Checks if the user is not anonymous
            if ( stateMap.user.get_is_anon() ) {
                console.warn( "Sorry you have to connect before !" );
                return false;
            }

            sio = isFakeData ? feed.fake.mockSioReport : feed.data.getSio();
            sio.on( 'addreport', completeCreate );

            // call the completeCreate to put the new report in 
            // stateMap.report and call sidebar._update_reports_list
            // to update the reports list
            sio.emit( 'createreport', {
                cid         : makeReportCid(),
                locate_map  : report_create_map.locate_map,
                title       : report_create_map.title,
                textarea    : report_create_map.textarea
            });
        };

        // report_update_map = the new map of the report
        // report_update_map should have the form :
        // { report_id : <string>, locate_map : { x : <int>, y : <int> } };
        //
        update_ = function ( report_update_map ) {
            var sio = isFakeData ? feed.fake.mockSioReport : feed.data.getSioReport();
            
            if ( sio ) { 
                sio.emit( 'updatereport', report_update_map );
            }
        };

        delete_ = function ( report_delete_id ) {
            var 
                sio = isFakeData ? feed.fake.mockSioReport : feed.data.getSioReport(),
                report = reports.get_by_cid( report_delete_id );

            if ( sio ) {
                sio.emit( 'deletereport', report );
            }
        };

        // publish the previous report data
        //
        cancel_ = function ( report_cancel_id ) {
            if ( stateMap.report.id === report_cancel_id ) {
                $.gevent.publish( 'feed-setreport',
                    { old_report : stateMap.report, new_report : stateMap.report }
                );
            }
        };

        return {
            get_by_cid  : get_by_cid,
            get_db      : get_db,
            get_current : get_current,
            create_     : create_,
            delete_     : delete_,
            update_     : update_,
            cancel_     : cancel_
        };
    }());


    // The sidebar object API
    // -------------------
    // The sidebar object is available at feed.model.sidebar.
    // The sidebar object provides methods and events to manage
    // reports display, creation and modification. 
    // Its public methods include:
    //  * get_list() - display the reports list. The backend including 
    //    publishers for 'feed-listchange'. If the current user is 
    //    anonymous or his rule doesn't permit, get_list() aborts and
    //    returns false.
    //  * get_report() - return the current report. If there is no report
    //    null is returned.
    //  * set_report( <report_id> ) - set the current report to the report
    //    identified by report_id. If the report_id does not exist in the
    //    reports list, the report is set to null. If the report requested
    //    is already the current report, it returns false.
    //
    // jQuery global custom events published by the object include:
    //  * feed-setreport - This is plublished when a new report is set.
    //    A map of the form is provided as data :
    //      { old_report : <old_report_object>,
    //        new_report : <new_report_object>
    //      }
    //  * feed-listchange - This is published when the list of
    //    reports changes in length (i.e. when a report is added or 
    //    deleted) or when their contents change. A subscriber to this 
    //    event should get the reports_db from the report model for the updated data.
    //
    sidebar = (function () {
        var
          _publish_reports_listchange,  _update_reports_list,
          _leave_list,
          
          get_report, get_list, set_report,
        
          report = null;

        // Begin internal methods

        // Refresh the reports object when a new
        // list is received
        //
        _update_reports_list = function( arg_list ) {

            var 
              i, report_map, make_report_map,
              reports_list = arg_list[0],
              is_report_exist = false,
              is_report_new = false
            ;
console.log( ' _update_reports_list arg_list[0]: ' + arg_list[0] );
            clearReportsDb();

            if ( arg_list.length > 1 ) {
                report_map = arg_list[ 1 ];
                delete stateMap.reports_cid_map[ report_map.cid ];
                stateMap.report.cid         = report_map._id;
                stateMap.report.id          = report_map._id;
                stateMap.report.title       = report_map.title;
                stateMap.report.textarea    = report_map.textarea;
                stateMap.report.locate_map  = report_map.locate_map;
                // stateMap.report.img         = report_map.img;
                stateMap.report.doc         = report_map.doc;

                is_report_new = true;
                $.gevent.publish( 'feed-alert', { text: 'The report was created successfully !'} );
            }

            REPORT:
            for ( i=0; i < reports_list.length; i++ ) {
                report_map = reports_list[ i ];
// // console.log('is_empty :' + stateMap.report.get_is_empty() + ' *** stateMap.report.id : ' + stateMap.report.id + ' === ' + report_map._id );
                // udate the selected report and publlish 'feed-setreport'
                //
                if ( ! stateMap.report.get_is_empty() && stateMap.report.id === report_map._id ) {
                    if ( ! is_report_new ) {
                        $.gevent.publish( 'feed-alert', { text: 'The report was updated successfully !'} );
                        stateMap.report.title       = report_map.title;
                        stateMap.report.textarea    = report_map.textarea;
                        stateMap.report.locate_map  = report_map.locate_map;
                        // stateMap.report.img         = report_map.img;
                        stateMap.report.doc         = report_map.doc;                        
                    }

                    // publish setreport event with a map of the old_report
                    // and new_report as data
                    //
                    // reports.cancel_( report_map._id );
// console.log('feed-setreport : ' + stateMap.report.title );
                    $.gevent.publish( 'feed-setreport',
                    { old_report : stateMap.report, new_report : stateMap.report }
                );
                    is_report_exist = true;
                 
                    //continue REPORT;
                }

                // TODO : see if it's interesting
                if ( report_map && ! report_map.title ) { continue REPORT; }

                make_report_map = {
                    cid         : report_map._id,
                    locate_map  : report_map.locate_map,
                    id          : report_map._id,
                    title       : report_map.title,
                    textarea    : report_map.textarea,
                    // img         : report_map.img,
                    doc         : report_map.doc
                };
// console.log('makeReport: ' + make_report_map.title );
                makeReport( make_report_map );
            }

            stateMap.reports_db.sort( 'id' );

            // if the selected report doesn't exist anymore, unset the report 
            // which triggers the 'feed-setreport' global event
            //
            if ( ! stateMap.report.get_is_empty() && ! is_report_exist ) {
                $.gevent.publish( 'feed-alert', { text: 'The report was deleted successfully !'} );
// console.log('if set_report');                
                set_report(''); 
            }
        };
        
        // Publish a feed-listchange global jQuery event wtih
        // an updated reports list as its data. Used whenever a
        // listchange message is received from the backend
        //
        _publish_reports_listchange = function( arg_list ) {
            _update_reports_list( arg_list );

            $.gevent.publish( 'feed-listchange', [ arg_list ] );
        };
        // eo internal methods

        // Sends a leavelist message to the backend and cleans up
        // state variables
        //
        _leave_list = function () {
            var sio = isFakeData ? feed.fake.mockSioReport : feed.data.getSioReport();
            report = null;
            if ( sio ) { sio.emit( 'leavelist' ); }
        };

        // return the report object
        //
        get_report = function () {
            return stateMap.report;
        };

        // Check the sio to get the reportsList loaded by the callback
        // Declares a callback to the listchange event if the user is not 
        // anonymous. It means that the user is ready to receive reports list 
        // each time the backend sends it.
        //
        get_list = function () {
            var sio;

            // Checks if the user is not anonymous
            if ( stateMap.user.get_is_anon() ) {
                $.gevent.publish( 'feed-alert', { text: "Sorry you have to connect before !" } );
                return false;
            }
            
            sio = isFakeData ? feed.fake.mockSioReport : feed.data.getSioReport();
            sio.on( 'listchange', _publish_reports_listchange );
            sio.emit('getreports', {
                user : stateMap.user
            });
            return true;
        };

        // Change the report object to one provided. If the 
        // provided report is the same as the current one, return false
        //
        set_report = function ( report_id ) {
            var new_report;

            new_report = stateMap.reports_cid_map[ report_id ];
// console.log('set_report : ' + new_report.title );            
            if ( new_report ) {
// console.log('set_report if new_report');
                if ( stateMap.report && stateMap.report.id === new_report.id ) {
// console.log('set_report if new_report');
                   return false;
                }
            }
            else {
// console.log('set_report else new_report');
                new_report = stateMap.empty_report;
            }
// console.log('set_report publish');
            // publish setreport event with a map of the old_report
            // and new_report as data
            $.gevent.publish( 'feed-setreport',
                { old_report : stateMap.report, new_report : new_report }
            );
            stateMap.report = new_report;
// console.log('set_report return true');            
            return true;
        };

        return {
            _leave          : _leave_list,
            get_report      : get_report,
            get_list        : get_list,
            set_report      : set_report
        };

    }()); // eo sidebar object api


    // The map object API
    // -------------------
    map = (function () {
        return {};
    }()); // eo map object api


    initModule = function () {
        var i, reports_list, report_map;

        // initialize anonymous person
        stateMap.anon_user = makePerson({
            cid         : configMap.anon_id,
            id          : configMap.anon_id,
            id_profil   : configMap.anon_profil,
            rules_map   : configMap.anon_rules_map,
            name        : configMap.anon_name
        });
        stateMap.user = stateMap.anon_user;

        // initialize empty report
        stateMap.empty_report = makeReport({
            cid         : configMap.empty_id,
            id          : configMap.empty_id,
            title       : configMap.empty_title,
            textarea    : configMap.empty_textarea,
            locate_map  : configMap.empty_locate
        });
        stateMap.report = stateMap.empty_report;
    };

    return {
        initModule  : initModule,
        people      : people,
        reports     : reports,
        sidebar     : sidebar,
        map         : map
    };
}());
