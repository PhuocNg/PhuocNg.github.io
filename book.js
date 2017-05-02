// JavaScript Document
var app = angular.module('myApp', ['ngRoute']);	
	app.config(function($routeProvider) {
  	$routeProvider

  .when('/', {
    templateUrl : 'pages/home.html',
    controller  : 'HomeController'
  })

  .when('/bookAll', {
    templateUrl : 'pages/bookAll.html',
    controller  : 'BookAllController'
  })

  .when('/bookAdd', {
    templateUrl : 'pages/bookAdd.html',
    controller  : 'BookAddController'
  })
	
  .when('/bookDetail', {
    templateUrl : 'pages/bookDetail.html',
    controller  : 'BookDetailController'
  })
	
	.when('/Cart', {
    templateUrl : 'pages/Cart.html',
    controller  : 'HomeController'
  })
	
  .otherwise({redirectTo: '/'});
});
	
app.controller('HomeController', function($scope, $http) {
    $http.get("https://green-web-bookstore.herokuapp.com/api/books").then(function(response) {
        $scope.books = response.data;
    });
});

app.controller('BookAllController', function($scope, $http) {
    $http.get("https://green-web-bookstore.herokuapp.com/api/books").then(function(response) {
        $scope.books = response.data;
    });
});

app.controller('BookAddController', function($scope, $http) {
    $http.get("https://green-web-bookstore.herokuapp.com/api/books").then(function(response) {
        $scope.books = response.data;
    });
});

app.controller('BookDetailController', function($scope, $http) {
    $http.get("https://green-web-bookstore.herokuapp.com/api/books").then(function(response) {
        $scope.books = response.data;
    });
});

app.controller('CategorylController', function($scope, $http) {
    $http.get("http://green-web-bookstore.herokuapp.com/api/genres").then(function(response) {
        $scope.genres = response.data;
    });
});

jQuery.noConflict();
jQuery(document).ready(function(){

//General
	jQuery('.remove').click(function(){ 
		jQuery(this).parents('li.drop-cart').remove()
		});
	
//	Rating Star
	jQuery('.star').raty({ score: 3 });
//	Nut upload hinh trong Add Book
	
});