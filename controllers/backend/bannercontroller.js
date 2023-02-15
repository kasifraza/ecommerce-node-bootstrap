const Banner = require('../../models/backend/Banner');
const fs = require('fs');

module.exports = {
    index : (req, res,next) => {
        try {
            const originalUrl = req.originalUrl;
            Banner.find({}, (err, banners) => {
                if (err) {
                    return next(err);
                }
                res.render('./backend/banners/index', {
                    title : 'Banners',
                    banners: banners,
                    currentUrl: originalUrl
                });
            });
        } catch (error) {
            next(error);
        }
    },


    create : (req, res,next) => {
        try {
            const originalUrl = req.originalUrl;
            res.render('./backend/banners/create', {
                title : 'Create Banner',
                currentUrl: originalUrl
            });

        } catch (error) {
            next(error);
        }
    },


    createPost : (req, res,next) => {
        try {
            const banner = new Banner({
                title: req.body.title,
                description: req.body.description,
                image: req.file.filename,
                link: req.body.link,
                price: req.body.price
            });
            banner.save((err) => {
                if (err) {
                    req.session.message = {
                        type : 'error',
                        message : err.message || 'Internal Server Error'
                    }
                    res.redirect('/admin/banner/create');
                }else{
                    req.session.message = {
                        type :'success',
                        message : 'Banner created successfully'
                    }
                    return res.redirect('/admin/banner/index');
                }
            });
        } catch (error) {
            next(error);
        }
    },


    update : (req, res,next) => {
        try {
            const originalUrl = req.originalUrl;
            Banner.findById(req.params.id, (err, banner) => {
                if (err) {
                    req.session.message = {
                        type : 'error',
                        message : 'This Banner does not exist'
                    };
                    res.redirect('/admin/banner/index');
                }else{
                    res.render('./backend/banners/update', {
                        title : 'Update Banner',
                        banner: banner,
                        currentUrl: originalUrl
                    });
                }
            });
        } catch (error) {
            next(error);
        }
    },


    updatePost : (req, res,next) => {
        try {
            const bannerId = req.params.id;
            if(req.file){
                Banner.findById(bannerId, (err, banner) => {
                    if (err) {
                        req.session.message = {
                            type : 'error',
                            message : 'This Banner does not exist'
                        };
                        res.redirect('/admin/banner/index');
                    }else{
                        banner.title = req.body.title;
                        banner.description = req.body.description;
                        banner.image = req.file.filename;
                        banner.link = req.body.link;
                        banner.price = req.body.price;
                        banner.save((err) => {
                            if (err) {
                                req.session.message = {
                                    type : 'error',
                                    message : err.message
                                }
                                return res.redirect('/admin/banner/update');
                            }else{
                                req.session.message = {
                                    type :'success',
                                    message : 'Banner updated successfully'
                                }
                                return res.redirect('/admin/banner/view/' + bannerId);
                            }
                        });
                    }
                });

            }else{
                    Banner.findById(bannerId, (err, banner) => {
                        if (err) {
                            req.session.message = {
                                type : 'error',
                                message : 'This Banner does not exist'
                            };
                            return res.redirect('/admin/banner/index');
                        }
                        else{
                            banner.title = req.body.title;
                            banner.description = req.body.description;
                            banner.link = req.body.link;
                            banner.price = req.body.price;
                            banner.save((err) => {
                                if (err) {
                                    req.session.message = {
                                        type : 'error',
                                        message : err.message
                                    }
                                    return res.redirect('/admin/banner/update');
                                }else{
                                    req.session.message = {
                                        type :'success',
                                        message : 'Banner updated successfully'
                                    }
                                    return res.redirect('/admin/banner/view/' + bannerId);
                                }
                            });
                        }
                    });
            }
        } catch (error) {
            next(error);
        }
    },


    delete : (req, res,next) => {
        try{
            const bannerId = req.params.id;
            Banner.findByIdAndRemove(bannerId, (err) => {
                if (err) {
                    req.session.message = {
                        type : 'error',
                        message : 'This Banner does not exist'
                    };
                    return res.redirect('/admin/banner/index');
                }else{
                    req.session.message = {
                        type :'success',
                        message : 'Banner deleted successfully'
                    }
                    return res.redirect('/admin/banner/index');
                }
            });
        }catch(error) {
            next(error);
        }
    },


    view : (req, res,next) => {
        try {
            const originalUrl = req.originalUrl;
            const bannerId = req.params.id;
            Banner.findById(bannerId, (err, banner) => {
                if (err) {
                    req.session.message = {
                        type : 'error',
                        message : 'This Banner does not exist'
                    };
                    return res.redirect('/admin/banner/index');
                }else{
                    res.render('./backend/banners/view', {
                        title : 'View Banner',
                        banner: banner,
                        currentUrl: originalUrl
                    });
                }
            });
        } catch (error) {
            next(error);
        }
    }
}