// This file sends requests and handles dynamic displays for registration

var programs = {};
var program = {};

$(document).ready(function () {
  getTeams();
});

function getTeams() {
  let dropdown = $('#team-dropdown');

  dropdown.empty();

  // dropdown.append('<option selected="true" disabled>Choose an unregistered team</option>');
  // dropdown.prop('selectedIndex', 0);

  $.ajax({
    url: "https://35.170.107.130:3001/api/soccer/getTeams",
    method: "GET",
    type: "https"
  }).done((res) => {
    console.log(res);
    teams = res.data;
    $.each(data, function (key, team) {
      dropdown.append($('<option></option>').attr('value', team.name).text(team.name));
    })
  }).catch(
    console.log("Registration failed.", res);
  )
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

function registerPlayer() {
  $.ajax({
    url: "https://35.170.107.130:3001/api/soccer/registerPlayer",
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
    console.log(res);
    if (res.success == true) {
      console.log("Registration successful!");
      window.location.replace("./thanks.html");
    } else {
      console.log("Registration failed.");
      $('.error-message').slideDown().html(res.error + '<br> Please contact us at info@maaweb.org if you think there is an issue.');
    }
  }).catch(() => {
    console.log("Registration failed.", res);
    $('.error-message').slideDown().html(res.error + '<br> Please contact us at info@maaweb.org if you think there is an issue.');
  })
}

function formValid() {

  var f = $("form.php-email-form").find('.form-group'),
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