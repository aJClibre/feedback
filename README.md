#feedback

A client sidebar to create and manage geolocated information reports.
See the [demo](http://ajclibre.github.io/feedback/index.html).

##Description

It is based on [sidebar-v2](http://turbo87.github.io/sidebar-v2/examples/) and uses the Single Page Application approach (Mikowski & Powell).

It uses fake server side so it's possible to test it localy with an explorator.

Actually it is based on a Leaflet map but the goal is to deploy it on OpenLayers too.

It's possible to manage user login.

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

##Install

1. Extract the zip and put the src folder in your web application folder.
2. Edit your index.html to add the required libs.
3. (option) Edit src/js/feed.fake.js to modify the reports.
4. (option) Add files in doc/ to modify image and document reports

##Changelog
####0.0.1 (2015-10-14)
* Initial version
####0.1.2 (2016-01-06)
* OL2 version
* extract the libs folder from src/

##License

feedback is free software and may be redistributed under the [MIT licence](http://www.opensource.org/licenses/mit-license.php)
