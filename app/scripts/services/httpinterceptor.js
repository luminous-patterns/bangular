'use strict';

/**
 * @ngdoc service
 * @name bangularApp.HttpInterceptor
 * @description
 * # HttpInterceptor
 * Service in the bangularApp.
 */
angular.module('bangularApp')
  .config(function($httpProvider) {

    $httpProvider.interceptors.push([
      '$injector',
      function($injector) {
        return $injector.get('HttpInterceptor');
      }
    ]);

  })
  .service('HttpInterceptor', ['$q', function HttpInterceptor($q) {

    return {
      request: function (config) {

        var apiRegExp = /^api\//;
        var isApiURL = config.url.match(apiRegExp);

        if (isApiURL) {
          var originalUrl = config.url.replace(apiRegExp, '');
          config.url = 'http://127.0.0.1:7133/' + originalUrl;
        }

        return config || $q.when(config);

      }
    };

  }]);
