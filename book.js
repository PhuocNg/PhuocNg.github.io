// JavaScript Document
var app = angular.module('myApp', ['ngRoute','ngMaterial','ngMessages','textAngular','ngCookies','ui.bootstrap']);	
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
	.when('/order', {
    templateUrl : 'pages/bill.html',
    controller  : 'HomeController'
  })
  .otherwise({redirectTo: '/'});
});

app.service('bookservice', function() {


    this.cart = [];

    this.bills = [];
    this.item = [];
    this.total = [];
});

app.controller('HomeController', function($scope, $http, $location, $routeParams, $cookieStore, bookservice,) {
	
	 /*--------Cart ---------*/

    $scope.qty = 1;
    $scope.total = 0;

    $scope.sum = function() {
        bookservice.total.totalQty = 0;
        for (var i = 0; i < bookservice.cart.length; i++) {
            $scope.total += bookservice.cart[i].item.sellingPrice * bookservice.cart[i].qty;
            bookservice.total.totalQty += bookservice.cart[i].qty;
        }
        $scope.all = bookservice.total;

    }
    $scope.sum();


    $scope.addCart = function(item) {
        if ($scope.qty > 0) {

            if (bookservice.cart.length > 0) {
                for (var i = 0; i < bookservice.cart.length; i++) {
                    if (bookservice.cart[i].item._id === item._id) {
                        $scope.addedItem = true;
                        bookservice.cart[i].qty += $scope.qty;
                        bookservice.item[i].quantity += $scope.qty;
                    }
                }
                if ($scope.addedItem) {
                    $scope.addedItem = false;

                } else {
                    bookservice.cart.push({ item, qty: 1 });
                    bookservice.item.push({ _book: item._id, price: item.sellingPrice, quantity: $scope.qty });
                    console.log(item._id)
                }
            } else {
                bookservice.cart.push({ item, qty: $scope.qty });
                bookservice.item.push({ _book: item._id, price: item.sellingPrice, quantity: $scope.qty });
                console.log(item._id)
            }
        }
        $scope.sum();
    }
    $scope.cart = bookservice.cart;
	
	 /*------------order--------------*/
    $scope.order = {};
    $scope.order.books = [];
    $scope.checkout = function() {
        if ($scope.cart.length > 0 && $scope.total > 0) {

            $scope.order._user = $scope.user._id;
            $scope.order.books = bookservice.item;
            $scope.order.total = $scope.total;
            // bookservice.bills.push($scope.order);
            console.log($scope.order);

            $http.post(root + 'api/orders', $scope.order).success(function(response) {
                console.log('success');
                bookservice.item = [];
                bookservice.cart.splice(0, bookservice.cart.length);
                $scope.total = 0;
                $location.url("/");
            }).error(function(data, status, headers, config) {
                console.log(data, status, headers, config);
            });

        }
    };
	
	$scope.go = function ( path ) {
  		$location.path( path + $scope.text);
		};
	
	$scope.getBanners = function() {
        $http.get("https://green-web-bookstore.herokuapp.com/api/banners").success(function(response) {
            $scope.banners = response;
        });
		$scope.myInterval = 3000;
		$scope.activeBanner = 1;
      };
	
	$scope.loaded = false;
	$scope.paging = function() {

        $scope.totalItems = $scope.books.length;
        $scope.currentPage = 1;
        $scope.itemsPerPage = 4;
        $scope.maxSize = 5;
        $scope.changePage = function() {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                end = begin + $scope.itemsPerPage;

            $scope.filteredBooks = $scope.books.slice(begin, end);
        };
    };
	
	$scope.getBooks = function() {
        $http.get("https://green-web-bookstore.herokuapp.com/api/books").success(function(response) {
            $scope.books = response;
			$scope.paging();
        });
      };
  
   $scope.getBook = function() {
        var id = $routeParams.id;
        $http.get("https://green-web-bookstore.herokuapp.com/api/books/" + id).success(function(response) {
            $scope.book = response;
			var totalRate = 0;
                for (var i = 0; i < $scope.book.comments.length; i++) {
                    totalRate += $scope.book.comments[i].rate;
                }

                if (totalRate === 0) {
                    $scope.rate = 4;
                } else {
                    $scope.rate = totalRate / $scope.book.comments.length;
                }
	   	
	   		if ($scope.book.comments.length > 0) {
				$scope.unidentified = true;
			}
			else{ $scope.unidentified = false;
				  $scope.result = "Chưa có bình luận";
				}
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
		   if ($scope.books.length > 0) {
				$scope.unidentified = true;
			}
			else{ $scope.unidentified = false;
				  $scope.result = "Chưa có sách theo thể loại này";
				}
        });
    };
  
   $scope.getBookSearch = function() {
        $scope.text = $routeParams.text;
        $http.get("https://green-web-bookstore.herokuapp.com/api/books/search/" + $scope.text).success(function(response) {
            $scope.books = response;
			if ($scope.books.length > 0) {
				$scope.unidentified = true;
			}
			else{ $scope.unidentified = false;
				  $scope.result = "Không tìm thấy sách";
				}
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
            $http.post('https://green-web-bookstore.herokuapp.com/api/users/auth', $scope.loginUser).success(function (response) {
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
            $http.post('https://green-web-bookstore.herokuapp.com/api/users/signup/', $scope.signUpUser).success(function (response) {
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
			$scope.editProfile = $cookieStore.get('user');
            $scope.token = $cookieStore.get('token');
			
        };

    $scope.isLogged = function(){
            return $cookieStore.get('token') != undefined;
        };
	
	$scope.updateUser = function() {
        console.log($scope.editProfile)
        $http.put('https://green-web-bookstore.herokuapp.com/api/users', $scope.editProfile).success(function(response) {
            console.log(response);
            $scope.user = $scope.editProfile;

            $cookieStore.put('user', response.user);
            $scope.user = $cookieStore.get('user');

            $location.url("/")
        }).error(function(data, status, headers, config) {
            console.log(data, status, headers, config);
        });
    }
	
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
	
//	Rating
	$scope.max = 5;
	$scope.rating = 4;
    $scope.isReadonly = false;
    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
    };
    $scope.ratingStates = [
        { stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty' }
    ];
	
    



});

var compareTo = function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
};

app.directive("compareTo", compareTo);

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
	
	
//	Enter
	jQuery('.nav-input-search').keypress(function(event){
  		if (event.keyCode == '13') {
    		jQuery('.nav-search-btn>a').click();
  		}
	});
//	Tooltip
	jQuery('[data-toggle="tooltip"]').tooltip();
	
});