/************************************************
 *
 * Tests to execute in a firebug console
 * Tests Extracted form the Single Page Web Appli book
 * Modified for our use
 *
 *
 ************************************************/

var test_create_report, 
    test_model_sidebar,     test_model_reports, test_model_people, 
    test_remove_sidebar,    test_customEvent,   test_signIn;

/************************************************
 *
 * Test of jQuery global custom events
 * Listing 5.9 p.157 chp. 5.3.2
 *
 ************************************************/

test_customEvent = function () {
    // Append a <div> to the page body
    $( 'body' ).append( '<div id="dash-chart-list-box"/>' );
    // Create a $listbox jQuery collection. Style
    // it so we can see it.
    var $listbox = $( '#dash-chart-list-box' );
    $listbox.css({
        position: 'absolute', 'z-index' : 3,
        top : 50, left : 50, width : 50, height :50,
        border : '2px solid black', background : '#fff'
    });
    // Define a handler we plan to use for the feed-listchange
    // jQuery global custom event.
    // This method expects an event object and a map detailing a
    // user list update as arguments.
    // Have the handler open an alert box so we can verify when it is
    // invoked
    var onListChange = function ( event, update_map ) {
        $( this ).html( update_map.list_text );
    };
    // Have the $listbox jQuery collection subscribe to the feed-listchange
    // custom global event with the onListChange function. When the
    // feed-listchange event occurs, onListChange is invoked with the event
    // object as the first argument, followed by any other arguments published by the event. The
    // value of this in onListChange will be the DOM element used by $listbox
    $.gevent.subscribe(
        $listbox,
        'feed-listchange',
        onListChange
    );
    // The onListChange function subscribed on the
    // $listbox jQuery collection is invoked by this event. The
    // alert box should appear.
    // We can close the alert box
    $.gevent.publish(
        'feed-listchange',
        [ { list_text : 'the list is here' } ]
    );
    // When we remove the $listbox collection
    // elements from the DOM, the subscription
    // is no longer valid and the subscription to
    // onListChange is removed
    $listbox.remove();
    // The onListChange function bound on
    // $listbox will not be invoked, and we should
    // not see the alert box
    $.gevent.publish( 'feed-listchange', [ {} ] );
};

/************************************************
 *
 * Test of the remove and get it back slidebar
 * p.133 chp. 4.5.1
 *
 ************************************************/

test_remove_sidebar = function () {

    console.group("******* test_remove_sidebar *********");

    // remove
    feed.sidebar.removeSlider();

    // get it back but not fully fonctionnal
    feed.sidebar.configModule({ set_sidebar_anchor: function (){ return true; } });
    feed.sidebar.initModule( $( '#container' ) );

    console.groupEnd();
};// eo test_remove_sidebar

/************************************************
 *
 * Test of fake people and liking it
 * Listing 5.14 p.162 chp. 5.4.2
 *
 ************************************************/

test_model_people = function () {

    console.group("******* test_model_people *********");

    /* init */
    // get the people collection from feed.model.initModule()
    // using the people closure
    var peopleDb = feed.model.people.get_db();
    // get list of all people from TaffyDB
    var peopleList = peopleDb().get();

    /* TaffyDB test */
    // show our list of people (click to see the properties)
    console.log(peopleList);
    // >> [ >Object, >Object, >Object, >Object, >Object ]

    /* anonymous user test */
    // the anonymous person should have an id of 'a0'
    var person = peopleDb({ id : 'a0' }).first();
    // use the same method
    console.assert( person.get_is_anon() === true );
    
    console.assert( person.name === "anonymous" );

    console.log(JSON.stringify( person.rules_map ));

    console.groupEnd();

}; // eo test_model_people

/************************************************
 *
 * Test sign-in and sign-out with fake data
 * p.170 Listing 5.17 chp. 5.4.4
 *
 ************************************************/

test_signIn = function () {

    console.group("******* test_signIn *********");

    // create a jQuery collection
    $t = $('<div/>');
    // Have $t subscribe to global custom events with test functions
    $.gevent.subscribe( $t, 'feed-login', function () {
        console.log( 'Hello!', arguments ); });
    $.gevent.subscribe( $t, 'feed-logout', function () {
        console.log('!Goodbye', arguments ); });

    console.log("get the current user object");
    var currentUser = feed.model.people.get_user();
    console.log("confirm it is anonymous");
    console.assert(currentUser.get_is_anon() === true );
    //>> true

    console.log("get the people collection");
    var peopleDb = feed.model.people.get_db();
    console.log("show the names of all people in our list");
    ////console.log(peopleDb().each(function(person, idx){console.log(person.name);}));
    //>> anonymous
    //>> Betty

    console.log("sign-in as 'Alfred'; get current user within 3s!");
    feed.model.people.login( 'Alfred' );
    currentUser = feed.model.people.get_user();
    console.log("confirm the current user is no longer anonymous");
    console.assert(currentUser.get_is_anon() === false);
    //>> false

    console.log("inspect the current user id and cid");
    console.assert( currentUser.id === undefined );
    console.assert( currentUser.cid === 'c0' );
    // wait 3s ...
    //>> Hello! > [jQuery.Event, Object]

    console.log("test the people collection if current user inside");
    console.log(peopleDb().each(function(person, idx){ if ( person.name === 'Alfred' ) console.info(person.name);}));
    //>> anonymous
    //>> Wilma
    //>> Alfred

    console.log("sign-out and watch for the event");
    feed.model.people.logout();
    //>> !Goodbye [jQuery.Event, Object]

    console.log("look at the people collection if current user is inside");
    peopleDb().each(function(person, idx){ if ( person.name === 'Alfred' ) console.error(person.name); });
    //>> anonymous
    //>> Betty
    //>> Mike

    currentUser = feed.model.people.get_user();
    console.assert( currentUser.get_is_anon() === true );
    
    console.groupEnd();
}; // eo test_signIn 

/************************************************
 *
 * Test of model reports 
 * Use fake data
 * Listing 5.14 p.162 chp. 5.4.2
 *
 ************************************************/

test_model_reports = function () {

    console.group("******* test_model_reports *********");

    /* init */
    // get the reports collection from feed.model.initModule()
    // using the reports closure
    var reportsList, 
        reportsDb = feed.model.reports.get_db();
    
    // get list of all reports from TaffyDB
    try {
        reportsList = reportsDb().get();
    }
    catch(e){
        console.error("feed.model.reports.get_db() ERROR!");
        return;
    }
    /* TaffyDB test */
    // show our list of reports (click to see the properties)
    console.log( reportsList );
    // >> [ >Object, >Object, >Object, >Object, >Object ]

    // show the titles of all reports in our list
    ////console.log( reportsDb().each(function( report, idx ){ console.log( report.title ); }) );
    // >> anonymous
    // >> toto
    //

    /* properties test */
    // get the report with the id of 'id_03':
    var report = reportsDb({ cid : '150708_03' }).first();
    // inspect the title attribute
    console.log(report.title);
    // >> "titi"
    //console.log(report.id_profil);
    // >> "pro_02"
    // inspect the locate_map attribute
    console.log(JSON.stringify( report.locate_map ));
    // >> "{"top":100,"left":20,"background-color":"rgb( 128, 192, 192)"}""

    /* empty report test */
    // try an inherited method
    console.assert( report.get_is_report() === false );
    // >> false
    // the empty report should have an id of 'e0'
    report = reportsDb({ id : 'e0' }).first();
    // use the same method
    console.assert( report.get_is_empty() === true );
    // >> true
    console.assert( report.title === '' );
    // >> "anonymous"

    console.groupEnd();

}; // eo test_model_reports


/************************************************
 *
 * Test of sidebar model
 * Use fake data
 * Listing 5.14 p.162 chp. 5.4.2
 *
 ************************************************/

test_model_sidebar = function () {

    console.group("******* test_model_sidebar *********");

    /* init */
    // create a jquery collection
    var $t = $('<div/>');
    
    console.group("******* sidebar.get_list *********");

    // have $t subscribe to 'feed-create' global custom events with test function
//    $.gevent.subscribe( $t, 'feed-create', function () { 
//        console.info( 'Creation!', arguments ) });
    $.gevent.subscribe( $t, 'feed-listchange', function () {
        console.info( '*Listchange', arguments ) });
    // Have $t subscribe to global custom events with test functions
    $.gevent.subscribe( $t, 'feed-login', function () {
        console.log( 'Hello!', arguments ); });

    // get the current report object
    var currentReport = feed.model.reports.get_current();

    // confirm this is empty
    console.assert( currentReport.get_is_empty() === true );

    // try to get the list but user not logged 
    //console.assert( feed.model.sidebar.get_list() === false );

    //sign-in
    feed.model.people.login( 'Fred' );
    var currentUser = feed.model.people.get_user();
    console.log("confirm the current user is no longer anonymous");
    console.assert(currentUser.get_is_anon() === false);
    console.log("test the people collection if current user inside");
    var peopleDb = feed.model.people.get_db();
    console.log(peopleDb().each(function(person, idx){ if ( person.name === 'Fred' ) console.info(person.name);}));

    // get the reports list
    var reportsDb = feed.model.reports.get_db();

    // show the report object of all reports in the collection
    reportsDb().each(function(report, idx){console.dir(report);});

    // get the reports list
    //console.assert( feed.model.sidebar.get_list() === false );

    // inspect the reports list again. the list has been updated to show all
    // reports. Have to wait the feed-login published before 
    setTimeout( function () {
        var reportsDb = feed.model.reports.get_db();
        reportsDb().each(function(report, idx){console.info( report.title );});
    }, 2500 );

    console.groupEnd();
    
    console.group("******* reports.update_ *********");
    
    setTimeout( function () {
        // get a report
        var report = feed.model.reports.get_by_cid( '150708_03' );

        // inspect report information
        console.log( JSON.stringify( report.locate_map ) );

        // update report information
        feed.model.reports.update_({
            report_id : '150708_03', locate_map : {}
        });

        // test again
        report = feed.model.reports.get_by_cid( '150708_03' );
        console.log( JSON.stringify( report.locate_map ) );
    }, 3000 );

    console.groupEnd();

    console.group("******* reports.create_ *********");
        
    // get a report
    var newreport = { title : 'titre 4', locate_map : { x : 2, y : 2 }};
    // create report information
    feed.model.reports.create_( newreport );

    setTimeout( function () {
        // test again
        report = feed.model.reports.get_by_cid( 'id_4' );
        console.log( JSON.stringify( report.locate_map ) );
    }, 3500 );

    console.groupEnd();

    console.group("******* reports.delete_ *********");

    setTimeout( function () {
        // get a report
        var report = feed.model.reports.get_by_cid( '150708_03' );

        // delete report 
        feed.model.reports.delete_(
            { report_id : '150708_03' }
        );

        // test again
        report = feed.model.reports.get_by_cid( '150708_03' );
        console.assert( report === undefined );
    }, 4000 );

    console.groupEnd();

    console.group("******* reports.set_report *********");

    setTimeout( function () {
        $.gevent.subscribe( $t, 'feed-setreport', 
            function( event, report_map ) {
                console.log( 'Report change:', report_map );
            });

        var current = feed.model.sidebar.get_report();
        console.assert( current === null );

        console.assert( feed.model.sidebar.set_report('id_01') === true );
        current = feed.model.sidebar.get_report();
        console.assert( current !== null );
    }, 4500 );
    console.groupEnd();

    console.groupEnd();

}; // eo test_model_sidebar


/************************************************
 *
 * Test of sidebar model
 * Use fake data
 * Listing 5.14 p.162 chp. 5.4.2
 *
 ************************************************/
test_create_report = function () {

    console.group("******* reports.create_ *********");

    /* init */
    // create a jquery collection
    var $t = $('<div/>');
    
    
    // have $t subscribe to 'feed-create' global custom events with test function
    $.gevent.subscribe( $t, 'feed-setreport', function () { 
        console.info( 'Creation!', arguments ) });
    $.gevent.subscribe( $t, 'feed-listchange', function () {
        console.info( '*Listchange', arguments ) });
    // Have $t subscribe to global custom events with test functions
    $.gevent.subscribe( $t, 'feed-login', function () {
        console.log( 'Hello!', arguments ); });

    //sign-in
    feed.model.people.login( 'Fred' );

    setTimeout( function () {
        // get the reports list
        var reportsDb = feed.model.reports.get_db();
            
        // get a report
        var newreport = { title : 'titre 4', locate_map : { x : 2, y : 2 }};
        // create report information
        feed.model.reports.create_( newreport );

        report = feed.model.sidebar.get_report();
        console.log( JSON.stringify( report.locate_map ) );
    }, 4500 );

    console.groupEnd();

}; // eo test_create_report

/************************************************
* 
* Launch test functions
* 
 ************************************************/

//test_customEvent();
//test_model_people();
//test_model_reports();
//test_model_sidebar();
test_create_report();
//test_signIn();
//test_remove_sidebar();
