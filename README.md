# DogVacay

Thanks for considering my resume to DogVacay.

[standyro.com](http://standyro.com)
[github.com/standyro](http://github.com/standyro)


## Demo

View at [dog-vacay-form.herokuapp.com](http://dog-vacay-form.herokuapp.com)

## Background

For purposes of simplicity of this demo, I have opted to just use jQuery for submitting the form and handling error cases rather than using a larger MVV* or MVC framework like Angular.js, Ember, or React. The Javascript and CSS is built and compiled using the Grunt task as part of the build step that launches through ```grunt w```. Integration tests are launched with nightwatch. Given more time, I would add some server side validation (with json-schema if using a larger framework to support a REST API) to send more detailed feedback to the user, particularly related to credit card processing errors.

## Setup/Deployment

Requires node/npm.

```npm install```
```bower install```

While working on code changes to run a nodemon server on localhost:3000 and watcher:

```grunt w````

Committed version deployed to heroku.

```git push heroku master```

## Details

- Validation handled by jquery-validation
- Disable and enable server validation state
- Bootstrap styling

## Integration Tests

```npm run test```

- Uses nightwatch/selenium
- Tests a few failing cases
