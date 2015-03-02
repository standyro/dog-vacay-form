# DogVacay

Thanks for considering my resume to DogVacay.

standyro.com
github.com/standyro

## Demo

Either view at dogvacay.herokuapp.com or pull this repo, and run grunt watch.

## Background

For purposes of simplicity of this demo, I have opted to just use jQuery for submitting the form and handling error cases rather than using a larger MVV* or MVC framework like Angular.js, Ember, or React. The Javascript and CSS is built and compiled using the Grunt task as part of the build step. Integration tests are all passing and handle various failure states. With more time, I would add some server side validation to send more detailed feedback to the user, particularly related to credit card processing errors.

## Setup/Deployment

Requires node/npm.

```npm install```
```bower install```

While working on code changes, to run a server and build watcher.

```grunt w````

Committed version deployed to heroku.

```git push heroku master```

## Details

- Bootstrap styling
- Validation handled by jquery-validation
- Disable and enable server validation state

## Integration Tests

```npm run test```

- Uses nightwatch/selenium
- Tests a few failing cases

### Braintree API Integration

For security purposes, and to avoid direct payment processing the BrainTree javascript API is used. In production, payments should always be submitted by HTTPS.
