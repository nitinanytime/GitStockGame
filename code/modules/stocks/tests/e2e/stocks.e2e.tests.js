'use strict';

describe('Stocks E2E Tests:', function () {
  describe('Test Stocks page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/stocks');
      expect(element.all(by.repeater('stock in stocks')).count()).toEqual(0);
    });
  });
});
