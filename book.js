// JavaScript Document
var app = angular.module('myApp', ['ngRoute','ngMaterial','ngMessages','textAngular']);	
app.config(function($routeProvider) {
	$routeProvider

  .when('/', {
    templateUrl : 'pages/home.html',
    controller  : 'HomeController'
  })

  .when('/bookAll', {
    templateUrl : 'pages/bookAll.html',
    controller  : 'HomeController'
  })
	 .when('/bookAdd', {
    templateUrl : 'pages/bookAdd.html',
    controller  : 'HomeController'
  })

	.when('/bookByGenres/:id', {
    templateUrl : 'pages/bookByGenres.html',
    controller  : 'HomeController',
  })

  .when('/bookDetail/:id', {
    templateUrl : 'pages/bookDetail.html',
    controller  : 'HomeController'
  })
	.when('/bookAuthor/:name', {
    templateUrl : 'pages/bookAuthor.html',
    controller  : 'HomeController'
  })
	.when('/bookSearch/:text', {
    templateUrl : 'pages/bookSearch.html',
    controller  : 'HomeController'
  })
	.when('/Cart', {
    templateUrl : 'pages/Cart.html',
    controller  : 'HomeController'
  })
	.when('/Info', {
    templateUrl : 'pages/Information.html',
    controller  : 'HomeController'
  })
	.when('/editBook/:id', {
    templateUrl : 'pages/editBook.html',
    controller  : 'HomeController'
  })
  .otherwise({redirectTo: '/'});
});

app.controller('HomeController', function($scope, $http,$location, $routeParams) {
	
	$scope.getBanners = function() {
        $http.get("https://green-web-bookstore.herokuapp.com/api/banners").success(function(response) {
            $scope.banners = response;
        });
      }
	
	$scope.getBooks = function() {
        $http.get("https://green-web-bookstore.herokuapp.com/api/books").success(function(response) {
            $scope.books = response;
        });
      }
  
   $scope.getBook = function() {
        var id = $routeParams.id;
        $http.get("https://green-web-bookstore.herokuapp.com/api/books/" + id).success(function(response) {
            $scope.book = response;
		});
    }
   
   $scope.getGenres = function() {
        $http.get("https://green-web-bookstore.herokuapp.com/api/genres").success(function(response) {
            $scope.genres = response;
        });
    }
   
   $scope.getBookByGenres = function() {
        var id = $routeParams.id;
	   $http.get("https://green-web-bookstore.herokuapp.com/api/books/genre/" + id).success(function(response) {
           $scope.books = response;
        });
    }
  
   $scope.getBookSearch = function() {
        $scope.text = $routeParams.text;
        $http.get("https://green-web-bookstore.herokuapp.com/api/books/search/" + $scope.text).success(function(response) {
            $scope.books = response;
        });
    }
   
   $scope.getBookByAuthor = function() {
       $scope.text = $routeParams.name;
	   $http.get("https://green-web-bookstore.herokuapp.com/api/books/author/" + $scope.text).success(function(response) {
            $scope.books = response;
        });
    }
  
   
   $scope.addBook = function() {
        console.log($scope.book);
        $http.post("https://green-web-bookstore.herokuapp.com/api/books/", $scope.book).success(function(response) {
            window.location.href = '#/books';
        });
    }

    $scope.updateBook = function() {
        var id = $routeParams.id;
        $http.put("https://green-web-bookstore.herokuapp.com/api/books/" + id, $scope.book).success(function(response) {
            window.location.href = '#/books/' + $routeParams.id;
        });
    }

    $scope.removeBook = function(id) {
        $http.delete("https://green-web-bookstore.herokuapp.com/api/books/" + id).success(function(response) {
            window.location.href = '#/books';
        });
    }

   
});


jQuery.noConflict();
jQuery(document).ready(function(){

//General
	jQuery('.remove').click(function(){ 
		jQuery('.remove').focus();
		jQuery(this).parents('li.drop-cart').remove();
		});
	
//	Rating Star
	jQuery('.star').raty({ score: 3 });
	
//	Enter
	jQuery('.nav-input-search').keypress(function(event){
  		if (event.keyCode == '13') {
    	jQuery('.nav-search-btn>a').click();
  		}
	});
	
	
});