function loadGPXFiles()
{

    // MAP
    var mymap = L.map('mapid', {closePopupOnClick: false}).setView([51.505, -0.09], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(mymap);

    // GPX Files
    var gpxFile = 'Como_tira_la_tercera_edad_.gpx';
    var gpxFile2 = 'Fuenlabrada_Gri_on_con_viento_.gpx';

    var loadedLayer = [];

    var gpxLayer = new L.GPX(gpxFile, {
            async: true,
            marker_options: {
                startIconUrl: 'images/pin-icon-start.png',
                endIconUrl: 'images/pin-icon-end.png',
                shadowUrl: 'images/pin-shadow.png'
            }
        }).on('loaded', function(e) {
            var gpx = e.target;
            mymap.fitBounds(e.target.getBounds());

            mymap.eachLayer(function (layer) {

                if( layer._path !== undefined )
                {
                    if (loadedLayer.indexOf(layer._leaflet_id) > -1)
                        return;
                    else
                        loadedLayer.push(layer._leaflet_id);

                    var lonlat = layer.getLatLngs();
                    var elevation = gpx.get_elevation_data();
                    var hr = gpx.get_heartrate_data();
                    var time_breaks = gpx.get_time_breaks();

                    var position = 0;
                    var lastPosition = 0;
                    var lastBreak = time_breaks[0]

                     var popup = L.popup({'autoClose':false, 'minWidth': 125})
                        .setLatLng(lonlat[0])
                        .setContent("...")
                        .openOn(mymap);

                    var refreshIntervalId = setInterval(function()
                    {
                        var intervalo = (time_breaks[position] - lastBreak) / 1000;
                        var velocidadactual = elevation[position][0] * 1000;

                        var velocidad =  (velocidadactual - (lastPosition * 1000))/intervalo;



                        popup.setLatLng(lonlat[position]);
                        popup.setContent(
                                'Velocity: ' + Math.round(velocidad*3.6) + ' km/h<br/>'+
                                'Distance: ' + Math.round(elevation[position][0] * 10) / 10 + ' km<br/>' +
                                'Elevation: ' + elevation[position][1] + ' m.<br/>' +
                                'HR: ' + hr[position][1] + ' bpm'
                        );

                        lastPosition = elevation[position][0];
                        lastBreak = time_breaks[position];

                        position++;



                        if (position >= lonlat.length)
                            clearInterval(refreshIntervalId);
                    }, 25);

                }
            });

        }).addTo(mymap);


    var iconclasses = {
      exclamation: 'font-size: 22px;',
      A: 'font-size: 22px;'
    };

    var pos = new L.LatLng(0,0);
    //var iconclass = iconclasses[row.iconclass]?row.iconclass:'';
    var iconclass = '';
    //var iconstyle = iconclass?iconclasses[iconclass]:'';
    var iconstyle = '';
    //var icontext = iconclass?'':row.iconclass;
    var icontext = '20 km/h';

    var icon = L.divIcon({
        className: 'map-marker '+iconclass,
        iconSize:null,
        html:'<div class="icon" style="'+iconstyle+'">'+icontext+'</div><div class="arrow" />'
    });

    var mPos = L.marker(pos,{icon: icon}).addTo(mymap);

    var gpxLayer2 = new L.GPX(gpxFile2, {
            async: true,
            marker_options: {
                startIconUrl: 'images/pin-icon-start.png',
                endIconUrl: 'images/pin-icon-end.png',
                shadowUrl: 'images/pin-shadow.png'
            }
        }).on('loaded', function(e) {
            var gpx = e.target;
            mymap.fitBounds(e.target.getBounds());

            mymap.eachLayer(function (layer) {

                if( layer._path !== undefined )
                //if ((gpx._leaflet_id + 1) === layer._leaflet_id)
                {

                    if (loadedLayer.indexOf(layer._leaflet_id) > -1)
                        return;
                    else
                        loadedLayer.push(layer._leaflet_id);

                    //alert('layer');
                    var lonlat = layer.getLatLngs();
                    var elevation = gpx.get_elevation_data();
                    var hr = gpx.get_heartrate_data();
                    var time_breaks = gpx.get_time_breaks();

                    var position = 0;
                    var lastPosition = 0;
                    var lastBreak = time_breaks[0]

                    /*var popup = L.popup({'autoClose':false, 'minWidth': 125})
                        .setLatLng(lonlat[0])
                        .setContent("...")
                        .openOn(mymap); */
                     //var popup = L.marker(lonlat[0]).addTo(mymap);

                    var refreshIntervalId = setInterval(function()
                    {
                        var intervalo = (time_breaks[position] - lastBreak) / 1000;
                        var velocidadactual = elevation[position][0] * 1000;

                        var velocidad =  (velocidadactual - (lastPosition * 1000))/intervalo;


                        mPos.setLatLng(lonlat[position]);
                        //mPos._icon.innerText = Math.round(velocidad*3.6);

                        /*popup.setLatLng(lonlat[position]);
                        popup.setContent(
                                'Velocity: ' + Math.round(velocidad*3.6) + ' km/h<br/>'+
                                'Distance: ' + Math.round(elevation[position][0] * 10) / 10 + ' km<br/>' +
                                'Elevation: ' + elevation[position][1] + ' m.<br/>' +
                                'HR: ' + hr[position][1] + ' bpm'
                        );*/

                        lastPosition = elevation[position][0];
                        lastBreak = time_breaks[position];

                        position++;



                        if (position >= lonlat.length)
                            clearInterval(refreshIntervalId);
                    }, 25);

                }
            });

        }).addTo(mymap);
};