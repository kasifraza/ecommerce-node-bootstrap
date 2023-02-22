const Blogs = require('../../models/backend/Blog');
const Comment = require('../../models/backend/Comment');
module.exports = {

    // all blogs page
    index: async (req, resp) => {
        const blogs = await Blogs.find({ status: true });
        resp.render('./frontend/blog/index', { title: 'Blogs', blogs });
    },

    // blog view page
    view: (req, resp, next) => {
        let slug = req.params.slug;
        Blogs.findOne({ slug: slug })
            .then((blog) => {
                resp.render('./frontend/blog/view', { blog, title: blog.seo_title });
            })
            .catch((err) => {
                next(err);
            });
    },
    addComment: async (req, resp, next) => {
        try{
            const { blogId, name, email, comment } = req.body;
            if(!blogId ||!name ||!email ||!comment){
                return resp.status(400).json({
                    message: 'Please fill all fields'
                });
            }
            Blogs.findOne({ _id: blogId })
                .then((blog) => {
                    const createComment = new Comment({
                        blogId : blogId,
                        name : name,
                        email : email,
                        comment : comment
                    });
                    createComment.save((err, comment) => {
                        if(err){
                            return resp.status(400).json({
                                message : 'Error occurred while saving comment'
                            });
                        }
                        return resp.status(201).json({
                            message : 'Thanks for your precious comment',
                        });
                    });
                })
                .catch((err) => {
                    return resp.status(400).json({
                        message : 'Something went wrong'
                    });
                });
        }catch(err){
            return resp.status(500).json({
                message : 'Internal Server Error'
            })
        }
    }

}