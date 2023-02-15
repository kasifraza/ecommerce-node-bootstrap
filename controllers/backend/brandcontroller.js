const Brand = require('../../models/backend/Brand');
const fs = require('fs');
module.exports = {
    index :  (req, res,next) => {
        try {
            const currentUrl = req.originalUrl;
            Brand.find({}, (err, data) => {
                if(err){
                    req.session.message = {
                        type:'error',
                        message : err.message
                    };
                    res.redirect('/admin/brand');
                }
                res.render('./backend/brand/index', {currentUrl,brands :data,title : 'Brands'});
            });
        } catch (error) {
            next(error);
        }
    },
    create :  (req, res,next) => {
        try { 
            const currentUrl = req.originalUrl;
            res.render('./backend/brand/create', {currentUrl,title : 'Create Brand'});
        } catch (error) {
            next(error);
        }
    },
    createPost: (req, res,next) => {
        try {            
            const brand = new Brand({
                name : req.body.name,
                image : req.file.filename
            });
            brand.save((err, data) => {
                if(err){
                    req.session.message = {
                        type:'error',
                        message : err.message
                    };
                    return res.redirect('/admin/brand/create');
                }
                req.session.message = {
                    type : 'success',
                    message : 'Brand Added Successfully'
                }
                return  res.redirect('/admin/brand/index/');
            });
            
        } catch (error) {
            next(error);
        }
    },
    update :(req,res,next) => {
        try {
            const currentUrl = req.originalUrl;
            const id = req.params.id;
            Brand.findById(id, (err, brand) => {
                if(err){
                    req.session.message = {
                        type:'error',
                        message : 'Unable to Find Brand'
                    };
                    return res.redirect('/admin/brand/index');
                }
                return res.render('./backend/brand/update', {currentUrl,title : 'Update Brand',brand})
            });
        } catch (error) {
            next(error);
        }
    },
    updatePost : async (req, res,next) => {
        try {
            const id = req.params.id;
            Brand.findById(id)
            .then((brand)=>{
                const oldImage = brand.image;
                if(req.file){
                    brand.name = req.body.name;
                    brand.image = req.file.filename;
                    fs.unlinkSync('assets/uploads/brands/' + oldImage);
                }else{
                    brand.name = req.body.name;
                }
                return brand.save();
            })
            .then((result)=>{
                req.session.message = {
                    type :'success',
                    message : 'Brand Updated Successfully'
                };
                return res.redirect('/admin/brand/view/'+id);
            })
            .catch((err)=>{
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                req.session.message = {
                    type:'error',
                    message : err.message
                };
                return  res.redirect('/admin/brand/update/'+id);
            })
        } catch (error) {
            next(error);
        }
    },
    delete :async (req,res,next) => {
        try {
            const id = req.params.id;
            const brand = Brand.findById(id);
            const oldImage = brand.image;
            // fs.unlinkSync('assets/uploads/brands/' + oldImage);
             fs.unlink('assets/uploads/brands/'+oldImage, (err) => {
                if(err){
                    req.session.message = {
                        type:'error',
                        message :  'Unable to Delete Brand Image '
                    };
                    return res.redirect('/admin/brand/index');
                }
                else{
                    Brand.findByIdAndRemove(id, (err, data) => {
                        if(err){
                            req.session.message = {
                                type:'error',
                                message : err.message
                            };
                            return res.redirect('/admin/brand/index');
                        }
                        req.session.message = {
                            type :'success',
                            message : 'Brand Deleted Successfully'
                        };
                        return res.redirect('/admin/brand/index');
                    });
                }
            });
        } catch (error) {
            next(error);
        }
    },
    view : (req,res,next) => {
        try{
            const currentUrl = req.originalUrl;
            const id = req.params.id;
            Brand.findById(id, (err, brand) => {
                if(err){
                    req.session.message = {
                        type:'error',
                        message : 'Unable to Find Brand'
                    };
                    return res.redirect('/admin/brand/index');
                }
               return res.render('./backend/brand/view', {currentUrl,title : 'View Brand',brand});
            });
        }catch (error) {
            next(error);
        }
    }
}