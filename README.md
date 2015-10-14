#feedback
========

A client sidebar to create and manage geolocated information reports.
See the [demo](http://ajclibre.github.io/feedback/index.html).

##Description

The sidebar could be integrated in a web gis application.

It manages user login.

It is based on [sidebar-v2](http://turbo87.github.io/sidebar-v2/examples/) uses the Single Page Application approach (Mikowski & Powell).

It uses fake server side so it's possible to test it localy with an explorator.

Actually it is based on a Leaflet map but the goal is to deploy it on OpenLayers too.

It requires :
* leaflet-0.7.2
* taffydb
* jquery-2.1.4
* jqueryurianchor
* jquery-gevent
* jquery-ue
* bootstrap-3.3.5 (css + modal.js)
* bootstrap-filestyle-1.2.1
* sidebar-v2
* Leaflet.awesome-markers-2.0

Open the index.html file in a navigator to test it.

##Install

After extract the zip modify put the feed-x.x.x folder in the web folder.
Edit your index.html to add the required libs.
Edit feed-X.X.X/js/feed.fake.js to modify the reports.
Add files in doc/ to modify images and documents

##License

feedback is free software and may be redistributed under the [MIT licence](http://www.opensource.org/licenses/mit-license.php)