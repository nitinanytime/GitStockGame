'use strict';

describe('Games E2E Tests:', function () {
  describe('Test Games page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/games');
      expect(element.all(by.repeater('game in games')).count()).toEqual(0);
    });
  });
});
