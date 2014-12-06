'use strict';

/**
 * @ngdoc function
 * @name bangularApp.factory:BaseModel
 * @description
 * # BaseModel
 * Base model of the bangularApp
 */
angular
  .module('bangularApp')
  .factory('BaseModel', ['$q', '$http', function($q, $http) {

    var array = [];
    var slice = array.slice;

    function BaseModel() {

      // The name of the ID attribute property for the model
      this.idAttribute = 'ID';

      // The RESTful end point for the model
      this.endPoint = '';

      // The model's unique ID
      this.id = null;

      // Keep track of syncing
      this.syncing = false;

      // Event handler cache
      this._events = {};

      // Defaults
      this.defaults = {};

      // Are we creating a new model or loading an existing one
      if (arguments.length < 1) {
        this.attributes = {};
      }
      else {

        if (typeof arguments[0] === 'object') {
          this.attributes = this.parse(arguments[0]);
          if (this.idAttribute in this.attributes) {
            setID(this, this.attributes[this.idAttribute]);
          }
        }
        else {
          setID(this, arguments[0]);
          this.attributes = {};
        }

      }

      // Keep a copy of the original attributes
      this._previousAttributes = angular.copy(this.attributes);

    }

    // This is the main function used when syncing the model with the server
    function sync(model, method) {

      if (model.syncing) {
        return $q(angular.noop).then(function() {
          return model;
        });
      }

      var url = method !== 'create' ? model.getEndpoint() : model.getRootEndpoint();
      var data = model.parse(model.attributes);

      var onComplete = function(response) {

        model.syncing = false;

        if (method === 'delete') {
          return deleteModel(model);
        }

        // Update the model attributes to match the server
        model.attributes = model.parse(response.data);

        // Update the previous attributes
        model._previousAttributes = angular.copy(model.attributes);

        var idAttribute = model.idAttribute;

        if (idAttribute) {
          setID(model, response.data[idAttribute]);
        }

        // Emit a 'sync' event on this model
        model.$emit('sync');

        return model;

      };

      model.syncing = true;

      switch (method) {

        case 'load':
          return $http.get(url).then(onComplete);

        case 'save':
          return $http.post(url, data).then(onComplete);

        case 'create':
          return $http.post(url, data).then(onComplete);

        case 'delete':
          return $http.delete(url).then(onComplete);

      }

    }

    function setID(model, ID) {
      model.id = ID;
    }

    function deleteModel(model) {
      model.attributes = {};
      model._previousAttributes = {};
      model.id = null;
      model.$emit('delete');
      return this;
    }

    BaseModel.prototype.getEndpoint = function() {
      return this.getRootEndpoint() + '/' + this.id;
    };

    BaseModel.prototype.getRootEndpoint = function() {
      return this.endPoint;
    };

    BaseModel.prototype.parse = function(data) {
      return angular.extend({}, data);
    };

    BaseModel.prototype.isNew = function() {
      return this.id ? false : true;
    };

    BaseModel.prototype.get = function(attr) {
      return attr in this.attributes ? this.attributes[attr] : null;
    };

    BaseModel.prototype.set = function(attr, val) {
      this.attributes[attr] = val;
      return this;
    };

    BaseModel.prototype.undoChanges = function() {
      this.attributes = angular.copy(this._previousAttributes);
      return this;
    };

    BaseModel.prototype.$delete = function() {
      if (!this.id) {
        return deleteModel(this);
      }
      return sync(this, 'delete');
    };

    BaseModel.prototype.$save = function() {

      if (this.isNew()) {
        return sync(this, 'create');
      }

      return sync(this, 'save');

    };

    BaseModel.prototype.$load = function() {

      if (this.isNew()) {
        return $q(angular.noop);
      }

      return sync(this, 'load');

    };

    BaseModel.prototype.$on = function(eventName, callback, context) {

      var cache = this._events;

      if (!cache[eventName]) {
        cache[eventName] = [];
      }

      cache[eventName].push([callback, context]);

      return this;

    };

    BaseModel.prototype.$off = function(eventName, callback) {

      var cache = this._events;

      if (!cache[eventName]) {
        return this;
      }

      angular.forEach(cache[eventName], function(handler, index) {

        if (handler[0] === callback) {
          cache[eventName].splice(index, 1);
        }

      });

      return this;

    };

    BaseModel.prototype.$emit = function(eventName) {
      
      var args = slice.call(arguments, 1);
      var cache = this._events;

      if (!cache[eventName]) {
        return this;
      }

      angular.forEach(cache[eventName], function(handler) {

        var callback = handler[0];
        var context = handler[1];

        callback.apply(context, args);

      });

      return this;

    };

    // Set defaults
    BaseModel.prototype.setDefaults = function(defaults) {

      var self = this;

      this.defaults = angular.copy(defaults);

      angular.forEach(this.defaults, function(value, key) {
        if (!self.attributes[key]) {
          self.attributes[key] = value;
        }
      });

      return this;

    };

    return BaseModel;

  }]);