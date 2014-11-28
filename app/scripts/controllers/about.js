'use strict';

/**
 * @ngdoc function
 * @name bangularApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the bangularApp
 */
angular.module('bangularApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
