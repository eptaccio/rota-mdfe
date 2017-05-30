var directionsDisplay;

var directionsService = new google.maps.DirectionsService();



function initialize() {

    directionsDisplay = new google.maps.DirectionsRenderer();

    var mapOptions = {

        zoom: 7,

        center: new google.maps.LatLng(41.850033, -87.6500523)

    };

    var map = new google.maps.Map(document.getElementById('map-canvas'),

        mapOptions);

    directionsDisplay.setMap(map);

    directionsDisplay.setPanel(document.getElementById('directions-panel'));

    calcRoute();

}



function calcRoute() {



    var request = {

        origin: _munInicio,

        destination: _munFim,

        optimizeWaypoints: true,

        travelMode: google.maps.TravelMode.DRIVING
    };
    console.log(request)
    directionsService.route(request, function (response, status) {

        if (status == google.maps.DirectionsStatus.OK) {

            directionsDisplay.setDirections(response);

        }

    });

}