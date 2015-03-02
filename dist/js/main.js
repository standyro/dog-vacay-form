$(document).ready(function() {
  function formHandler($form, endpoint) {
    $success = $form.find('.success').first();
    $errors = $form.find('.errors').first();

    $.post(endpoint, $(this).serialize())
      .done(function(data){
        $success.show(200);
        $success.text('Successfully sent.');
      })
      .fail(function(xhr, status, error) {
        $errors.show(200);
        $errors.text('An error occured connecting to our server.');
      });
  }

  $("#address-form").validate({
    rules: {
      cc_exp_year: {
        required: true,
        min: 2015
      }
    },
    submitHandler: function(form) {
      formHandler($(form), '/address');
    }
  });

  $("#credit-card-form").validate({
    submitHandler: function(form) {
      formHandler($(form), '/credit-card');
    }
  });

  $('#server-validation-form').submit(function(event) {
    $.post('/server-validation', $(this).serialize())
    .done(function(data){
      $success = $('#server-validation-form').find('.success').first();
      $success.show(200);
      $success.text('Validation configured.');
    })
    .fail(function(xhr, status, error) {
      $errors = $('#server-validation-form').find('.errors').first();
      $errors.show(200);
      $errors.text('An error occurred.');
    });

    event.preventDefault();
  });

  // var braintree = Braintree.create("YourClientSideEncryptionKey")
  // braintree.onSubmitEncryptForm('braintree-payment-form');
});
