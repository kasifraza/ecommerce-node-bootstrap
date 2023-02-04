const Blogs = require('../../models/backend/Blog');
module.exports = {

    // all blogs page
    index: async (req, resp) => {
        const blogs = await Blogs.find({ status: true });
        resp.render('./frontend/blog/index', { title: 'Blogs', blogs });
    },

    // blog view page
    view: async (req, resp,next) => {
        let id = req.params.id;
        const blog = await Blogs.findById(id)
            .then((blog) => {
                resp.render('./frontend/blog/view', { blog, title: blog.title });
            })
            .catch((err) => {
                next(err);
            });
    },

}