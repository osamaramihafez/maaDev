// This file sends requests and handles dynamic displays for soccer team registration

errormsg = "<br> Please contact us at info@maaweb.org for any inquiries. <br> If you have already registered, and would just like to complete the payment for your team. Click <a href=\'./checkout.html\'>here</a>."

$(document).ready(function () {
  $('#infoForm').hide();
  $(".checkout-payment").hide();
  $("#choices").change(function () {
    var waiver;
    console.log($(this).val())
    switch ($(this).val()) {
      case "create-team":
        waiver = '../assets/waivers/soccerMensOver18.txt'
        showForm();
        break;
      case "register-for-team":
        hideForm();
        // window.location.replace("individualRegistration.html");
        break;
    }
    $(".register-terms").attr('src', waiver);
  });

});

function showPayment() {
$("#infoForm").hide(400);
  $(".checkout-payment").show(400);
}

function hideForm() {
  $('#infoForm').hide(400);
  $('#no-program').show(400);
  $(".checkout-payment").hide();
}

function showForm() {
  $('#infoForm').show(400);
  $('#no-program').hide(400);
}

function validateProgram() {
  console.log(formValid())
  if (!formValid()) {
    console.log("Form inputs invalid")
    return false;
  }
  if ($("#terms").is(":checked")) {
    registerTeam();
  } else {
    console.log("User must first read and accept the waiver.")
    return false;
  }
}

function registerTeam() {
  $.ajax({
    url: "https://35.170.107.130:3001/api/soccer/createTeam",
    method: "POST",
    data: {
      fname: $("#firstName").val(),
      lname: $("#lastName").val(),
      phone: $("#phone").val(),
      email: $("#email").val(),
      birthday: $("#birthday").val(),
      gender: "Male",
      name: $("#team-name").val(),
      program: "mens over 18 soccer league covid 1"
    },
    type: "https",
    dataType: 'text json'
  }).done((res) => {
    console.log(res.responseJSON);
    if (res.resposneJSON.success == true) {
      console.log("Registration successful!");
      window.location.replace("checkout.html")
    } else {
      console.log("Registration failed.");
      $('.error-message').slideDown().html(res.responseJSON.error + errormsg);
    }
  }).catch((res) => {
    console.log("Registration failed.", res.responseJSON.error);
      $('.error-message').slideDown().html(res.responseJSON.error + errormsg);
  })
}

function formValid() {

  var f = $("div.php-email-form").find('.form-group'),
    ferror = false,
    emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

  //Deal with inputs
  f.children('input').each(function () { // run all inputs

    var i = $(this); // current input
    var rule = i.attr('data-rule');

    if (rule !== undefined) {
      var ierror = false; // error flag for current input
      var pos = rule.indexOf(':', 0);
      if (pos >= 0) {
        var exp = rule.substr(pos + 1, rule.length);
        rule = rule.substr(0, pos);
      } else {
        rule = rule.substr(pos + 1, rule.length);
      }

      switch (rule) {
        case 'required':
          if (i.val() === '') {
            ferror = ierror = true;
          }
          break;

        case 'minlen':
          if (i.val().length < parseInt(exp)) {
            ferror = ierror = true;
          }
          break;

        case 'email':
          if (!emailExp.test(i.val())) {
            ferror = ierror = true;
          }
          break;

        case 'checked':
          if (!i.is(':checked')) {
            ferror = ierror = true;
          }
          break;

        case 'regexp':
          exp = new RegExp(exp);
          if (!exp.test(i.val())) {
            ferror = ierror = true;
          }
          break;
      }
      i.next('.validate').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
    }
  });

  // Deal with textareas
  f.children('textarea').each(function () { // run all inputs

    var i = $(this); // current input
    var rule = i.attr('data-rule');

    if (rule !== undefined) {
      var ierror = false; // error flag for current input
      var pos = rule.indexOf(':', 0);
      if (pos >= 0) {
        var exp = rule.substr(pos + 1, rule.length);
        rule = rule.substr(0, pos);
      } else {
        rule = rule.substr(pos + 1, rule.length);
      }

      switch (rule) {
        case 'required':
          if (i.val() === '') {
            ferror = ierror = true;
          }
          break;

        case 'minlen':
          if (i.val().length < parseInt(exp)) {
            ferror = ierror = true;
          }
          break;
      }
      i.next('.validate').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
    }
  });
  if (ferror) return false;

  return true;
}

// Payment Code

// Pasted it from scratch so I have to start over
const paymentForm = new SqPaymentForm({
  // Initialize the payment form elements
  
  //TODO: Replace with your sandbox application ID
  applicationId: "REPLACE_WITH_APPLICATION_ID",
  inputClass: 'sq-input',
  autoBuild: false,
  // Customize the CSS for SqPaymentForm iframe elements
  inputStyles: [{
      fontSize: '16px',
      lineHeight: '24px',
      padding: '16px',
      placeholderColor: '#a0a0a0',
      backgroundColor: 'transparent',
  }],
  // Initialize the credit card placeholders
  cardNumber: {
      elementId: 'sq-card-number',
      placeholder: 'Card Number'
  },
  cvv: {
      elementId: 'sq-cvv',
      placeholder: 'CVV'
  },
  expirationDate: {
      elementId: 'sq-expiration-date',
      placeholder: 'MM/YY'
  },
  postalCode: {
      elementId: 'sq-postal-code',
      placeholder: 'Postal'
  },
  // SqPaymentForm callback functions
  callbacks: {
      /*
      * callback function: cardNonceResponseReceived
      * Triggered when: SqPaymentForm completes a card nonce request
      */
      cardNonceResponseReceived: function (errors, nonce, cardData) {
      if (errors) {
          // Log errors from nonce generation to the browser developer console.
          console.error('Encountered errors:');
          errors.forEach(function (error) {
              console.error('  ' + error.message);
          });
          alert('Encountered errors, check browser developer console for more details');
          return;
      }
         alert(`The generated nonce is:\n${nonce}`);
         //TODO: Replace alert with code in step 2.1
      }
  }
});

// onGetCardNonce is triggered when the "Pay" button is clicked
function getCardNonce() {
  // Don't submit the form until SqPaymentForm returns with a nonce
  // event.preventDefault();

  // Request a nonce from the SqPaymentForm object
  paymentForm.requestCardNonce();
}
paymentForm.build();

