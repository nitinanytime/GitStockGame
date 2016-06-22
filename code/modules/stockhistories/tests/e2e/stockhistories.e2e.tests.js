'use strict';

describe('Stockhistories E2E Tests:', function () {
  describe('Test Stockhistories page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/stockhistories');
      expect(element.all(by.repeater('stockhistory in stockhistories')).count()).toEqual(0);
    });
  });
});
