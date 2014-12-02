'use strict';

/**
 * @ngdoc directive
 * @name bangularApp.directive:singleTodo
 * @description
 * # singleTodo
 */
angular.module('bangularApp')
  .directive('singleTodo', function () {
    return {
      templateUrl: 'views/singletodo.html',
      restrict: 'AE',
      require: '^ngModel',
      scope: {
        ngModel: '='
      },
      controller: 'singleTodoCtrl'
    };
  })
  .controller('singleTodoCtrl', ['$scope', function($scope) {

    $scope.editingSummary = false;

    $scope.editSummary = function() {
      $scope.editingSummary = true;
    };

    $scope.saveSummary = function() {
      $scope.editingSummary = false;
    };

    $scope.delete = function() {
      $scope.ngModel.$delete();
    };

  }]);
