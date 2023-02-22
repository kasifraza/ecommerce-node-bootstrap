const About = require("../../models/backend/About");
const Blogs = require('../../models/backend/Blog');
const Category = require('../../models/backend/Category');
const Banner = require('../../models/backend/Banner');
const Product = require('../../models/backend/Product');
const Cache = require('../../models/backend/Cache');
const Cta = require('../../models/backend/Cta');
const Brand = require('../../models/backend/Brand');
const Testimonial = require('../../models/backend/Testimonial');
const Enquiry = require('../../models/backend/Enquiry');
const moment = require('moment');
const _ = require('lodash');
const { request } = require("express");
module.exports = {

    // index page
    index: async (req, resp,next) => {
        try {
            const banners = await Banner.find({});
            const ctas = await Cta.find({});
            const shopByCategories = await Category.find({status:true});
            const brands = await Brand.find({});
            const testimonials = await Testimonial.find({});
            const hotItems = await Product.find({status:true,mark : 'HOT'}).populate('category');

            let cachedProductData = [];
            let cachedTimestamp = null;
    
            const refreshProductData = async () => {
                cachedProductData = await Product.find({}).populate('category').limit(10);
                cachedTimestamp = moment();
                await Cache.deleteMany({});
                await Cache.create({
                    data: cachedProductData,
                    timestamp: cachedTimestamp.toDate()
                });
            }
            const getCachedProductData = async () => {
                if (!cachedProductData || !cachedProductData.length > 0 || !cachedTimestamp) {
                  const cache = await Cache.findOne({});
                  if (cache) {
                    cachedProductData = cache.data;
                    cachedTimestamp = moment(cache.timestamp);
                  } else {
                    await refreshProductData();
                  }
                }
              
                const now = moment();
                const timeDifference = moment.duration(now.diff(cachedTimestamp)).asHours();
                if (timeDifference >= 24) {
                  await refreshProductData();
                }
                return cachedProductData;
            }
            setInterval(async () => {
                await refreshProductData();
            }, 24 * 60 * 60 * 1000); // Runs once a day
            const dealsProducts = await getCachedProductData();
            

            resp.render('./frontend/default/index', {brands,testimonials, banners: banners, dealsProducts: dealsProducts ,ctas,shopByCategories,hotItems});
        } catch (error) {
            next(error);   
        }
    },
    

    // about page
    about: (req, resp,next) => {
        try {
            return resp.render('./frontend/default/about',{title : 'About-Us'});
        } catch (error) {
            next(error);   
        }
    },

    // contact-us page

    contact: (req,resp) =>{
        resp.render('./frontend/default/contact',{title:'Contact US'})
    },


    // Enquiry Post
    enquiryPost:(req,resp,next) => {
        // req.app.set('layout', false);
        try {
            Enquiry.create(req.body, (err, enquiry) => {
                if(err){
                    req.session.message = {
                        type : 'error',
                        message : err.message
                    };
                    return resp.redirect('/about-us');
                }
                req.session.message = {
                    type : 'success',
                    message: 'Thank you for your enquiry. We will get back to you as soon as possible.'
                };
                return resp.redirect('/about-us');
            })
        } catch (error) {
            next(error);   
        }
    },
}