
// add to cart function
function addToCart(id) {
  // Send a POST request to the server to add the item to the cart
  let productId = id;
  let quantity = 1;
  fetch('/cart/add-to-cart', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(response => {
      if (!response.status) {
        throw new Error(response.message);
      }
      else {
        toastr.success('Product Added to Cart!');
        setTimeout(function () {
          //redirect to cart page
          window.location.href = '/cart';
        }, 1500);
      }
    })
    .catch(error => {
      toastr.error(error);
    });

}

// wishlist adding function
function addToWishList(id) {
  // Send a POST request to the server to add the item to the cart
  let productId = id;
  fetch('/cart/add-to-wishlist', {
    method: 'POST',
    body: JSON.stringify({ productId }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(response => {
      if (response.statusCode === 400 || response.statusCode === 500) {
        toastr.error(response.message);
      } else if (response.statusCode === 200) {
        toastr.success(response.message);
      } else if (response.statusCode === 409) {
        toastr.warning(response.message);
      }
    })
    .catch(error => {
      toastr.error(error.message);
    });
}


// increment in cart
function inc(id) {
  let productId = id;
  fetch('/cart/increment', {
    method: 'POST',
    body: JSON.stringify({ productId }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.text())
    .then(data => {
      toastr.success('Quantity Updated');
      $('#cartcontainer').html(data);
    })
    .catch(error => {
      // console.log(error)
      toastr.error(error);
    });
}

// decrement in cart
function dec(id) {
  let productId = id;
  fetch('/cart/decrement', {
    method: 'POST',
    body: JSON.stringify({ productId }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.text())
    .then(data => {
      toastr.success('Quantity Updated');
      $('#cartcontainer').html(data);
    })
    .catch(error => {
      // console.log(error)
      toastr.error(error);
    });
}



// remove item from cart

// JavaScript function to remove an item from the cart
function removeFromCart(productId) {
  // Send DELETE request to the server to remove the item
  fetch(`/cart/remove-item/${productId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      // if (!response.ok) {
      //   throw new Error('Error occured while removing item from cart');
      // }
      return response.json();
    })
    .then(() => {
      // Remove the item from the cart page
      const itemNode = document.getElementById(`cart-item-${productId}`);
      itemNode.parentNode.removeChild(itemNode);
      toastr.success('Product Removed from Cart')
    })
    .catch((error) => {
      toastr.error(error);
    });
}

// JavaScript function to empty cart
function emptyCart() {
  // Send DELETE request to the server to remove the item
  fetch('/cart/empty-cart', {
    method: 'POST',
  })
    .then(response => response.json())
    .then((data) => {
      if (data.status) {
        // Remove the item from the cart page
        toastr.success(data.message);
        setTimeout(function () {
          //redirect to cart page
          window.location.href = '/cart';
        }, 1000);
      } else {
        throw new Error(data.message)
      }
    })
    .catch((error) => {
      toastr.error(error);
    });
}

// register user
$(document).ready(function() {
  $("#register-form").validate({
    rules: {
      name: {
        required: true,
      },
      email: {
        required: true,
        email: true,
      },
      password: {
        required: true,
        minlength: 6,
      },
      confirm_password: {
        required: true,
        equalTo: "#password"
      }
    },
    messages: {
      name: {
        required: "Please enter your name",
      },
      email: {
        required: "Please enter your email",
        email: "Please enter a valid email",
      },
      password: {
        required: "Please enter your password",
        minlength: "Password must be at least 6 characters long",
      },
      confirm_password: {
        required: "Please confirm your password",
        equalTo: "Passwords do not match"
      }
    },
    submitHandler: function(form) {
      let formData = {
        name: $("#name").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        confirm_password: $("#cpass").val(),
      };

      $.ajax({
        type: "POST",
        url: "/user/register",
        data: JSON.stringify(formData),
        contentType: "application/json",
        success: function(res) {
          // console.log(res);
          if (res.token) {
            toastr.success(res.message);
            setTimeout(function() {
              //redirect to login page
              window.location.href = '/user/login';
            }, 1200);
          }
          else{
          toastr.error(res.message);
          }
        },
        error: function(err) {
          toastr.error(err.responseJSON.message);
        },
      });
    },
  });
});


// login user
$(document).ready(function() {
  $("#login-form").validate({
    rules: {
      email: {
        required: true,
        email: true,
      },
      password: {
        required: true,
      },
    },
    messages: {
      email: {
        required: "Please enter your email",
        email: "Please enter a valid email",
      },
      password: {
        required: "Please enter your password",
      },
    },
    submitHandler: function(form) {
      let formData = {
        email: $("#email").val(),
        password: $("#password").val(),
      };

      $.ajax({
        type: "POST",
        url: "/user/login",
        data: JSON.stringify(formData),
        contentType: "application/json",
        success: function(res) {
          // console.log(res);
          if (res.token) {
            toastr.success(res.message);
            setTimeout(function() {
              //redirect to login page
              window.location.href = '/';
            }, 1200);
          }
          else{
          toastr.error(res.message);
          }
        },
        error: function(err) {
          toastr.error(err.responseJSON.message);
        },
      });
    },
  });
});


