'use strict';

describe('Service: HttpInterceptor', function () {

  // load the service's module
  beforeEach(module('bangularApp'));

  // instantiate service
  var HttpInterceptor;
  beforeEach(inject(function (_HttpInterceptor_) {
    HttpInterceptor = _HttpInterceptor_;
  }));

  it('should do something', function () {
    expect(!!HttpInterceptor).toBe(true);
  });

});
