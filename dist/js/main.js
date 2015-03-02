$(document).ready(function() {
  function formHandler($form, endpoint) {
    $success = $form.find('.success').first();
    $errors = $form.find('.errors').first();

    var errors = [
      'Successfully sent.',
      'An error occured connecting to our server.'
    ]

    $form.submit(function(event) {
      $.post(endpoint, $(this).serialize())
        .done(function(data){
          $success.show(200);
          $success.text(errors[0]);
        })
        .fail(function(xhr, status, error) {
          $errors.show(200);
          $success.text(errors[1]);
        });

      event.preventDefault();
    });
  }

  formHandler($('#address-form'), '/address');
  $('#address-form').validate();

  formHandler($('#credit-card-form'), '/credit-card');
  $('#credit-card-form').validate();

  // var braintree = Braintree.create("YourClientSideEncryptionKey")
  // braintree.onSubmitEncryptForm('braintree-payment-form');
});
