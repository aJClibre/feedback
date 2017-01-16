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
    var peopleList,  rulesMapList, fakeIdSerial,   makeFakeId,    mockSio, 
        reportsList, mockSioReport;

    fakeIdSerial    = 5;

    makeFakeId = function () {
        return 'id_' + String( fakeIdSerial++ );
    };

    peopleList = [];

    rulesMapList = {
        'admin'     : { list_ : true, create_ : true, read_ : true, update_ : true, delete_ : true },
        'view'      : { list_ : true, create_ : false, read_ : false, update_ : false, delete_ : false }
    };
/*
    reportsList = [
        {
            id_equi : 'titre 11', _id : '150902_01',
            locate_map : { x: 5.501, y: 43.501 },
            doc : 'BonDeCommande2014.pdf'
        },{
            id_equi : 'titre 22', _id : '150902_02',
            locate_map : { x: 5.6, y: 43.39 },
            doc : 'countries_europe_mapjpg.jpeg'
        },{
            id_equi : 'titre 51', _id : '150808_05',
            locate_map : { x: 5.44, y: 43.47312 }
        },{
            id_equi : 'titre 12', _id : '150702_01',
            locate_map : { x: 5.48, y: 43.5 },
            doc : 'P1040319.JPG'
        },{
            id_equi : 'titre 24', _id : '150702_02',
            locate_map : { x: 5.55, y: 43.3 }
        },{
            id_equi : 'titre 51', _id : '150908_05',
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
                        _id         : data.cid,
                        rule        : data.rule,
                        rules_map   : rulesMapList[data.rule] 
                    };
                    peopleList.push( person_map );
                    callback_map.userupdate( [ person_map ] );
// console.info('fake.mockSioReport.emit_sio adduser');
                }, 10 );
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
            //
            if ( msg_type === 'createreport' && callback_map.listchange ) {
                //console.dir(data);
                // to make the difference between a report created with jquery-file-upload or
                // with the form
                if ( data.cid ) {
                    $.post('../feed/', data, function(result) {
                        callback_map.listchange([ result, data ]);
                    }, "json");
                }
                else {
                    // {fileInput: Object, form: Object, files: Array[1], fileInputClone: Object, 
                    // originalFiles: Array[1], paramName: "files[]",  submit: ._addConvenienceMethods/data.submit(), 6 de plus…}
                    data.submit();
                }
            }

            // simulate send 'updatereport' message and data to the server
            else if ( msg_type === 'updatereport' && callback_map.listchange ) {

                //console.dir(data);
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

            else if ( msg_type === 'deletedoc' && callback_map.listchange ) {
                // add doc: true to make the difference with 'deletereport' get request
                $.get( '../feed/', { id: data, doc: true })
                    .done( function( result ) {
                        callback_map.listchange([ result ]);
                     }, "json");
            }

            // simulate send 'deletereport' message and data to the server
            else if ( msg_type === 'deletereport' && callback_map.listchange ) {
                //console.dir(data);
                $.get( '../feed/', { id: data })
                    .done( function( result ) {
                        //console.dir( result );
                        callback_map.listchange([ result ]);
                    }, "json");
            }

            // 
            else if ( msg_type === 'getreports' && callback_map.listchange ) {
                // http://api.jquery.com/jQuery.get/
                $.get( '../feed/', function( result ) {
                    //console.dir( result );
                    // execute callback for the 'listchange' message
                    callback_map.listchange([ result ]);
                }, "json"); //callListchange(data));
            }

            else if ( msg_type === 'downloadreports' ) {
                window.location.href = '../feed/csv/?ids=' + data.list.toString();
            }
        };

        return { emit : emit_sio, on : on_sio };
    }());

    return { 
        mockSio         : mockSio,
        mockSioReport   : mockSioReport
    };
}());
