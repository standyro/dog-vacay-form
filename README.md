# DogVacay

Thanks for considering my resume to DogVacay.

standyro.com
github.com/standyro

## Demo

Either view at dogvacay.herokuapp.com or pull this repo and load index.html.

## Background

For purposes of simplicity of this demo, I have opted to just use jQuery for submitting the form and handling error cases rather than using a larger MVV* or MVC framework like Angular.js, Ember, or React. The Javascript and CSS is built and compiled using the Grunt task as part of the build step. Integration tests are all passing and handle various failure states. I took the liberty of spending more time crafting the integration tests and styling as an exercise in learning how to use and better usability of credit card forms.

## Setup/Deployment

Requires node/npm.

```npm install```
```bower install```

Committed version deployed to heroku.

```git push heroku master```

## Details

- Bootstrap styling
- Validation handled by jquery-validation
- Zip lookup for easier user interface
- Selectize for multi-select
- Credit card styling using Skeuocard

## Integration Tests

```npm run test```

- Uses nightwatch/selenium
- Tests a few failing cases

### Braintree API Integration

For security purposes, and to avoid direct payment processing the BrainTree javascript API is used. In production, payments should always be submitted by HTTPS.
