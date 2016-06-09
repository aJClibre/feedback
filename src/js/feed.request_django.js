/**********************************
 * feed.request_django.js
 *
 * Module which make the request to the server
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

feed.fake = (function () {
    'use strict';
    var peopleList,  fakeIdSerial,   makeFakeId,    mockSio, 
        reportsList, fakeIdSerialR,  makeFakeIdR,   mockSioReport;

    fakeIdSerial    = 5;
    fakeIdSerialR   = 4;

    makeFakeId = function () {
        return 'id_' + String( fakeIdSerial++ );
    };

    makeFakeIdR = function () {
        return '150914_0' + String( fakeIdSerialR++ );
    };

    peopleList = [
        { 
            name : 'toto', _id : 'id_01',
            id_profil : 'pro_01',
            rules_map : { list_ : true, create_ : true, read_ : true, update_ : true, delete_ : true }
        },{
            name : 'tata', _id : 'id_02',
            id_profil : 'pro_01',
            rules_map : { list_ : true, create_ : true, read_ : true, update_ : false, delete_ : false }
        },{
            name : 'titi', _id : 'id_03',
            id_profil : 'pro_02',
            rules_map : { list_ : true, create_ : false, read_ : false, update_ : false, delete_ : false }
        }
        ];
/*
    reportsList = [
        {
            title : 'titre 11', _id : '150902_01',
            locate_map : { x: 5.501, y: 43.501 },
            doc : 'BonDeCommande2014.pdf'
        },{
            title : 'titre 22', _id : '150902_02',
            locate_map : { x: 5.6, y: 43.39 },
            doc : 'countries_europe_mapjpg.jpeg'
        },{
            title : 'titre 51', _id : '150808_05',
            locate_map : { x: 5.44, y: 43.47312 }
        },{
            title : 'titre 12', _id : '150702_01',
            locate_map : { x: 5.48, y: 43.5 },
            doc : 'P1040319.JPG'
        },{
            title : 'titre 24', _id : '150702_02',
            locate_map : { x: 5.55, y: 43.3 }
        },{
            title : 'titre 51', _id : '150908_05',
            locate_map : { x: 5.43, y: 43.473 }
        }
    ];
*/    
    
    // mockSio object closure
    //
    mockSio = (function () {
        var on_sio, emit_sio, 
        callback_map = {};
        
        // Registers a callback for a message type
        // the callback will receive message data as arguments
        on_sio = function ( msg_type, callback ) {
            //console.log( 'mockSio.on_sio.msg_type: ' + msg_type );
            callback_map[ msg_type ] = callback;
        };
    
        // Emulates sending a message to the server
        //
        emit_sio = function ( msg_type, data ) {
            var person_map;

            // respond to 'adduser' event with 'userupdate'
            // callback after a 3s delay
            //
            if ( msg_type === 'adduser' && callback_map.userupdate ) {
                setTimeout( function () {
                    person_map = {
                        _id         : makeFakeId(),
                        name        : data.name,
                        rules_map   : data.rules_map
                    };
                    peopleList.push( person_map );
                    callback_map.userupdate( [ person_map ] );
// console.info('fake.mockSioReport.emit_sio adduser');
                }, 1000 );
            }
        };

        return { emit : emit_sio, on : on_sio };
    }());

    // mockSioReport object closure
    //
    mockSioReport = (function () {
        var on_sio, emit_sio, 
            send_listchange, listchange_idto,
            callback_map = {};

        // Registers a callback for a message type
        // the callback will receive message data as arguments
        on_sio = function ( msg_type, callback ) {
            callback_map[ msg_type ] = callback;
        };

        // Emulates sending a message to the server
        //
        emit_sio = function ( msg_type, data ) {
            var report_map, i;
            
            // respond to 'addreport' event with 'reportupdate'
            // callback after a 3s delay
            //
            if ( msg_type === 'createreport' && callback_map.listchange ) {
                console.dir(data);
                $.post('../feed/', data, function(result) {
                    callback_map.listchange([ result, data ]);
                }, "json");
            }

            // simulate send 'updatereport' message and data to the server
            else if ( msg_type === 'updatereport' && callback_map.listchange ) {

                console.dir(data);
                $.post('../feed/', data)
                    .done(function(result) {
                    callback_map.listchange([ result ]);
                }, "json");
            }

            // data come from jqueryMap.$fileupload in sidebar.js. It is a 
            // https://github.com/blueimp/jQuery-File-Upload/wiki/Basic-plugin object
            // the callback is onSubmitDocEnd in sidebar.js
            else if ( msg_type === 'uploadreport' && callback_map.listchange ) {
                data.submit();                
            }

            // simulate send 'deletereport' message and data to the server
            else if ( msg_type === 'deletereport' && callback_map.listchange ) {
                //console.dir(data);
                $.get('../feed/', {id: data})
                    .done(function(result) {
                        console.dir(result);
                        callback_map.listchange([ result ]);
                    }, "json");
            }

            // 
            else if ( msg_type === 'getreports' && callback_map.listchange ) {
                // http://api.jquery.com/jQuery.get/
                $.get('../feed/', function(result) {
                    console.dir(result);
                    // execute callback for the 'listchange' message
                    callback_map.listchange([ result ]);
                }, "json"); //callListchange(data));
            }
        };

        // NOT USED car simule l'attente du serveur 
        // remplace par : if ( msg_type === 'getreports' && callback_map.listchange )
        // try once per second to use listchange callback
        // Stop trying after first success.
        // Emulates the receipt of a listchange message from the backend
        // Once per second, it looks for the listchange callback.
        // If the callback is found, it's executed using the mock
        // reportsList as its argument, and send_listchange stops polling.
        //
        send_listchange = function () {
            listchange_idto = setTimeout( function () {
    console.log('send_listchange');
                if ( callback_map.listchange ) {
                    callback_map.listchange([ reportsList ]);
                    listchange_idto = undefined;
                }
                else { send_listchange(); }
            }, 1000 );
        };

        // start the process
        //send_listchange();

        return { emit : emit_sio, on : on_sio };
    }());

    return { 
        mockSio         : mockSio,
        mockSioReport   : mockSioReport
    };
}());
