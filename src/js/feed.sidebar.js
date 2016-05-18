/**********************************
 * feed.sidebar.js
 *
 * Content feature module of the sidebar
 * for Feeback Information application
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
/*global $, feed  */

feed.sidebar = (function () {
    'use strict';
    //--------------------- MODULE SCOPE VARIABLES ----------------
    var
        configMap = {
            main_html : String()
              + '<div id="sidebar" class="sidebar collapsed">'
                + '<ul class="sidebar-tabs" role="tablist">' // Nav tabs
                  + '<li id="t_home" class="tab" title="Liste"><a href="#" role="tab"><i class="fa fa-bars"></i></a></li>'
                  + '<li id="t_report" class="tab" title="D&eacute;tail"><a href="#" role="tab"><i class="fa fa-pencil"></i></a></li>'
                  + '<li id="t_create" class="tab" title="Cr&eacute;ation"><a href="#" role="tab"><i class="fa fa-plus"></i></a></li>'
                  + '<li id="t_settings" class="tab" title="Param&egrave;tres"><a href="#" role="tab"><i class="fa fa-gear"></i></a></li>'
                + '</ul>'
                + '<div class="sidebar-content feed-sidebar-content active">'
                  + '<div class="sidebar-pane feed-sidebar-content-home active" id="home">'
                    + '<h1>Liste des rapports</h1>'
                    + '<div class="feed-sidebar-content-home-box"></div>' 
                    + '<button type="update" class="btn btn-primary list-refresh">Rafraichir</button>'
                    + '<a type="button" class="btn btn-primary list-download" href="../feed/csv/">T&eacute;l&eacute;charger</a>'
                  + '</div>'
                  + '<div class="sidebar-pane feed-sidebar-content-report" id="report">'
                    + "<h1>D&eacute;tails</h1>"
                    + '<h4 class="bg-danger is_selected">Veuillez s&eacute;lectionner un rapport</h4>'
                    + '<form class="feed-sidebar-content-report-form" id="form_modify">'
                      + '<div class="form-group">'
                        + '<label class="col-md-12 control-label feed-sidebar-content-report-form-id">ID</label>'
                        + '<input type="text" class="form-control form-title feed-sidebar-content-report-form-title required" id="title" placeholder="Titre" data-validation="required" >'
                        + '<!-- <p class="help-block">In addition to freeform text, any HTML5 text-based input appears like so.</p> -->'
                      + '</div>'
                      + '<div class="form-group">'
                        + '<label class="col-md-12 control-label form-label-localisation">Localisation (WGS84)</label>'
                        + '<input type="text" class="col-md-5 feed-sidebar-content-report-form-x" id="x" placeholder="Longitude" readonly>'
                        + '<input type="text" class="col-md-5 col-md-offset-2 feed-sidebar-content-report-form-y" id="y" placeholder="Latitude" readonly>'
                      + '</div>'
                      + '<div class="form-group">'
                        + '<label for="report-textarea" class="col-md-12 control-label form-label-description">Description</label>'
                        + '<textarea id="report-textarea" class="form-control feed-sidebar-content-report-form-textarea" rows="3"></textarea>'
                      + '</div>'
                      + '<div class="form-group feed-sidebar-content-report-form-group-doc-create">'
                        + '<label for="reportInputDoc" class="col-md-12 control-label">Document...</label>'
                        + '<input type="file" class="filestyle feed-sidebar-content-report-form-file" id="reportInputDoc" data-buttonName="btn-primary" data-placeholder="Aucun fichier">'
                      + '</div>'
                          // + '<div class="form-group feed-sidebar-content-report-form-group-img-create">'
                            //   + '<label for="reportInputImg" class="col-md-12 control-label feed-sidebar-content-report-form-group-img-label">Image input</label>'
                            //   + '<input type="file" class="filestyle feed-sidebar-content-report-form-file" id="reportInputImg" data-buttonName="btn-primary" data-placeholder="No file">'
                            // + '</div>'
                      + '<div class="form-group feed-sidebar-content-report-form-group-doc-delete">'
                        + '<label class="control-label feed-sidebar-content-report-form-doc-label"></label>'
                        + '<span class="glyphicon glyphicon-remove g-delete" aria-hidden="true"></span>'
                      + '</div>'
                      + '<div class="form-group">'
                        + '<p class="help-block">Example block-level help text here.</p>'
                        + '<button class="btn btn-primary report-modify">Modifier</button>'
                        + '<button class="btn btn-primary report-cancel">Annuler</button>'
                      + '</div>'
                    + '</form>'
                  + '</div>'
                  + '<div class="sidebar-pane feed-sidebar-content-create" id="create">'
                    + '<h1>Cr&eacute;er un rapport</h1>'
                    + '<form class="feed-sidebar-content-create-form" id="form_create" name="create_form">'
                        + '<div class="form-group">'
                          + '<!-- <label for="title" class="col-sm-2 control-label">Titre</label> -->'
                          + '<input type="text" class="form-control form-title feed-sidebar-content-create-form-title required" id="titleCreate" placeholder="Titre" data-validation="required" >'
                          + '<!-- <p class="help-block">In addition to freeform text, any HTML5 text-based input appears like so.</p> -->'
                        + '</div>'
                        + '<div class="form-group">'
                          + '<label class="col-md-12 control-label form-label-priority">Priorit&eacute;</label>'
                          + '<select class="form-control">'
                            + '<option value="INFO">Information</option>'
                            + '<option value="UTIL">Utile</option>'
                            + '<option value="URGE">Urgent</option>'
                          + '</select>'
                        + '</div>'
                        + '<div class="form-group">'
                          + '<label class="col-md-12 control-label form-label-priority">Statut</label>'
                          + '<select class="form-control">'
                            + '<option value="CRE">Cr&eacute;&eacute;</option>'
                            + '<option value="MOD">Modif&eacute;</option>'
                            + '<option value="VAL">Valid&eacute;</option>'
                            + '<option value="TRE">Trait&eacute;</option>'
                            + '<option value="DEL">Supprim&eacute;</option>'
                          + '</select>'
                        + '</div>'
                        + '<div class="form-group">'
                          + '<label class="col-md-12 control-label form-label-localisation">Localisation (WGS84)</label>'
                          + '<input type="text" class="col-md-5 feed-sidebar-content-create-form-x" id="xCreate" placeholder="Longitude" readonly>'
                          + '<input type="text" class="col-md-5 col-md-offset-2 feed-sidebar-content-create-form-y" id="yCreate" placeholder="Latitude" readonly>'
                        + '</div>'
                        + '<div class="form-group">'
                          + '<label for="textareaCreate" class="col-md-12 control-label form-label-description">Description</label>'
                          + '<textarea id="textareaCreate" class="form-control feed-sidebar-content-create-form-textarea" rows="3"></textarea>'
                        + '</div>'
                        + '<!--<div class="form-group feed-sidebar-content-create-form-group-doc-create">'
                          + '<label for="createInputDoc" class="col-md-12 control-label">Document...</label>'
                          + '<input type="file" class="filestyle feed-sidebar-content-create-form-file" id="createInputDoc" data-buttonName="btn-primary" data-placeholder="No file">'
                          + '<p class="help-block">Example block-level help text here.</p>'
                        + '</div>'
                        + '<div class="form-group feed-sidebar-content-create-form-group-doc-delete">'
                          + '<label class="control-label feed-sidebar-content-create-form-doc-label"></label>'
                          + '<span class="glyphicon glyphicon-remove g-delete" aria-hidden="true"></span>'
                        + '</div>-->'
                        + '<div class="form-group">'
                            + '<button class="btn btn-primary report-create">Cr&eacute;er</button>'
                            + '<button type="reset" class="btn btn-primary reset">Annuler</button>'
                        + '</div>'
                      + '</form>'
                  + '</div>'
                    + '<div class="sidebar-pane" id="settings">'
                        + '<h1>Param&egrave;tres</h1>'
                        + '<p>Welcome to the new sidebar which let you create and manage geolocated Information reports.<br/>'
                        + 'Do not hesitate to contact us with questions or comment! <a href="mailto:#">webmaster@valabre.com</a></p>'
                    + '</div>'
                + '</div>'
                + '<div class="modal fade feed-sidebar-modal-img" id="modalImg" tabindex="-1" role="dialog" aria-labelledby="modal-img-title"> '
                + ' <div class="modal-dialog modal-lg" role="document">'
                + '   <div class="modal-content">'
                + '     <div class="modal-body">'
                + '         <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                + '         <h4 class="feed-sidebar-modal-img-title" id="modal-img-title"></h4>'
                + '         <img class="img img-responsive img-thumbnail feed-sidebar-modal-img-body-img center-block" alt="No image" src="">'
                + '     </div>'
                + '   </div>'
                + ' </div>'
                + '</div>'
                + '<div class="modal fade feed-sidebar-modal-message" id="modalMess" tabindex="-1" role="dialog" data-backdrop="false" aria-labelledby="modal-img-title"> '
                + ' <div class="modal-dialog" role="document">'
                + '   <div class="modal-content">'
                + '     <div class="modal-header bg-primary">'
                + '         <h4 class="feed-sidebar-modal-message-title" id="modalMessTitle">Message</h4>'
                + '     </div>'
                + '     <div class="bg-warning modal-body">'
                + '         <strong><p class="feed-sidebar-modal-message-body-p"></p></strong>'
                + '     </div>'
                + '   </div>'
                + ' </div>'
                + '</div>'
              + '</div>'
              + '<!-- http://formvalidator.net/index.html --> <script>'
                + '$.validate();'
              + '</script>',
              //doc_path : '/media/doc/', // have to be idem to feed.sidebar.js TODO : put outside of this file

            settable_map : {
                sidebar_model       : true,
                people_model        : true,
                reports_model       : true,
                set_sidebar_anchor  : true,
                doc_path            : true
            },
            sidebar_model       : null,
            people_model        : null,
            reports_model       : null,
            set_content_anchor  : null
        },
        stateMap    = { 
            $append_target      : null,
            position_type       : 'closed',
            active_tab_id       : null,
            active_report_id    : null
        },
        jqueryMap   = {},

        setJqueryMap,       setSliderPosition,  writeAlert,
        clearSidebar,       clearList,          clearFormsError,
        onTapToggle,        onTapModifyReport,  onTapEditReport,
        onTapDeleteReport,  onTapCancelReport,  onTapCreateReport,
        onTapDeleteDoc,     onTapList,          onClickMarker,
        onTapRefreshList,   onSetReport,        onListchange,
        onHoverList,        onOutList,          onHoverMarker,
        onCoordChange,      onSetCoord,         onLogin,
        onLogout,           onTapDownloadList,
        configModule,       initModule,
        removeSlider,   handleResize;
    //--------------------- eo Module scope -----------------------
    
    //--------------------- UTILITY METHODS -----------------------
    //--------------------- eo utility methods --------------------

    //--------------------- DOM METHODS ---------------------------
    // DOM method /setJqueryMap/
    //
    setJqueryMap = function () {        
        var 
            $append_target = stateMap.$append_target,
            $slider = stateMap.$append_target.find( '.sidebar' );

        jqueryMap = { 
            $slider             : $slider,
            $tabs               : $slider.find( '.tab' ),
            $content            : $slider.children( '.sidebar-content' ).first(),
            $list_box           : $slider.find( '.feed-sidebar-content-home-box' ),
            $form_report        : $slider.find( '.feed-sidebar-content-report-form' ),
            $report_groups      : $slider.find( '.feed-sidebar-content-report-form .form-group' ),
            $report_id          : $slider.find( '.feed-sidebar-content-report-form-id' ),
            $report_title       : $slider.find( '.feed-sidebar-content-report-form-title' ),
            $report_textarea    : $slider.find( '.feed-sidebar-content-report-form-textarea' ),
            $report_x           : $slider.find( '.feed-sidebar-content-report-form-x' ),
            $report_y           : $slider.find( '.feed-sidebar-content-report-form-y' ),
            $report_doc_label   : $slider.find( '.feed-sidebar-content-report-form-doc-label' ),
            $report_doc_create  : $slider.find( '.feed-sidebar-content-report-form-group-doc-create' ),
            $report_doc_input   : $slider.find( '.feed-sidebar-content-report-form-file' ),
            $report_doc_delete  : $slider.find( '.feed-sidebar-content-report-form-group-doc-delete' ),
            $form_create        : $slider.find( '.feed-sidebar-content-create-form' ),
            $create_groups      : $slider.find( '.feed-sidebar-content-create-form .form-group' ),
            $create_title       : $slider.find( '.feed-sidebar-content-create-form-title' ),
            $create_textarea    : $slider.find( '.feed-sidebar-content-create-form-textarea' ),
            $create_doc_label   : $slider.find( '.feed-sidebar-content-create-form-doc-label' ),
            $create_doc_create  : $slider.find( '.feed-sidebar-content-create-form-group-doc-create' ),
            $create_doc_input   : $slider.find( '.feed-sidebar-content-create-form-file' ),
            $create_doc_delete  : $slider.find( '.feed-sidebar-content-create-form-group-doc-delete' ),
            $create_x           : $slider.find( '.feed-sidebar-content-create-form-x' ),
            $create_y           : $slider.find( '.feed-sidebar-content-create-form-y' ),
            $is_selected        : $slider.find( '.is_selected' ),
            $butt_refresh       : $slider.find( '.list-refresh' ),
            $butt_download      : $slider.find( '.list-download' ),
            $butt_modify        : $slider.find( '.report-modify' ),
            $butt_cancel        : $slider.find( '.report-cancel' ),
            $butt_create        : $slider.find( '.report-create' ),
            $modal_img_title    : $slider.find( '.feed-sidebar-modal-img-title' ),
            $modal_img_img      : $slider.find( '.feed-sidebar-modal-img-body-img' ),
            $modal_mess         : $slider.find( '.feed-sidebar-modal-message' ),
            $modal_mess_title   : $slider.find( '.feed-sidebar-modal-message-title' ),
            $modal_mess_p       : $slider.find( '.feed-sidebar-modal-message-body-p' )
        };
    };

    // Public method /setSliderPosition/
    // Example      : feed.sidebar.setSliderPosition( 'closed' );
    // Purpose      : ensure sidebar is in the requested state
    // Arguments    :
    //   * position_type - enum('closed', 'opened', or 'hidden')
    //   * tab_name - name of the tab to activate
    //   * callback - optional callback at end of animation.
    //      (callback receives slider DOM element as argument)
    // Action       :
    // Move the slider into the requested position.
    // 
    // Returns      :
    //  * true - requested state was achieved
    //  * false - requested state was not achieved
    // Throws       : none
    //
    setSliderPosition = function ( position_type, tab_name, callback ) {

        // prepare animate parameters
        switch ( position_type ) {
            case 'opened' : 
                //// console.log( 'setSliderPosition case: ' + position_type );
                jqueryMap.$slider.trigger('opening'); 
                jqueryMap.$slider.removeClass('collapsed');
                jqueryMap.$tabs
                    .removeClass( 'active' )
                    .filter( '#t_'+ tab_name )
                    .addClass( 'active' );
                jqueryMap.$content
                    .find('.sidebar-pane')
                    .removeClass( 'active' )
                    .end()
                    .find( '#' + tab_name )
                    .addClass( 'active' );
            break;
            case 'hidden' : 
                // console.log( 'setSliderPosition case: ' + position_type );
            break;
            case 'closed' : 
                jqueryMap.$slider
                  .trigger('closing')
                  .addClass('collapsed');
                jqueryMap.$tabs
                  .removeClass('active');
            break;
            // bail for unknown position_type
            default : return false;
        }

        stateMap.position_type  = position_type;
        stateMap.active_tab_id = tab_name;
        if ( callback ) { callback( jqueryMap.$slider ); }
        
        return true;
    }; // eo setSliderPosition


    // append system alerts to the message log
    // open the message modal
    // type : primary, success, info, warning, danger
    //
    writeAlert = function ( event, alert_map ) {

        jqueryMap.$modal_mess_p.html( feed.util_b.encodeHtml( alert_map.text ) );
        jqueryMap.$modal_mess.modal('show');

        setTimeout( function () {
            jqueryMap.$modal_mess.modal('hide');
        }, 3500 );
    };

    // Clear the sidebar 
    clearSidebar = function () {
        // report form
        jqueryMap.$report_id.html('');
        jqueryMap.$report_title.val('')
            .attr("placeholder", 'titre' );
        jqueryMap.$report_textarea.val('');
        jqueryMap.$report_x.val('')
            .attr("placeholder", 'Longitude' );
        jqueryMap.$report_y.val( '' )
            .attr("placeholder", 'Latitude' );
        jqueryMap.$report_doc_input.val('')
            .attr("placeholder", 'No file' );
        jqueryMap.$is_selected.show();
        stateMap.active_report_id = null;

        // create form
        jqueryMap.$create_title.val('')
            .attr("placeholder", 'titre' );
        jqueryMap.$create_textarea.val('');
        jqueryMap.$create_x.val('')
            .attr("placeholder", 'Longitude' );
        jqueryMap.$create_y.val('')
            .attr("placeholder", 'Latitude' );
        jqueryMap.$create_doc_input.val('')
            .attr("placeholder", 'No file' );

        // img modal
        jqueryMap.$modal_img_title.val('');
        jqueryMap.$modal_img_img.attr("src", '' );

        clearFormsError();
    };

    clearList = function () {
      jqueryMap.$list_box.html('No report to display');
    }

    clearFormsError = function () {
        jqueryMap.$form_report.get(0).reset();
        jqueryMap.$form_create.get(0).reset();
    };

    //--------------------- eo dom methods ------------------------
   
    //--------------------- EVENT HANDLERS ------------------------
    // Update the onClick event handler to make a call to change the
    // URI anchor and then exit, leaving the hashchange event handler
    // in the shell to pick up the change
    onTapToggle = function ( event ) {
        var 
            do_open = true,
            selected_tab_id = '',
            $selected_tab   = $( event.currentTarget ), // selected by the user click 
            current_tab_id  = stateMap.active_tab_id 
        ;

       if ( ! $selected_tab.hasClass( 'tab' ) ) { return false; }

        selected_tab_id = $selected_tab[0].id.split('t_')[1];

        if ( stateMap.position_type === 'opened' && selected_tab_id === current_tab_id ) {
                do_open = false;
        }

        configMap.set_sidebar_anchor({
            sidebar : ( do_open ? 'opened' : 'closed' ),
            tab     : selected_tab_id
        });
        return false;
    };

   
    //
    onTapModifyReport = function ( event ) {

        if ( configMap.people_model.get_user().get_is_anon() ) {
            writeAlert( null, { text: 'Please connect before update !' } );
            clearSidebar();
            clearList();
            return;
        }

        if ( jqueryMap.$report_groups.children(".has-error").length ) {
            writeAlert( null, { text: 'Please complete the form before submit !' } );
            event.preventDefault();
            return;
        }
console.log("onTapModifyReport textarea: " + jqueryMap.$report_textarea.val());        
        if ( stateMap.active_report_id ) {
            configMap.reports_model.update_({
                _id         : stateMap.active_report_id,
                locate_map  : { x : jqueryMap.$report_x.val(), y : jqueryMap.$report_y.val() },
                title       : jqueryMap.$report_title.val(),
                textarea    : jqueryMap.$report_textarea.val(),
                doc         : jqueryMap.$report_doc_input.val()
            });
        }
        else {
            writeAlert( null, { text: 'Please select a report before submit !' } );
            event.preventDefault();
            return;
        }
    };

    
    onTapDeleteReport = function ( event ) {
        var report_id, 
            $tapped = $( event.target );

        if ( ! $tapped.hasClass( 'g-remove' ) ) { return false; }

        report_id = $tapped.attr( 'gly-id' );

        if ( ! report_id ) { return false; }

        configMap.sidebar_model.set_report( report_id );

        if ( confirm( "Voulez-vous supprimer ce rapport ?" ) ) {
            configMap.reports_model.delete_( report_id );
        }
    };

    onTapEditReport = function ( event ) {
        var report_id, 
            $tapped = $( event.target );

        if ( ! $tapped.hasClass( 'g-edit' ) ) { return false; }

        report_id = $tapped.attr( 'gly-id' );

        if ( ! report_id ) { return false; }

        // to prevent erase values
        if ( report_id !== stateMap.active_report_id ) {
          clearFormsError();

          configMap.sidebar_model.set_report( report_id );
        }

// console.log('before configMap.set_sidebar_anchor');
        configMap.set_sidebar_anchor({
            sidebar : 'opened',
            tab     : 'report'
        });
        
        return false;
    };

    //
    onTapCancelReport = function ( event ) {
        
        if ( stateMap.active_report_id ) {
            clearFormsError();
            configMap.reports_model.cancel_( stateMap.active_report_id );
        }
    };

    onTapCreateReport = function ( event ) {
        console.dir($( "#form_create" ).serialize());
        $.post('../feed/', $( "#form_create" ), function( response ) {
            console.dir(response);
        });
        

      /* 
        configMap.reports_model.create_({
            locate_map  : { x : jqueryMap.$create_x.val(), y : jqueryMap.$create_y.val() },
            title       : jqueryMap.$create_title.val(),
            textarea    : jqueryMap.$create_textarea.val(),
            doc         : jqueryMap.$create_doc_input[0].files[0]
        });
      */
    };

    onTapDeleteDoc = function ( event ) {
        jqueryMap.$report_doc_label.html( '' );
        jqueryMap.$report_doc_create.show();
        jqueryMap.$report_doc_delete.hide();
    };

    // handler for a user generated event when he clicks or tap on
    // a report title. Use the model.sidebar.set_report method to set 
    // the selected report.
    //
    onTapList = function ( event ) {
      var report_id, report,
          $tapped = $( event.elem_target.parentNode );

      if ( ! $tapped.hasClass( 'feed-sidebar-content-list-name' ) ) { return false; }

      report_id = $tapped.attr( 'tr-id' );
      if ( ! report_id ) { return false; }

      if ( report_id === stateMap.active_report_id ) { return false; }

      configMap.sidebar_model.set_report( report_id );

      return false;
    };

    // event handler for the feed-clickmarker sidebar event. Fires
    // when the user click on a marker
    //
    onClickMarker = function ( event, id ) {
        var report;
      // clearFormsError();
      // configMap.sidebar_model.set_report( id );

        jqueryMap.$modal_img_title.html( id );
        report = configMap.reports_model.get_by_cid( id );
        if ( report && (/\.(gif|jpg|jpeg|tiff|png)$/i).test(report.doc) ) {
            jqueryMap.$modal_img_img.attr("src", configMap.doc_path + report.doc );
        }

      return false;
    };

    onTapRefreshList = function ( event ) {
        configMap.sidebar_model.get_list();
    };

    onTapDownloadList = function ( event ) {
        configMap.sidebar_model.down_list();
    };

    // event handler for the feed-setreport model event. Selects the
    // new report and deselects the old one.
    //
    onSetReport = function ( event, arg_map ) {
        var 
            form_html   = String(),
            new_report  = arg_map.new_report,
            old_report  = arg_map.old_report;
// console.log('onSetReport : ' + new_report.title );
        if ( new_report.get_is_empty() ) {
            clearSidebar();
            // TODO : modify the jqueryMap.$form-group to erase the error messages
            return false;
        }

        jqueryMap.$list_box
            .find( '.feed-sidebar-content-list-name' )
            .removeClass( 'feed-x-select' )
            .end()
            .find( '[tr-id=' + new_report.id + ']' )
            .addClass( 'feed-x-select' );

        clearFormsError();
// console.log('onSetReport 2: ' + new_report.title );        
        jqueryMap.$is_selected.hide();
        stateMap.active_report_id = new_report.id;
        jqueryMap.$report_id.html( arg_map.new_report.id );
        jqueryMap.$report_title.val( new_report.title );
        jqueryMap.$report_textarea.val( new_report.textarea );
        jqueryMap.$report_x.val( new_report.locate_map.x );
        jqueryMap.$report_y.val( new_report.locate_map.y );
        
        if ( new_report.doc ) {
            jqueryMap.$report_doc_label.html( new_report.doc );
            jqueryMap.$report_doc_create.hide();
            jqueryMap.$report_doc_delete.show();
        }
        else {
            jqueryMap.$report_doc_label.html( '' );
            jqueryMap.$report_doc_create.show();
            jqueryMap.$report_doc_delete.hide();
        }

        jqueryMap.$create_title.val( '' )
            .attr("placeholder", 'titre' );
        jqueryMap.$create_textarea.val('');
        jqueryMap.$create_x.val( '' )
            .attr("placeholder", 'Latitude' );
        jqueryMap.$create_y.val( '' )
            .attr("placeholder", 'Longitude' );
        jqueryMap.$create_doc_input.val('')
            .attr("placeholder", 'No file' );

        // load values in the img modal
        onClickMarker( null, new_report.id );

        return true;
    };

    // event handler for the feed-listchange model event.
    // renders the reports list, highlighted the current report if defined
    //
    onListchange = function( event ) {
  
        var 
            is_reports = false,
            reports_db = configMap.reports_model.get_db(),
            list_html = String()
              + '<div class="table-responsive">'
                + '<table id="tableReports" class="table table-hover">'
                    + '<thead>'
                        + '<tr>'
                            + '<th>#</th>'
                            + '<th>Title</th>'
                            + '<th class="pull-right">Action</th>'
                        + '</tr>'
                    + '</thead>'
                    + '<tbody>';

        reports_db().each( function ( report, idx ) {
// console.log('reports_db.each : ' + report.id );            
            var select_class = '';

            if ( report.get_is_empty() ) { // || report.get_is_report()
                return true;
            }
            if ( stateMap.active_report_id && stateMap.active_report_id === report.id ) {
                select_class = ' feed-x-select';
            }
            list_html
                += '<tr class="feed-sidebar-content-list-name' + select_class + '" tr-id="' + report.id + '">'
                    + '<th data-id="' + report.id + '">'
                        + feed.util_b.encodeHtml( report.id )
                    + '</th>'
                    + '<th scope="row">'
                        + feed.util_b.encodeHtml( report.title ) 
                    + '</th>'
                    + '<th>'
                        + '<span class="glyphicon glyphicon-remove pull-right g-remove" gly-id="' + report.id + '" aria-hidden="true"></span>'
                        + '<span class="glyphicon glyphicon-pencil pull-right g-edit" gly-id="' + report.id + '" aria-hidden="true"></span>'
                    + '</th>'
                + '</tr>';
            is_reports = true;
        });

        list_html
                += '</tbody>'
            + '</table>'
          + '</div>'

        if ( ! is_reports ) {
            list_html = String()
                + '<div class="spa-chat-list-note">'
                    + ' No report to display !'
                + '</div>';
            clearSidebar();
            clearList();
        }

        jqueryMap.$list_box.html( list_html );

        jqueryMap.$slider.find( '.g-remove' ).bind( 'click', onTapDeleteReport );
        jqueryMap.$slider.find( '.g-edit' ).bind( 'click', onTapEditReport );
        jqueryMap.$list_box.find( 'tr' ).bind( 'mouseover', onHoverList );
        jqueryMap.$list_box.find( 'tr' ).bind( 'mouseout', onOutList );

        $('#tableReports').DataTable();
        
        // stop handling of the event !
        // same as : event.preventDefault() + event.stopPropagation() + event.preventImmediatPropagation()
        return false;
    };

    // Event handler for mouseover event publish by 
    // jqueryMap.$list_box when mouse over a 'tr'
    //
    onHoverList = function ( e ) {
      var report_id,
        $tapped = $( e.currentTarget );

      if ( ! $tapped.hasClass( 'feed-sidebar-content-list-name' ) ) { return false; }

      report_id = $tapped.attr( 'tr-id' );
      if ( ! report_id ) { return false; }
    
      $.gevent.publish( 'feed-listhover', report_id );
    };

    // Event handler for mouseout event publish by 
    // jqueryMap.$list_box when mouse out of a 'tr'
    //
    onOutList = function( e ) {
        $.gevent.publish( 'feed-listhover', '' );
    };

    // Event handler for feed-hover map event publish
    // during the mouse is over a marker
    //
    onHoverMarker = function ( event, id_report ) {
      if ( id_report ) {
        jqueryMap.$list_box.find( '[tr-id=' + id_report + ']' ).addClass( 'tr-selected' );
      }
      else {
        jqueryMap.$list_box.find( 'tr' ).removeClass( 'tr-selected' );
      }
    };

    // Event handler for feed-coord map event publish
    // during create a new report
    //
    onCoordChange = function ( event, coord_map ) {
      jqueryMap.$create_x.val( coord_map.x );
      jqueryMap.$create_y.val( coord_map.y );
    };

    // Event handler for feed-setcoord map event publish
    // during modify a report
    //
    onSetCoord = function ( event, coord_map ) {
      jqueryMap.$report_x.val( coord_map.x );
      jqueryMap.$report_y.val( coord_map.y );
    };

    // Event handler for feed-login model event
    //
    onLogin = function ( event, login_user ) {
console.info('sidebar.onLogin');
//        configMap.set_sidebar_anchor( { sidebar: 'opened' } );
    };

    onLogout = function ( event, logout_user ) {
        configMap.set_sidebar_anchor( { sidebar: 'closed' } );
        clearSidebar();
    };

    //--------------------- eo event handlers ---------------------

    //--------------------- PUBLIC METHODS ------------------------
    // Begin public method /removeSlider/
    // Purpose    :
    //   * Removes sidebarSlider DOM element
    //   * Reverts to initial state
    //   * Removes pointers to callbacks and other data
    // Arguments  : none
    // Returns    : true
    // Throws     : none
    //
    removeSlider = function () {
        // unwind initialization and state
        // remove DOM container; this removes event bindings too
        if ( jqueryMap.$slider ) {
            jqueryMap.$slider.remove();
            jqueryMap = {};
        }
        stateMap.$append_target = null;
        stateMap.position_type = 'closed';

        // unwind key configurations
        configMap.sidebar_model     = null;
        configMap.people_model      = null;
        configMap.reports_model     = null;
        configMap.set_sidebar_anchor= null;

        return true;
    }; // End public method /removeSlider/

    // Public method /configModule/
    // Example   : feed.sidebar.configModule({  });
    // Purpose   : Adjust configuration of allowed keys to initialization
    // Arguments :
    //   * set_sidebar_anchor - a callback to modify the URI anchor to
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
    initModule = function ( $append_target ) {
        var $list_box;

        // load sidebar slider and jquery cache
        stateMap.$append_target = $append_target;
        $append_target.append( configMap.main_html );
        setJqueryMap();

        jqueryMap.$tabs.click( onTapToggle );
        stateMap.position_type = 'closed';

        // Have $list_box subscribe to jQuery global events
        $list_box = jqueryMap.$list_box;
        $.gevent.subscribe( $list_box, 'feed-listchange', onListchange );
        $.gevent.subscribe( $list_box, 'feed-setreport', onSetReport );
        $.gevent.subscribe( $list_box, 'feed-login', onLogin );
        $.gevent.subscribe( $list_box, 'feed-logout', onLogout );
        $.gevent.subscribe( $list_box, 'feed-hover', onHoverMarker );
        $.gevent.subscribe( $list_box, 'feed-clickmarker', onClickMarker );
        $.gevent.subscribe( $list_box, 'feed-alert', writeAlert );
        $.gevent.subscribe( jqueryMap.$form_create, 'feed-coord', onCoordChange );
        $.gevent.subscribe( jqueryMap.$form_create, 'feed-setcoord', onSetCoord );

        // bind user input events
        jqueryMap.$tabs.bind( 'utap', onTapToggle );
        $list_box.bind( 'utap', onTapList );
        jqueryMap.$butt_refresh.bind( 'click', onTapRefreshList );
        jqueryMap.$butt_download.bind( 'click', onTapDownloadList );
        jqueryMap.$butt_modify.bind( 'click', onTapModifyReport );
        jqueryMap.$butt_cancel.bind( 'click', onTapCancelReport );
        jqueryMap.$butt_create.bind( 'click', onTapCreateReport );
        jqueryMap.$report_doc_delete.bind( 'click', onTapDeleteDoc );

        jqueryMap.$report_doc_delete.hide();
        jqueryMap.$create_doc_delete.hide();

    }; // eo /initModule/

    // return public methods
    return {
        setSliderPosition   : setSliderPosition,
        removeSlider        : removeSlider,
        handleResize        : handleResize,
        configModule        : configModule,
        initModule          : initModule
    }
    //--------------------- eo public methods ---------------------
}());
