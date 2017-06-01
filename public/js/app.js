var app = angular.module('app', ['ngRoute', 'google-maps']);

app.config(function ($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider

        .when('/', {
            templateUrl: 'views/principal.html',
            controller: 'PrincipalCtrl',
        })
        // caso não seja nenhum desses, redirecione para a rota '/'
        .otherwise({ redirectTo: '/' });
});


app.controller('PrincipalCtrl', function ($rootScope, $location, $scope, $http, $document, $timeout) {


    $scope.map_div = false
    $scope.corpo_div = true
    $scope.direcoes = false

    $scope.ObterXML = () => {
        $http({
            method: 'GET',
            url: '/xml/mdfe'
        }).then((success) => {
            $scope.xml_documento = success.data
        }, (error) => {
            console.log(err)
        })
    }

    $scope.map = {
        control: {},
        center: {
            latitude: -37.812150,
            longitude: 144.971008
        },
        zoom: 5
    };

    // instantiate google map objects for directions
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var geocoder = new google.maps.Geocoder();



    var request


    var SolicitarRota = (callback) => {
        $http({
            method: 'POST',
            url: '/mapa',
            data: {
                xml: $scope.xml_documento
            },
        }).then((response) => {
            $scope.map_div = true
            $scope.corpo_div = false
            $scope.direcoes = true
            callback(response.data.trajeto)
        }, (response) => {
            $scope.mensagem = response.data.mensagem
            $timeout(() => {
                $scope.mensagem = ''
            }, 3000)
        })
    }

    $scope.getDirections = function () {
        SolicitarRota((rota) => {
            directionsService.route(rota, function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setMap($scope.map.control.getGMap());
                    directionsDisplay.setPanel(document.getElementById('directionsList'));
                } else {
                    alert('Google route unsuccesfull!');
                }
            });
        })


    }
});