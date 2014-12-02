'use strict';

/**
 * @ngdoc function
 * @name bangularApp.factory:TodoModel
 * @description
 * # TodoModel
 * Todo model of the bangularApp
 */
angular
  .module('bangularApp')
  .factory('TodoModel', ['BaseModel', function(BaseModel) {

    var _super = BaseModel.prototype;

    function TodoModel() {

      BaseModel.apply(this, arguments);

      this.endPoint = 'todos';

      this.setDefaults({
        'Summary'                   : '',
        'Details'                   : ''
      });

    }

    // Replicate the super class prototype
    TodoModel.prototype = new BaseModel();

    // Return the class
    return TodoModel;

  }]);