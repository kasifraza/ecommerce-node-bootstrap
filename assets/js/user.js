// function to get cookie
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
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


// // Check if checkbox is checked
// document.getElementById("type").addEventListener("change", function(){
// if(this.checked){
//     // add required validation to #name, #email and #password
//     document.getElementById("s_firstname").required = true;
//     document.getElementById("s_lastname").required = true;
//     document.getElementById("s_street").required = true;
//     document.getElementById("s_city").required = true;
//     document.getElementById("s_state").required = true;
//     document.getElementById("s_zip").required = true;
//     document.getElementById("s_phone").required = true;
//     document.getElementById("s_email").required = true;
// }
// });
// $("input[name=oldaddress]").change(function(){
//   var rbVal = $(this).val();  //checked value
//   console.log(rbVal)
//   if(rbVal){
//       $("#addressinfo").remove();
//   } 
// });

// $(document).ready(function() {
//     $("#checkout").validate({
//       rules: {
//         firstname: {
//           required: true,
//         },
//         lastname : {
//             required :true,
//         },
//         street : {
//             required : true
//         },
//         city : {
//             required : true
//         },
//         state : {
//             required : true
//         },
//         zip : {
//             required : true
//         },
//         phone : {
//             required : true
//         },
//         email : {
//             required : true
//         }

//       },
//       messages: {
//         firstname: {
//           required: "First Name is required",
//         },
//         lastname: {
//           required: "Last Name is required",
//         },
//         street : {
//             required : 'Street is Required'
//         },
//         city : {
//             required : 'City is Required'
//         },
//         state : {
//             required : 'State is Required'
//         },
//         zip : {
//             required : 'Zip Code is Required'
//         },
//         phone : {
//             required : 'Phone Number is Required'
//         },
//         email : {
//             required : 'Email is Required'
//         }
//       },
//       submitHandler: function(form) {
//         // var token = getCookie("token");
  
//         var formData = $(form).serialize();
  
//         // Caaling Create Address Api
//         $.ajax({
//           url: "/user/create-address",
//           type: "POST",
//           data: formData,
//           success: function(response) {
//             console.log(response);
//             // if(!response.ok){
//             //     throw new E
//             // }
//             toastr.success('good')
//           },
//           error: function(error) {
//             toastr.error(error)
//           }
//         });
//       }
//     });
//   });  