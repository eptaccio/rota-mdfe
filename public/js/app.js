var app = angular.module('app', ['ngRoute']);

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


app.controller('PrincipalCtrl', function ($rootScope, $location, $scope, $http, $window, $timeout) {
    //$location.path('/')
});