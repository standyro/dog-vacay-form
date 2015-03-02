module.exports = {
  "Address Form Validation": function (browser) {
    browser
    .url("http://localhost:3000")
    .waitForElementVisible('body', 1000)
    .setValue('#address-form input[name="first-name"', 'nightwatch')
    .waitForElementVisible('#address-form button', 1000)
    .click('#address-form button')
    .pause(1000)
    .assert.containsText('#address-form', 'Cannot be set')
    .end();
  }
};
