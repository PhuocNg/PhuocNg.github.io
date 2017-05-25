// JavaScript Document
var app = angular.module('myApp', ['ngRoute','ngMaterial','ngMessages','textAngular','ngCookies']);	
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

app.controller('HomeController', function($scope, $http,$location, $routeParams, $cookieStore) {
	
	$scope.go = function ( path ) {
  		$location.path( path + $scope.text);
		};
	
	$scope.getBanners = function() {
        $http.get("https://green-web-bookstore.herokuapp.com/api/banners").success(function(response) {
            $scope.banners = response;
        });
      };
	
	$scope.getBooks = function() {
        $http.get("https://green-web-bookstore.herokuapp.com/api/books").success(function(response) {
            $scope.books = response;
        });
      };
  
   $scope.getBook = function() {
        var id = $routeParams.id;
        $http.get("https://green-web-bookstore.herokuapp.com/api/books/" + id).success(function(response) {
            $scope.book = response;
		});
    };
   
   $scope.getGenres = function() {
        $http.get("https://green-web-bookstore.herokuapp.com/api/genres").success(function(response) {
            $scope.genres = response;
        });
    };
   
   $scope.getBookByGenres = function() {
        var id = $routeParams.id;
	   $http.get("https://green-web-bookstore.herokuapp.com/api/books/genre/" + id).success(function(response) {
           $scope.books = response;
		   $scope.genreName = '';
            for (var i = 0; i < $scope.genres.length; i++) {
                if ($scope.genres[i]._id === id) {
                    $scope.genreName = $scope.genres[i].name;
                }
            }
        });
    };
  
   $scope.getBookSearch = function() {
        $scope.text = $routeParams.text;
        $http.get("https://green-web-bookstore.herokuapp.com/api/books/search/" + $scope.text).success(function(response) {
            $scope.books = response;
        });
    };
   
   $scope.getBookByAuthor = function() {
       $scope.text = $routeParams.name;
	   $http.get("https://green-web-bookstore.herokuapp.com/api/books/author/" + $scope.text).success(function(response) {
            $scope.books = response;
        });
    };
  
   
   $scope.addBook = function() {
        console.log($scope.book);
        $http.post("https://green-web-bookstore.herokuapp.com/api/books/", $scope.book).success(function(response) {
            window.location.href = '#/bookAdd';
        });
    };

    $scope.updateBook = function() {
        var id = $routeParams.id;
        $http.put("https://green-web-bookstore.herokuapp.com/api/books/" + id, $scope.book).success(function(response) {
            window.location.href = '#/books/' + $routeParams.id;
        });
    };

    $scope.removeBook = function(id) {
        $http.delete("https://green-web-bookstore.herokuapp.com/api/books/" + id).success(function(response) {
            window.location.href = '#/bookAll';
        });
    };
	
	$scope.loadLogin = function () {
            var token = $cookieStore.get('token');
            if (token !== undefined) {
                $location.url("#/");
            }
        };

   	$scope.logOut = function () {
            $cookieStore.remove('token');
            $cookieStore.remove('user');
        };

    $scope.viewProfile = function () {
            var token = $cookieStore.get('token');
            if (token === undefined) {
                $location.url("/login");
            }
        };


    $scope.summitLogin = function () {
            $http.post('https://green-web-bookstore.herokuapp.com/api/auth', $scope.loginUser).success(function (response) {
                var isSuccess = response.success;
                if (isSuccess) {
                    $cookieStore.put('token', response.token);
                    $cookieStore.put('user', response.user);
                    $scope.user = $cookieStore.get('user');
                    $scope.token = $cookieStore.get('token');
                    //Redirect here
                    $location.url("/");
                } else {
                    //Raise Error
                    alert(response.message);
                }
            }).error(function (data, status, headers, config) {
                console.log(data, status, headers, config);
            });
        };

    $scope.summitSignup = function () {
            $http.post('https://green-web-bookstore.herokuapp.com/api/signup/', $scope.signUpUser).success(function (response) {
                var isSuccess = response.success;
                if (isSuccess) {
                    $cookieStore.put('token', response.token);
                    $cookieStore.put('user', response.user);
                    $scope.user = $cookieStore.get('user');
                    $scope.token = $cookieStore.get('token');
                    //Redirect here
                    $location.url("/");
                } else {
                    //Raise Error
                    alert(response.message);
                }
            }).error(function (data, status, headers, config) {
                console.log(data, status, headers, config);
            });
        };

    $scope.init = function () {
            $scope.user = $cookieStore.get('user');
            $scope.token = $cookieStore.get('token');
			
        };

    $scope.isLogged = function(){
            return $cookieStore.get('token') != undefined;
        };
	
	$scope.addComment = function(post) {
		$scope.comment.userId = $scope.user._id;
		$scope.comment.bookId = post._id;
        console.log($scope.comment);
        $http.post("https://green-web-bookstore.herokuapp.com/api/books/comment", $scope.comment).success(function(response) {
            window.location.href = '#/bookDetail/{{book._id}}';
        }).error(function (data, status, headers, config) {
            console.log(data, status, headers, config);
		});
		console.log(post);
    };
	
});


jQuery.noConflict();
jQuery(document).ready(function(){
	
	jQuery('#loginbtn').click(function(){
		jQuery('.close').click();
	});
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
//	Tooltip
	jQuery('[data-toggle="tooltip"]').tooltip();
	
});