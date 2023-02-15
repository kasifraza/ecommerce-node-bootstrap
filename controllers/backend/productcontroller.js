const Product = require("../../models/backend/Product");
const Category = require("../../models/backend/Category");
const { body, validationResult } = require("express-validator");
const Brand = require("../../models/backend/Brand");

const multer = require("multer");
const fs = require('fs');
const { error } = require("console");
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "assets/uploads/");
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + "-" + Date.now() + file.originalname);
//     },
// });

// initialize the upload middleware
// const upload = multer({ storage: storage });


module.exports = {
    // upload,

    //   render index page of Products GET
    index: (req, resp) => {

        const currentUrl = req.originalUrl;
        var perPage = 10
        var page = req.query.page || 1
        Product
            .find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec((err, products) => {
                Product.count().exec((err, count) => {
                    if (err) {
                        resp.json({ message: err.message });
                    }
                    resp.render("./backend/product/index", {
                        title: "Products", products: products, currentUrl, current: page, pages: Math.ceil(count / perPage)
                    });
                });
            });
    },

    //   render view page of a particular product GET

    view: (req, resp, next) => {
        try {
            const currentUrl = req.originalUrl;
            let id = req.params.id;
            Product.findById(id, async (err, product) => {
                if (err) {
                    req.session.message = {
                        type: "error",
                        message: 'Product not found',
                    };
                    return resp.redirect("/admin/product/index");
                } else {
                    if (product == null) {
                        req.session.message = {
                            type: "error",
                            message: 'Error Occured while fetching Product',
                        };
                        return resp.redirect("/admin/product/index");
                    } else {
                        return resp.render("./backend/product/view", { title: product.title, product: product, currentUrl });
                    }
                }
            }).populate("category");
        } catch (error) {
            next(error);
        }
    },

    //   render create Product page GET
    create: async (req, resp) => {
        const currentUrl = req.originalUrl;
        const categories = await Category.find({ status: true });
        const brands = await Brand.find({});
        resp.render("./backend/product/create", {brands, title: "Create Product", currentUrl, categories });
    },


    //   render update product page GET
    update: async (req, resp) => {
        try {
            const currentUrl = req.originalUrl;
            let id = req.params.id;
            const brands = await Brand.find({});
            Product.findById(id, (err, product) => {
                if (err) {
                    req.session.message = {
                        type: "error",
                        message: 'Error Occured while finding the product',
                    };
                    return resp.redirect("/admin/product/index");
                } else {
                    if (product == null) {
                        req.session.message = {
                            type: "warning",
                            message: err.message,
                        };
                        return resp.redirect("/admin/product/index");
                    } else {
                        resp.render("./backend/product/update", {brands, title: "Update Product", currentUrl, product: product });
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    },


    //   Creating Product POST
    createproduct: (req, resp, next) => {
        try {
        Category.findById(req.body.category)
            .then(() => {
                const product = new Product({
                    category: req.body.category,
                    title: req.body.title,
                    short_description: req.body.short_description,
                    stock: req.body.stock,
                    price: req.body.price,
                    oldprice: req.body.oldprice,
                    sku: req.body.sku,
                    additional: req.body.additional,
                    description: req.body.description,
                    status: req.body.status,
                    image: req.file.filename,
                    brand: req.body.brand,
                    mark : req.body.mark
                });
                product.save((err) => {
                    if (err) {
                        throw new Error(err.message);
                    } else {
                        Category.findByIdAndUpdate(product.category,{$push : {products : product._id}},{new : true},(error,category) => {
                            if(error){
                                throw new Error(error.message);
                            }else{
                                req.session.message = {
                                    type: "success",
                                    message: "Product Created Successfully",
                                };
                                resp.redirect("/admin/product/index");
                            }
                        });
                    }
                });
            })
            .catch((err) => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                req.session.message = {
                    type: "error",
                    message: err.message,
                }
                return resp.redirect("/admin/product/create");
            });
        } catch (error) {
            next(error);
        }
    },

    //   Update Product POST 
    updateproduct: (req, resp, next) => {
        try {
            let id = req.params.id;
            if (req.file) {
                Product.findById(id)
                    .then((product) => {
                        const oldImage = product.image;
                        // fs.unlinkSync('assets/uploads/' + oldImage);
                        const {
                            category,
                            title,
                            short_description,
                            stock,
                            price,
                            oldprice,
                            sku,
                            additional,
                            description,
                            status,
                            mark,
                            brand
                        } = req.body;
                        product.category = category;
                        product.title = title;
                        product.short_description = short_description;
                        product.stock = stock;
                        product.price = price;
                        product.oldprice = oldprice;
                        product.sku = sku;
                        product.additional = additional;
                        product.description = description;
                        product.status = status;
                        product.mark = mark;
                        product.brand = brand;
                        product.image = req.file.filename;
                        return product.save();
                    })
                    .then((result) => {
                        req.session.message = {
                            type: "success",
                            message: "Product Updated Successfully",
                        };
                        resp.redirect("/admin/product/index/");
                    })
                    .catch((err) => {
                        if (!err.statusCode) {
                            err.statusCode = 500;
                        }
                        req.session.message = {
                            type: "error",
                            message: err.message,
                        };
                        resp.redirect("/admin/product/index/");
                    });
            }
            else {
                Product.findById(id)
                    .then((product) => {
                        const {
                            category,
                            title,
                            short_description,
                            stock,
                            price,
                            oldprice,
                            sku,
                            additional,
                            description,
                            status,
                            mark,
                            brand
                            
                        } = req.body;
                        product.category = category;
                        product.title = title;
                        product.short_description = short_description;
                        product.stock = stock;
                        product.price = price;
                        product.oldprice = oldprice;
                        product.sku = sku;
                        product.additional = additional;
                        product.description = description;
                        product.status = status;
                        product.brand = brand;
                        product.mark = mark;
                        return product.save();
                    })
                    .then((result) => {
                        req.session.message = {
                            type: "success",
                            message: "Product Updated Successfully",
                        };
                        resp.redirect("/admin/product/index/");
                    })
                    .catch((err) => {
                        if (!err.statusCode) {
                            err.statusCode = 500;
                        }
                        req.session.message = {
                            type: "error",
                            message: err.message,
                        };
                        resp.redirect("/admin/product/index/");
                    });
            }
        } catch (error) {
            next(error);
        }
    },


    // delete PRODUCT  GET
    delete: (req, resp, next) => {
        try {
        const productId = req.params.id;
        Product.findById(productId)
            .then((product) => {
                if (!product) {
                    throw new Error("Could not find this Product.");
                }
                // Delete the image from the folder
                if (product.image) {
                    fs.unlinkSync('assets/uploads/' + product.image);
                }
                // Delete the image from database
                return Product.findByIdAndRemove(productId);
            })
            .then((result) => {
                req.session.message = {
                    type: "success",
                    message: "Product Deleted Successfully",
                };
                resp.redirect("/admin/product/index/");
            })
            .catch((err) => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                req.session.message = {
                    type: "error",
                    message: err.message,
                };
                return resp.redirect("/admin/product/index/");
            });
        } catch (error) {
            next(error);
        }
    },


    // Render All Product Images Index Page GET
    indexProductImages : (req,resp,next) =>{
        try {
            const currentUrl = req.originalUrl;
            const productId = req.params.id;
            Product.findById(productId)
            .then((product) => {
                if (!product) {
                    throw new Error("Could not find this Product.");
                }
                return resp.render('./backend/product/productimages-index',{product : product,currentUrl : currentUrl,title : 'Product Images of '+ product.title});
            }).catch((err) => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                req.session.message = {
                    type: "error",
                    message: 'Product Not Found',
                };
                return resp.redirect("/admin/product/index");
            });
        } catch (error) {
            next(error);
        }
    },


    //Render Multiple Product Images GET
    createProductImage : (req,resp,next) =>{
        try {
            const currentUrl = req.originalUrl;
            const productId = req.params.id;
            Product.findById(productId)
            .then((product) => {
                if (!product) {
                    throw new Error("Could not find this Product.");
                }
                return resp.render('./backend/product/createimage',{product : product,currentUrl : currentUrl,title : product.title + ' Image Upload' });
            })
            .catch((err) => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                req.session.message = {
                    type: "error",
                    message: err.message,
                };
                return resp.redirect("/admin/product/index");
            })
        } catch (error) {
            next(error);
        }
    },

    // Upload Multiple Product Images POST
    uploadProductImages : (req,resp,next)=>{
        try {
            const productId = req.params.id;
            Product.findById(productId)
            .then((product) => {
                if (!product) {
                    throw new Error("Could not find this Product.");
                }
                const files = req.files;
                files.forEach((file) => {
                    if (!file.filename) {
                        throw new Error("Please select an image");
                    }
                    const filename = file.filename;
                    Product.findByIdAndUpdate(productId,{$push : {images : filename}},{new : true},(error,product) => {
                        if(error){
                            throw new Error(error.message);
                        }
                    });
                });
            })
            .then((result) => {
                req.session.message = {
                    type: "success",
                    message: "Product Images Uploaded Successfully",
                };
                resp.redirect(`/admin/product/upload-image/${productId}`);
            }).catch((error) =>{
                if (!error.statusCode) {
                    error.statusCode = 500;
                }
                req.session.message = {
                    type: "error",
                    message: error.message,
                };
                return resp.redirect("/admin/product/index");
            })
            // Product.findByIdAndUpdate
            
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    },


    // Render Update Single Product Image Page GET
    updateSingleProductImage : (req,resp,next) =>{
        try{
            const currentUrl = req.originalUrl;
            const productId = req.params.id;
            const index = req.params.index;
            // console.log(req.url);
            Product.findById(productId)
            .then((product) => {
                if (!product) {
                    throw new Error("Could not find this Product.");
                }
                const checkIndex = product.images[index];
                if(!checkIndex){
                    throw new Error("Image does not exist");
                }
                return resp.render('./backend/product/update-single-image',{index,product : product,currentUrl : currentUrl,title : 'Update'});
            }).catch((err) => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                req.session.message = {
                    type: "error",
                    message: err.message,
                };
                return resp.redirect("/admin/product/index/");
            });
        }catch(err){
            next(err)
        };
    },


    // Update Single Product Image POST
    updateSingleProductImagePost : (req,resp,next) => {
        try {
            const index = req.params.index;
            const productId = req.params.id;
            Product.findById(productId)
                .then((product) => {
                    if (!product) {
                        throw new Error("Could not find this Product.");
                    }
                    const checkIndex = product.images[index];
                    if(!checkIndex){
                        throw new Error("Image does not exist");
                    }
                    const file = req.file;
                    product.images[index] = file.filename;
                    product.save();
                    fs.unlinkSync(`assets/uploads/products/${checkIndex}`);
                    req.session.message = {
                        type: "success",
                        message: "Product Image Updated Successfully",
                    };
                    resp.redirect(`/admin/product/upload-image/${productId}`);
                })
                .catch((err) => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    req.session.message = {
                        type: "error",
                        message: err.message,
                    };
                    return resp.redirect("/admin/product/index/");
                });
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    },

    // Delete Single  Product Image of a product GET
    deleteSingleProductImage: (req, resp, next) => {
        try {
            const productId = req.params.id;
            Product.findById(productId)
                .then((product) => {
                    if (!product) {
                        throw new Error("Could not find this Product.");
                    }
                    const index = product.images[req.params.index];
                    if (!index) {
                        throw new Error("Image does not exist");
                    }
                    product.images.splice(req.params.index, 1);
                    product.save();
                    fs.unlinkSync(`assets/uploads/products/${index}`);
                    req.session.message = {
                        type: "success",
                        message: "Product Image Deleted Successfully",
                    };
                    resp.redirect(`/admin/product/upload-image/${productId}`);
                }).catch((err) => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    req.session.message = {
                        type: "error",
                        message: err.message,
                    };
                    return resp.redirect("/admin/product/index/");
                });
        } catch (err) {
            next(err)
        }
    }
};
