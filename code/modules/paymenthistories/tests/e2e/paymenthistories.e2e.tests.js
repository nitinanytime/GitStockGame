'use strict';

describe('Paymenthistories E2E Tests:', function () {
  describe('Test Paymenthistories page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/paymenthistories');
      expect(element.all(by.repeater('paymenthistory in paymenthistories')).count()).toEqual(0);
    });
  });
});
