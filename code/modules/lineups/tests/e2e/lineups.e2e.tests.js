'use strict';

describe('Lineups E2E Tests:', function () {
  describe('Test Lineups page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/lineups');
      expect(element.all(by.repeater('lineup in lineups')).count()).toEqual(0);
    });
  });
});
