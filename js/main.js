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
        $success.text('An error occured connecting to our server.');
      });
  }

  $("#address-form").validate({
    submitHandler: function(form) {
      formHandler($(form), '/address');
    }
  });

  $("#credit-card-form").validate({
    submitHandler: function(form) {
      formHandler($(form), '/credit-card');
    }
  });

  // var braintree = Braintree.create("YourClientSideEncryptionKey")
  // braintree.onSubmitEncryptForm('braintree-payment-form');
});
