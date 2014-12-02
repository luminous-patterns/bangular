'use strict';

/**
 * @ngdoc function
 * @name bangularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bangularApp
 */
angular.module('bangularApp')
  .service('TodoService', ['TodoModel', 'ModelCollection', function (TodoModel, ModelCollection) {

    return {

      getModel: function() {
        return arguments[0] ? new TodoModel(arguments[0]) : new TodoModel();
      },

      getCollection: function() {
        return new ModelCollection({
          class: TodoModel
        });
      }

    }
    
  }]);