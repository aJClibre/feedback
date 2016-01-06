/**********************************
 * feed.util_b.js
 *
 * code for the feedback information application
 * Javascript browser utilities
 * Compiled by Michael S. Mikowski
 * These are routines I have created and updated
 * since 1998, with inspiration from around the web.
 * MIT License
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

/*jslint        browser : true, continue: true,
  devel : true, indent  : 4,    maxerr  : 50,
  newcap: true, nomen   : true, plusplus: true,
  regexp: true, sloppy  : true, vars    : false,
  white : true
*/
/*global $, feed, getComputedStyle */

feed.util_b = (function () {
    'use strict';

    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
        configMap = {
            regex_encode_html  : /[&"'><]/g,
            regex_encode_noamp : /["'><]/g,
            html_encode_map    : {
                '&' : '&#38;',
                '"' : '&#34;',
                "'" : '&#39;',
                '>' : '&#62;',
                '<' : '&#60;'
            }
        },

        decodeHtml,  encodeHtml, getEmSize;

        configMap.encode_noamp_map = $.extend(
            {}, configMap.html_encode_map
    );
    delete configMap.encode_noamp_map['&'];
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN UTILITY METHODS ------------------
    // Begin decodeHtml
    // Decodes HTML entities in a browser-friendly way
    // See http://stackoverflow.com/questions/1912501/\
    //   unescape-html-entities-in-javascript
    //
    decodeHtml = function ( str ) {
        return $('<div/>').html(str || '').text();
    };
    // End decodeHtml


    // Begin encodeHtml
    // This is single pass encoder for html entities and handles
    // an arbitrary number of characters
    //
    encodeHtml = function ( input_arg_str, exclude_amp ) {
        var
            input_str = String( input_arg_str ),
            regex, lookup_map
        ;

        if ( exclude_amp ) {
            lookup_map = configMap.encode_noamp_map;
            regex      = configMap.regex_encode_noamp;
        }
        else {
            lookup_map = configMap.html_encode_map;
            regex      = configMap.regex_encode_html;
        }
        return input_str.replace(regex,
            function ( match, name ) {
                return lookup_map[ match ] || '';
            }
        );
    };
    // End encodeHtml

    // Begin getEmSize
    // returns size of ems in pixels
    //
    getEmSize = function ( elem ) {
        return Number(
            getComputedStyle( elem, '' ).fontSize.match(/\d*\.?\d*/)[0]
        );
    };
    // End getEmSize

    // export methods
    return {
        decodeHtml : decodeHtml,
        encodeHtml : encodeHtml,
        getEmSize  : getEmSize
    };
    //------------------- END PUBLIC METHODS ---------------------
}());
