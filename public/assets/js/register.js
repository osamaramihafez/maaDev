// This file sends requests and handles dynamic displays for registration

var programs = {};
var program = {};

$(document).ready(function(){
    getPrograms();
    console.log(programs)
    $('#infoForm').hide();
    $(".checkout-payment").hide();
    $("#programs").change(function() {
        var waiver;
        console.log($(this).val())
        switch($(this).val()){
            case "mens over 18 soccer league":
                waiver = '../assets/waivers/soccerMensOver18.txt'
                program = programs["mens over 18 soccer league"];
                showForm();
                break;
            case "ramadan wellness program":
                waiver = '../assets/waivers/sistersWellness.txt'
                program = programs["ramadan wellness program"];

                hideForm();
                break;
            case "active club":
                waiver = '../assets/waivers/activeClubs.txt'
                program = programs["active club"];
                hideForm();
                break;
        }
        $(".register-terms").attr('src', waiver);
    });

});

function getPrograms(){
    $.ajax({
        url: "https://35.170.107.130:3001/api/programs/getPrograms",
        method: "GET",
        type: "https"
    }).done((res) => {
        programs = res;
    })
}

function hideForm(){
    $('#infoForm').hide(400);
    $('#no-program').show(400);
    $(".checkout-payment").hide();
}

function showForm(){
    $('#infoForm').show(400);
    $('#no-program').hide();
    $(".checkout-payment").hide();
}

function showPayment(){
    choice = $("#programs option:selected").html()
    $("#programs option:selected").html(choice)
    // Note: the above line is executed in order to return the contents of #programs back since .html() replaces the contents;
    // $('#infoForm').hide(400);
    $("#program-name-checkout").html(choice);
    $("#program-price").html("$" + program.price);
    $(".checkout-payment").show(400);
}

function validateProgram(){

    console.log(formValid())
    if (!formValid()){
        console.log("Form inputs invalid")
        return false;
    }

    if (program == {} || program == undefined){
        console.log("Error! Program is empty.")
        return false;
    }

    if ($("#terms").is(":checked")){
        $.ajax({
            url: "https://35.170.107.130:3001/api/validateRegistration/" + $("#programs").val() + "/" + $("#gender").val(),
            method: "POST",
            type: "https"
        }).done((res) => {
            if (res.valid == true){
                console.log("Registration input is valid. User May continue registration.");
                if (program.price > 0){
                    console.log("Member must complete payment before registering.")
                    showPayment();
                } else {
                    console.log("Registering a member for a free program.")
                    register();
                }
            }
        })
    } else {
        console.log("User must first read and accept the waiver.")
    }
}

function register(){
    $.ajax({
        url: "https://35.170.107.130:3001/api/register",
        method: "POST",
        data:  {
            fname: $("#firstName").val(),
            lname: $("#lastName").val(),
            phone: $("#phone").val(),
            email: $("#email").val(),
            birthday: $("#birthday").val(),
            gender: $("#gender").val(),
            program: $("#programs").val()
        },
        type: "https"
    }).done((res) => {
        console.log(res);
        if (program.price > 0){
            getCardNonce()
        }
    })
}

// onGetCardNonce is triggered when the "Pay" button is clicked
function getCardNonce() {
    // Don't submit the form until SqPaymentForm returns with a nonce
    // event.preventDefault();

    // Here is where we want to do some validation before we start a request for the nonce.
    validateProgram();

    // Request a nonce from the SqPaymentForm object
    paymentForm.requestCardNonce();
}
paymentForm.build();

function formValid(){
      
      var f = $("form.php-email-form").find('.form-group'),
        ferror = false,
        emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;
  
      //Deal with inputs
      f.children('input').each(function() { // run all inputs
       
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
              if (! i.is(':checked')) {
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
      f.children('textarea').each(function() { // run all inputs
  
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