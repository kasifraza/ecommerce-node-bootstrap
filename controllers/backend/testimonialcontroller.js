const Testimonial = require('../../models/backend/Testimonial');
const fs = require('fs');
module.exports = {
    index :  (req, res,next) => {
        try {
            const currentUrl = req.originalUrl;
            Testimonial.find({}, (err, data) => {
                if(err){
                    req.session.message = {
                        type:'error',
                        message : err.message
                    };
                    res.redirect('/admin/testimonial');
                }
                res.render('./backend/testimonial/index', {currentUrl,testimonials :data,title : 'Testimonials'});
            });
        } catch (error) {
            next(error);
        }
    },
    create :  (req, res,next) => {
        try { 
            const currentUrl = req.originalUrl;
            res.render('./backend/testimonial/create', {currentUrl,title : 'Create Testimonial'});
        } catch (error) {
            next(error);
        }
    },
    createPost: (req, res,next) => {
        try {            
            Testimonial.create(req.body, (err, testimonial) => {
                if(err){
                    req.session.message = {
                        type:'error',
                        message : err.message
                    };
                    return res.redirect('/admin/testimonial');
                }
                req.session.message = {
                    type :'success',
                    message : 'Testimonial Created Successfully'
                };
                return res.redirect('/admin/testimonial');
            });
        } catch (error) {
            next(error);
        }
    },
    update :(req,res,next) => {
        try {
           Testimonial.findById(req.params.id)
           .then((testimonial) => {
                    const currentUrl = req.originalUrl;
                    res.render('./backend/testimonial/update', {currentUrl,testimonial,title : 'Update Testimonial'});
                }
            )
            .catch((err) => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                req.session.message = {
                    type:'error',
                    message : err.message
                };
                return res.redirect('/admin/testimonial');
            });
        } catch (error) {
            next(error);
        }
    },
    updatePost : async (req, res,next) => {
        try {
            Testimonial.findByIdAndUpdate(req.params.id, req.body, (err, testimonial)=>{
                if(err){
                    req.session.message = {
                        type:'error',
                        message : err.message
                    };
                    return res.redirect('/admin/testimonial');
                }
                req.session.message = {
                    type :'success',
                    message : 'Testimonial Updated Successfully'
                };
                return res.redirect('/admin/testimonial/view/'+req.params.id);
            });
        } catch (error) {
            next(error);
        }
    },
    delete :async (req,res,next) => {
        try {
           Testimonial.findByIdAndRemove(req.params.id, (err, testimonial)=>{
            if(err){
                req.session.message = {
                    type:'error',
                    message : err.message
                };
                return res.redirect('/admin/testimonial');
            }
            req.session.message = {
                type :'success',
                message : 'Testimonial Deleted Successfully'
            };
            return res.redirect('/admin/testimonial/index');
           })
        } catch (error) {
            next(error);
        }
    },
    view : (req,res,next) => {
        try{
            const currentUrl = req.originalUrl;
            Testimonial.findById(req.params.id, (err, testimonial) => {
                if(err){
                    req.session.message = {
                        type:'error',
                        message : 'Unable to find testimonial'
                    };
                    return res.redirect('/admin/testimonial');
                }
                res.render('./backend/testimonial/view', {currentUrl,testimonial,title : 'View Testimonial'});
            });
        }catch (error) {
            next(error);
        }
    }
}