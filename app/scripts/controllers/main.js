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

    $scope.todoCollection.$load();

    $scope.addTodo = function() {

      var newTodo = TodoService.getModel({
        Summary: $scope.newTodoSummary
      });

      newTodo
        .$save()
        .then(function() {
          clearNewTodo();
          $scope.todoCollection.add(newTodo);
        });
      
    };

    function clearNewTodo() {
      $scope.newTodoSummary = '';
    }

  });
