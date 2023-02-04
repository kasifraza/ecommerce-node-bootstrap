const About = require("../../models/backend/About");
const Blogs = require('../../models/backend/Blog');
module.exports = {

    // index page
    index: async (req, resp) => {
        // const blogs = await Blogs.find({ status: true });
        resp.render('./frontend/default/index', { title: 'EC' });
    },

    // about page
    about: (req, resp,next) => {
        About.findById('63cba2289ad8ac17d1576026')
        .then((about) => {
            resp.render('./frontend/default/about', { title: about.title, about: about });
        })
        .catch((err) => {
            next(err);
        });
    },

    // contact-us page

    contact: (req,resp) =>{
        resp.render('./frontend/default/contact',{title:'Contact US'})
    }
}