
$(document).ready(function() {
  $('#address-form').formValidation({
    message: 'This value is not valid',
    icon: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      firstName: {
        row: '.col-sm-4',
        validators: {
          notEmpty: {
            message: 'The first name is required'
          }
        }
      }
    }
  });
});
