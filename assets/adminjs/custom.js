// Create Category
$('#create-category').validate({
    rules: {
      title: {
        required: true,
        letterswithbasicpunc: true,
      },
      description: {
        required: true,
      },
      image: {
        required: true,
      },
      status: {
        required: true
      }
    },
    messages: {
      title: {
        required:'<span class="pf-5 text-danger align-middle">'+
        '&nbsp <i class="fas fa-exclamation-circle"></i> Enter a Category Title'+
        '</span>',
        letterswithbasicpunc:'<span class="pf-5 text-danger align-middle">'+
        '&nbsp <i class="fas fa-exclamation-circle"></i> The name must contain only letters!'+
        '</span>'
      },
      description: {
        required: '<span class="pf-5 text-danger align-middle">'+
        '&nbsp <i class="fas fa-exclamation-circle"></i> Enter atleast a short description'+
        '</span>'
      },
      image: {
        required:'<span class="pf-5 text-danger align-middle">'+
        '&nbsp <i class="fas fa-exclamation-circle"></i> Please Upload a image for this category'+
        '</span>'
      },
      status: {
        required:'<span class="pf-5 text-danger align-middle">'+
        '&nbsp <i class="fas fa-exclamation-circle"></i> Please Choose Category Status'+
        '</span>'
      }
    }
});


// Create Product
$('#create-product').validate({
    rules: {
      category: {
        required: true,
      },
      title: {
        required: true,
      },
      short_description: {
        required: true,
      },
      stock: {
        required: true,
        range: [0, 1]
      },
      price: {
        required: true,
        min:0,
        number : true
      },
      oldprice: {
        required: true,
        number : true,
        min:0,
        priceCompare : '#price'
      },
      additional: {
        required: true,
      },
      description: {
        required: true,
      },
      image: {
        required: true,
      },
      status: {
        required: true
      }
    },
    messages: {
      category: {
        required:'<span class="pf-5 text-danger align-middle"> Choose Category </span>'
      },
      title: {
        required:'<span class="pf-5 text-danger align-middle"> Enter Product Title </span>'
      },
      short_description: {
        required: '<span class="pf-5 text-danger align-middle"> Enter short description of Product (one line)</span>'
      },
      description: {
        required: '<span class="pf-5 text-danger align-middle"> Enter description of Product </span>'
      },
      image: {
        required:'<span class="pf-5 text-danger align-middle"> Enter Product Image </span>'
      },
      stock: {
        required:'<span class="pf-5 text-danger align-middle"> Choose Product Stock Status </span>'
      },
      status: {
        required:'<span class="pf-5 text-danger align-middle"> Select Product Status </span>'
      },
      price: {
        required:'<span class="pf-5 text-danger align-middle"> Please Enter Product Current Price </span>',
        number: '<span class="pf-5 text-danger align-middle"> Product Price Should be number </span>',
        min: '<span class="pf-5 text-danger align-middle"> Product Price Should greater than 0 otherwise it will sell as free product </span>',
      },
      oldprice: {
        required:'<span class="pf-5 text-danger align-middle"> Please Enter Product Old Price </span>',
        number: '<span class="pf-5 text-danger align-middle"> Product Old Price Should be number </span>',
        min: '<span class="pf-5 text-danger align-middle"> Product Old Price Should be Grater than 0 </span>',
        priceCompare : '<span class="pf-5 text-danger align-middle"> Product Old Price Should be Grater than New Price </span>',
      },
      additional: {
        required:'<span class="pf-5 text-danger align-middle"> Please Enter Some Additional information about product </span>', 
      },
    }
});
// comparing old price and new price
$.validator.addMethod("priceCompare", function(value, element, param) {
  var oldPrice = $(param).val();
  return parseFloat(value) > parseFloat(oldPrice);
}, "Old price must be greater than  price.");
