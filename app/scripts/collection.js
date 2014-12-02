'use strict';

/**
 * @ngdoc function
 * @name bangularApp.factory:ModelCollection
 * @description
 * # ModelCollection
 * ModelCollection of the bangularApp
 */
angular
  .module('bangularApp')
  .factory('ModelCollection', ['$q', '$http', function($q, $http) {

    var array = [];
    var slice = array.slice;

    function ModelCollection(options) {

      // Event handler cache
      this._events = {};

      // Model cache
      this.models = [];

      // Specify custom end point for loading collection
      if ('endPoint' in options) {
        this.endPoint = options.endPoint;
      }

      // Length
      this.length = 0;

      // Query string for searching
      this.queryStringParts = {};

      // What type of models does this collection contain
      this.modelClass = options.class;
      this.model = new options.class();

      // Listen out for deletes
      this.$on('model:delete', onModelDelete, this);

    }

    // When a model is deleted
    var onModelDelete = function(model) {

      var self = this;

      // Find the deleted model
      angular.forEach(this.models, function(m, index) {
        
        if (m === model) {

          // Remove it from this.models
          self.models.splice(index, 1);

          // Update the collection length property
          self.length--;

        }

      });

    };

    // Get a model from the collection by it's index
    ModelCollection.prototype.at = function(index) {
      return this.models[index];
    };

    // Add a model to the collection
    ModelCollection.prototype.add = function(model) {

      var self = this;

      // Add the model to this.models
      this.models.push(model);

      // Increment length property
      this.length++;

      // Listen out for when this model is deleted
      model.$on('delete', function() {
        self.$emit('model:delete', model);
      });

      return this;

    };

    // Return the end point for this collection
    ModelCollection.prototype.getEndPoint = function() {
      return this.endPoint
        ? this.endPoint
        : this.model.getRootEndpoint();
    };

    // Return the query string to append to GET requests
    ModelCollection.prototype.getQuery = function() {
      return !_.isEmpty(this.queryStringParts)
        ? '?' + this.getQueryString()
        : '';
    };

    // Return the query string
    ModelCollection.prototype.getQueryString = function() {
      return _.map(this.queryStringParts, function(v,k) { 
        return k + '=' + encodeURIComponent(v);
      }).join('&');
    };

    // Add query string params
    ModelCollection.prototype.query = function(parts) {
      this.queryStringParts = _.extend(this.queryStringParts, parts);
      return this;
    };

    // Reset the query string params
    ModelCollection.prototype.resetQuery = function() {
      this.queryStringParts = {};
      return this;
    };

    // Empty the collection
    ModelCollection.prototype.empty = function() {
      this.models.splice(0, this.length);
      this.length = 0;
      return this;
    };

    // Fetch the collection from the server
    ModelCollection.prototype.$load = function() {

      var self = this;

      // Prepare the URL where this collection can be fetched from
      var url = this.getEndPoint() + this.getQuery();

      // Fetch the collection
      return $http.get(url).then(function(response) {

        var models = response.data;

        // Empty the collection
        self.empty();

        // For each model returned by the server
        angular.forEach(models, function(data) {

          // Turn it in to a real model
          var model = new self.modelClass(data);

          // Add it to the collection
          self.add(model);

        });

      });

    };

    // Bind events
    ModelCollection.prototype.$on = function(eventName, callback, context) {

      var cache = this._events;

      if (!cache[eventName]) {
        cache[eventName] = [];
      }

      cache[eventName].push([callback, context]);

      return this;

    };

    // Unbind events
    ModelCollection.prototype.$off = function(eventName, callback) {

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

    // Emit events
    ModelCollection.prototype.$emit = function(eventName) {
      
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

    return ModelCollection;

  }]);