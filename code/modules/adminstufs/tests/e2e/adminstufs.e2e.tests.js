'use strict';

describe('Adminstufs E2E Tests:', function () {
  describe('Test Adminstufs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/adminstufs');
      expect(element.all(by.repeater('adminstuf in adminstufs')).count()).toEqual(0);
    });
  });
});
