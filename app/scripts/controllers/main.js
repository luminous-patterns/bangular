'use strict';

/**
 * @ngdoc function
 * @name bangularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bangularApp
 */
angular.module('bangularApp')
  .controller('MainCtrl', function ($scope, TodoService) {

    $scope.newTodoSummary = '';
    $scope.todoCollection = TodoService.getCollection();

    $scope.addTodo = function() {

      var newTodo = TodoService.getModel({
        Summary: $scope.newTodoSummary
      });

      $scope.todoCollection.add(newTodo);

      clearNewTodo();
      
    };

    function clearNewTodo() {
      $scope.newTodoSummary = '';
    }

  });
