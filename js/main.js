$(document).ready(function() {
  function formHandler($form, endpoint) {
    $success = $form.find('.success').first();
    $errors = $form.find('.errors').first();

    $form.submit(function(event) {
      $.post(endpoint, $(this).serialize())
        .done(function(data){
          $success.show(200);
          $success.text(data);
        })
        .fail(function(xhr, status, error) {
          $errors.show(200);
          var httpResponse = xhr.responseText;
          $errors.text(error + httpResponse);
        });

      event.preventDefault();
    });
  }

  formHandler($('#address-form'), '/address');
  $('#address-form').validate();

  var card = new Skeuocard($("#credit-card-form"), {
    cardNumberPlaceholderChar: '*',
    genericPlaceholder: '**** **** **** ****'
  });

  formHandler($('#credit-card-form'), '/credit-card');
  $('#credit-card-form').validate();

  var braintree = Braintree.create("YourClientSideEncryptionKey")
  braintree.onSubmitEncryptForm('braintree-payment-form');
});
