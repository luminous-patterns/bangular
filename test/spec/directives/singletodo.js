'use strict';

describe('Directive: singleTodo', function () {

  // load the directive's module
  beforeEach(module('bangularApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<single-todo></single-todo>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the singleTodo directive');
  }));
});
