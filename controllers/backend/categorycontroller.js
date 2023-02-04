const Category = require("../../models/backend/Category");
const Product = require("../../models/backend/Product");
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
        // resp.send(req.query.page);
        const currentUrl = req.originalUrl;
        var perPage = 10;
        var page = req.query.page || 1;
        Category
            .find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec((err, categories) => {
                Category.count().exec((err, count) => {
                    if (err) {
                        resp.json({ message: err.message });
                    }
                    resp.render("./backend/category/index", {
                        title: "Categories", categories: categories, currentUrl, current: page, pages: Math.ceil(count / perPage)
                    });
                });
            });
    },



    //   render view page of a particular category

    view: (req, resp,next) => {
        const currentUrl = req.originalUrl;
        let id = req.params.id;
        Category.findById(id, async (err, category) => {
            if (err) {
                new Error("Category not found");
                err.status = 404;
                return next(err);
            } else {
                if (category == null) {
                    const error = new Error("Category not found");
                    error.status = 404;
                    return next(error);
                } else {
                    resp.render("./backend/category/view", { title: category.title, category: category, currentUrl });
                }
            }
        });
    },



    //   render create Category page
    create: (req, resp) => {
        const currentUrl = req.originalUrl;
        // console.log(req.originalUrl);
        resp.render("./backend/category/create", { title: "Create Category", currentUrl, });
    },




    //   render update category page
    update: (req, resp,next) => {
        const currentUrl = req.originalUrl;
        let id = req.params.id;
        Category.findById(id, (err, category) => {
            if (err) {
                const error = new Error("Category not found");
                error.status = 404;
                return next(error);
            } else {
                if (category == null) {
                const error = new Error("Category not found");
                error.status = 404;
                return next(error);
                } else {
                    resp.render("./backend/category/update", { title: "Update Category", currentUrl, category: category });
                }
            }
        });
    },




    //   Creating Category POst
    createcategory: (req, resp,next) => {
        const category = new Category({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            image: req.file.filename,
        });
        category.save((err) => {
            if (err) {
                const error = new Error(err.message);
                error.status = 500;
                return next(error);
            } else {
                req.session.message = {
                    type: "success",
                    message: "Category Created Successfully",
                };
                resp.redirect("/admin/category/index");
            }
        });
    },




    //   Update Category Post 
    updatecategory: (req, resp,next) => {
        let id = req.params.id;
        if (req.file) {
            // resp.send(req.file);
            Category.findById(id)
                .then((category) => {
                    const oldImage = category.image;
                    fs.unlinkSync('assets/uploads/' + oldImage);
                    category.title = req.body.title,
                        category.description = req.body.description,
                        category.status = req.body.status,
                        category.image = req.file.filename;
                    return category.save();
                })
                .then((result) => {
                    req.session.message = {
                        type: "success",
                        message: "Category Updated Successfully",
                    };
                    resp.redirect("/admin/category/index/");
                })
                .catch((err) => {
                    const error = new Error(err.message);
                    error.status = 500;
                    return next(error);
                });
        }
        else {
            Category.findById(id)
                .then((category) => {
                    category.title = req.body.title,
                        category.description = req.body.description,
                        category.status = req.body.status;
                    return category.save();
                })
                .then((result) => {
                    req.session.message = {
                        type: "success",
                        message: "Category Updated Successfully",
                    };
                    resp.redirect("/admin/category/index/");
                })
                .catch((err) => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    const error = new Error(err.message);
                    error.status = err.statusCode;
                    return next(error);
                });
        }
    },


    // delete Category get
    delete: (req, resp) => {
        const catId = req.params.id;
        Product.find({ category: catId }, (err, products) => {
            if (err) {
                new Error('Product Not Found');
                err.status = 404;
                return next(err);
            } else if (products.length > 0) {
                const error = new Error("This category cannot be deleted because it has associated products.");
                error.statusCode = 403;
                return next(error);
            } else {
                Category.findById(catId)
                    .then((category) => {
                        if (!category) {
                            const error = new Error("Could not find this category.");
                            error.statusCode = 404;
                            throw error;
                        }
                        // Delete the image from the folder
                        if (category.image) {
                            fs.unlinkSync('assets/uploads/' + category.image);
                        }
                        // Delete the image from database
                        return Category.findByIdAndRemove(catId);
                    })
                    .then((result) => {
                        req.session.message = {
                            type: "success",
                            message: "Category Deleted Successfully",
                        };
                        resp.redirect("/admin/category/index/");
                    })
                    .catch((err) => {
                        const error = new Error(err.message);
                        error.status = err.statusCode || 500;
                        return next(error);
                    });
            }
        });
    }
};
