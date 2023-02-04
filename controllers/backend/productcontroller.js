const Product = require("../../models/backend/Product");
const Category = require("../../models/backend/Category");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const fs = require('fs');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "assets/uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + file.originalname);
    },
});

// initialize the upload middleware
const upload = multer({ storage: storage });

module.exports = {
    upload,

    //   render index page of category
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



    //   render view page of a particular product

    view: (req, resp) => {
        const currentUrl = req.originalUrl;
        let id = req.params.id;
        Product.findById(id, async (err, product) => {
            if (err) {
                req.session.message = {
                    type: "error",
                    message: err.message,
                };
                resp.redirect("/admin/index");
            } else {
                if (product == null) {
                    req.session.message = {
                        type: "error",
                        message: 'Product not found',
                    };
                    resp.redirect("/admin/index");
                } else {
                    resp.render("./backend/product/view", { title: product.title, product: product, currentUrl });
                }
            }
        });
    },



    //   render create Product page
    create: async (req, resp) => {
        const currentUrl = req.originalUrl;
        const categories = await Category.find({ status: true });
        resp.render("./backend/product/create", { title: "Create Product", currentUrl, categories });
    },




    //   render update product page
    update: (req, resp) => {
        const currentUrl = req.originalUrl;
        let id = req.params.id;
        Product.findById(id, (err, product) => {
            if (err) {
                req.session.message = {
                    type: "error",
                    message: err.message,
                };
                resp.redirect("/admin/product/index");
            } else {
                if (product == null) {
                    req.session.message = {
                        type: "warning",
                        message: "Product Not Found",
                    };
                    resp.redirect("/admin/product/index");
                } else {
                    resp.render("./backend/product/update", { title: "Update Product", currentUrl, product: product });
                }
            }
        });
    },




    //   Creating Product POst
    createproduct: (req, resp, next) => {
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     throw new Error('Please Fill all require details and in correct formate');
        // }
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
                });
                product.save((err) => {
                    if (err) {
                        throw new Error(err.message);
                        // error.status = err.statusCode || 500;
                        // return next(error);
                    } else {
                        req.session.message = {
                            type: "success",
                            message: "Product Created Successfully",
                        };
                        resp.redirect("/admin/product/index");
                    }
                });
            })
            .catch((err) => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                throw new Error('Category which you have selected is not matched with our database');
                // error.status = err.statusCode;
                // return next(error);
            });
    },




    //   Update Product Post 
    updateproduct: (req, resp, next) => {
        let id = req.params.id;
        if (req.file) {
            Product.findById(id)
                .then((product) => {
                    const oldImage = product.image;
                    fs.unlinkSync('assets/uploads/' + oldImage);
                    product.title = req.body.title,
                        product.description = req.body.description,
                        product.status = req.body.status,
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
                    throw new Error(err.message);
                    // error.status = err.statusCode;
                    // return next(error);
                });
        }
        else {
            Product.findById(id)
                .then((product) => {
                    product.title = req.body.title,
                        product.description = req.body.description,
                        product.status = req.body.status;
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
                    throw new Error(err.message);
                    // error.status = err.statusCode;
                    // return next(error);
                });
        }
    },


    // delete Category get
    delete: (req, resp, next) => {
        const blogId = req.params.id;
        Product.findById(blogId)
            .then((product) => {
                if (!product) {
                    throw new Error("Could not find this Product.");
                    // error.statusCode = 404;
                    // return next(error);
                }
                // Delete the image from the folder
                if (product.image) {
                    fs.unlinkSync('assets/uploads/' + product.image);
                }
                // Delete the image from database
                return Product.findByIdAndRemove(blogId);
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
                throw new Error(err.message);
                // error.status = err.statusCode;
                // return next(error);
            });
    }
};
