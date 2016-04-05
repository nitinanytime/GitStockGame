'use strict';

describe('Players E2E Tests:', function () {
  describe('Test Players page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/players');
      expect(element.all(by.repeater('player in players')).count()).toEqual(0);
    });
  });
});
