const Blog = require("../../models/backend/Blog");
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


    //   render index page of blog
    index: (req, resp) => {
        const currentUrl = req.originalUrl;
        Blog.find().exec((err, blogs) => {
            if (err) {
                resp.json({ message: err.message });
            } else {
                resp.render("./backend/blog/index", { title: "Blogs", blogs: blogs, currentUrl });
            }
        });
    },



    //   render view page of a particular blog

    view: (req, resp) => {
        const currentUrl = req.originalUrl;
        let id = req.params.id;
        Blog.findById(id, async (err, blog) => {
            if (err) {
                req.session.message = {
                    type: "error",
                    message: err.message,
                };
                resp.redirect("/admin/index");
            } else {
                if (blog == null) {
                    req.session.message = {
                        type: "error",
                        message: 'Blog not found',
                    };
                    resp.redirect("/admin/index");
                } else {
                    resp.render("./backend/blog/view", { title: blog.title, blog: blog, currentUrl });
                }
            }
        });
    },



    //   render create blog page
    create: (req, resp) => {
        const currentUrl = req.originalUrl;
        resp.render("./backend/blog/create", { title: "Create Blog", currentUrl });
    },




    //   render update blog page
    update: (req, resp) => {
        const currentUrl = req.originalUrl;
        let id = req.params.id;
        Blog.findById(id, (err, blog) => {
            if (err) {
                req.session.message = {
                    type: "error",
                    message: err.message,
                };
                resp.redirect("/admin/blog/index");
            } else {
                if (blog == null) {
                    req.session.message = {
                        type: "warning",
                        message: "Blog Not Found",
                    };
                    resp.redirect("/admin/blog/index");
                } else {
                    resp.render("./backend/blog/update", { title: "Update Blog", currentUrl, blog: blog });
                }
            }
        });
    },




    //   Creating Blog POst
    createblog: (req, resp) => {
        const blog = new Blog({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            image: req.file.filename,
            seo_title: req.body.seo_title,
            seo_description : req.body.seo_description,
            seo_keywords : req.body.seo_keywords
        });
        blog.save((err) => {
            if (err) {
                resp.json({ message: err.message, type: "danger" });
            } else {
                req.session.message = {
                    type: "success",
                    message: "Blog Created Successfully",
                };
                resp.redirect("/admin/blog/index");
            }
        });
    },




    //   Update Blog Post 
    updateblog: (req, resp) => {
        let id = req.params.id;
        if (req.file) {
            // resp.send(req.file);
            Blog.findById(id)
                .then((blog) => {
                    const oldImage = blog.image;
                    fs.unlinkSync('assets/uploads/' + oldImage);
                        blog.title = req.body.title,
                        blog.description = req.body.description,
                        blog.status = req.body.status,
                        blog.image = req.file.filename,
                        blog.seo_title = req.body.seo_title,
                        blog.seo_description = req.body.seo_description,
                        blog.seo_keywords = req.body.seo_keywords
                    return blog.save();
                })
                .then((result) => {
                    req.session.message = {
                        type: "success",
                        message: "Blog Updated Successfully",
                    };
                    resp.redirect("/admin/blog/index/");
                })
                .catch((err) => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    resp.json({ message: err.message, type: "danger" });
                    //   next(err);
                });
        }
        else {
            Blog.findById(id)
                .then((blog) => {
                        blog.title = req.body.title,
                        blog.description = req.body.description,
                        blog.seo_title = req.body.seo_title,
                        blog.seo_description = req.body.seo_description,
                        blog.seo_keywords = req.body.seo_keywords,
                        blog.status = req.body.status;
                    return blog.save();
                })
                .then((result) => {
                    req.session.message = {
                        type: "success",
                        message: "Blog Updated Successfully",
                    };
                    resp.redirect("/admin/blog/index/");
                })
                .catch((err) => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    resp.json({ message: err.message, type: "danger" });
                });
        }
    },


    // delete blog get
    delete: (req, resp) => {
        const blogId = req.params.id;
        Blog.findById(blogId)
            .then((blog) => {
                if (!blog) {
                    const error = new Error("Could not find blog.");
                    error.statusCode = 404;
                    throw error;
                }
                // Delete the image from the folder
                if (blog.image) {
                    fs.unlinkSync('assets/uploads/' + blog.image);
                }
                // Delete the image from database
                return Blog.findByIdAndRemove(blogId);
            })
            .then((result) => {
                req.session.message = {
                    type: "success",
                    message: "Blog Deleted Successfully",
                };
                resp.redirect("/admin/blog/index/");
            })
            .catch((err) => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                resp.json({ message: err.message, type: "danger" });
            });
    }
};
