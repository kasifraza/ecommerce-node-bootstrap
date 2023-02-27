const Blog = require('../../models/backend/Blog');
module.exports = {
    index : async(req,res) =>{
        try{
            const blogs = await Blog.find().sort({date:-1});
            if(blogs.length === 0){
                return res.status(404).json({
                    message : 'No blogs found'
                });
            }
            return res.status(200).json(blogs);
        }catch{
            return res.status(500).json({
                message : 'Internal Server Error'
            });
        }
    }
}