'use strict';

describe('Playermoves E2E Tests:', function () {
  describe('Test Playermoves page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/playermoves');
      expect(element.all(by.repeater('playermove in playermoves')).count()).toEqual(0);
    });
  });
});
