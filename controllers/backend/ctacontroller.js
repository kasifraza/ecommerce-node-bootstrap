const fs = require('fs');
const Cta = require('../../models/backend/Cta');

module.exports = {
    index : (req, res,next) => {
        try {
            const originalUrl = req.originalUrl;
            Cta.find({}, (err, ctas) => {
                if (err) {
                    return next(err);
                }
                res.render('./backend/cta/index', {
                    title : 'CTA',
                    ctas: ctas,
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
            res.render('./backend/cta/create', {
                title : 'Create CTA',
                currentUrl: originalUrl
            });

        } catch (error) {
            next(error);
        }
    },


    createPost : (req, res,next) => {
        try {
            const cta = new Cta({
                title: req.body.title,
                subtitle: req.body.subtitle,
                image: req.file.filename,
                link: req.body.link,
                price: req.body.price
            });
            cta.save((err) => {
                if (err) {
                    req.session.message = {
                        type : 'error',
                        message : err.message || 'Internal Server Error'
                    }
                    res.redirect('/admin/cta/create');
                }else{
                    req.session.message = {
                        type :'success',
                        message : 'CTA created successfully'
                    }
                    return res.redirect('/admin/cta/index');
                }
            });
        } catch (error) {
            next(error);
        }
    },


    update : (req, res,next) => {
        try {
            const originalUrl = req.originalUrl;
            Cta.findById(req.params.id, (err, cta) => {
                if (err) {
                    req.session.message = {
                        type : 'error',
                        message : 'This CTA does not exist'
                    };
                    res.redirect('/admin/cta/index');
                }else{
                    res.render('./backend/cta/update', {
                        title : 'Update CTA',
                        cta: cta,
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
            const ctaId = req.params.id;
            if(req.file){
                Cta.findById(ctaId, (err, cta) => {
                    if (err) {
                        req.session.message = {
                            type : 'error',
                            message : 'This CTA does not exist'
                        };
                        res.redirect('/admin/cta/index');
                    }else{
                        cta.title = req.body.title;
                        cta.subtitle = req.body.subtitle;
                        cta.image = req.file.filename;
                        cta.link = req.body.link;
                        cta.price = req.body.price;
                        cta.save((err) => {
                            if (err) {
                                req.session.message = {
                                    type : 'error',
                                    message : err.message
                                }
                                return res.redirect('/admin/cta/update/'+ctaId);
                            }else{
                                req.session.message = {
                                    type :'success',
                                    message : 'CTA updated successfully'
                                }
                                return res.redirect('/admin/cta/view/' + ctaId);
                            }
                        });
                    }
                });

            }else{
                    Cta.findById(ctaId, (err, cta) => {
                        if (err) {
                            req.session.message = {
                                type : 'error',
                                message : 'This CTA does not exist'
                            };
                            return res.redirect('/admin/cta/index');
                        }
                        else{
                            cta.title = req.body.title;
                            cta.subtitle = req.body.subtitle;
                            cta.link = req.body.link;
                            cta.price = req.body.price;
                            cta.save((err) => {
                                if (err) {
                                    req.session.message = {
                                        type : 'error',
                                        message : err.message
                                    }
                                    return res.redirect('/admin/cta/update/'+ctaId);
                                }else{
                                    req.session.message = {
                                        type :'success',
                                        message : 'CTA updated successfully'
                                    }
                                    return res.redirect('/admin/cta/view/' + ctaId);
                                }
                            });
                        }
                    });
            }
        } catch (error) {
            next(error);
        }
    },


    // delete : (req, res,next) => {
    //     try{
    //         const bannerId = req.params.id;
    //         Banner.findByIdAndRemove(bannerId, (err) => {
    //             if (err) {
    //                 req.session.message = {
    //                     type : 'error',
    //                     message : 'This Banner does not exist'
    //                 };
    //                 return res.redirect('/admin/banner/index');
    //             }else{
    //                 req.session.message = {
    //                     type :'success',
    //                     message : 'Banner deleted successfully'
    //                 }
    //                 return res.redirect('/admin/banner/index');
    //             }
    //         });
    //     }catch(error) {
    //         next(error);
    //     }
    // },


    view : (req, res,next) => {
        try {
            const originalUrl = req.originalUrl;
            const ctaId = req.params.id;
            Cta.findById(ctaId, (err, cta) => {
                if (err) {
                    req.session.message = {
                        type : 'error',
                        message : 'This CTA does not exist'
                    };
                    return res.redirect('/admin/cta/index');
                }else{
                    res.render('./backend/cta/view', {
                        title : 'View CTA',
                        cta: cta,
                        currentUrl: originalUrl
                    });
                }
            });
        } catch (error) {
            next(error);
        }
    }
}