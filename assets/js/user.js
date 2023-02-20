// function to get cookie
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// Create User Address Api in mY Account
$(document).ready(function () { // Initialize the form validation using jQuery Validate
  $("#my-account-create-address-form").validate({
    rules: {
      firstname: {
        required: true,
        minlength: 2

      },
      lastname: {
        required: true,
        minlength: 2
      },
      street: {
        required: true,
        minlength: 3
      },
      city: {
        required: true
      },
      state: {
        required: true
      },
      zip: {
        required: true,
        minlength: 5
      },
      phone: {
        required: true,
        minlength: 10,
        number: true,
        digits: true,

      },
      email: {
        required: true,
        email: true,
      }

    },
    messages: {
      firstname: {
        required: "First Name is required",
        minlength: "First Name must be at least 2 characters"
      },
      lastname: {
        required: "Last Name is required",
        minlength: "Last Name must be at least 2 characters"
      },
      street: {
        required: 'Street is Required',
        minlength: 'Street must be at least 3 characters'
      },
      city: {
        required: 'City is Required',
        minlength: 'City must be at least 3 characters'
      },
      state: {
        required: 'State is Required',
        minlength: 'State must be at least 3 characters'
      },
      zip: {
        required: 'Zip Code is Required',
        minlength: 'Zip Code must be at least 5 digits'
      },
      phone: {
        required: 'Phone Number is Required',
        minlength: 'Phone Number must be at least 10 digits',
        number: 'Phone Number must be a number',
        digits: 'Phone Number must contain only digits'
      },
      email: {
        required: 'Email is Required',
        email: "Please enter a valid email address"
      }
    },
    submitHandler: function (form) {
      event.preventDefault();
      var token = getCookie('token');
      $.ajax({
        url: "/api/user/create-address",
        type: "POST",
        data: $(form).serialize(),
        headers: {
          "Authorization": "Bearer " + token
        },
        success: function (response) {
          toastr.success(response.message);
          form.reset();
        },
        error: function (jqXHR, textStatus, errorThrown) {
          toastr.error(jqXHR.responseText);
        }
      });
    }
  }
  );
});


// Update User Profile
$(document).ready(function () { // Initialize the form validation using jQuery Validate
  $("#update-user-profile").validate({
    rules: {
      name: {
        required: true,
        minlength: 2
      },
      email: {
        required: true,
        email: true,
      }

    },
    messages: {
      name: {
        required: "Name is required",
        minlength: "First Name must be at least 2 characters"

      },
      email: {
        required: 'Email is Required',
        email: "Please enter a valid email address"
      }
    },
    submitHandler: function (form) {
      event.preventDefault();
      var token = getCookie('token');
      $.ajax({
        url: "/api/user/update-profile",
        type: "PUT",
        data: $(form).serialize(),
        headers: {
          "Authorization": "Bearer " + token
        },
        success: function (response) {
          toastr.success(response.message);
          location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
          toastr.error(jqXHR.responseText);
        }
      });
    }
  }
  );
});



  
