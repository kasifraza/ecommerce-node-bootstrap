const Blog = require('../../models/backend/Blog');
const { validationResult, body } = require('express-validator');
module.exports = {
    createBlogValidate : (req, res, next) => {
        const validationRules = [
            body('title').notEmpty().withMessage('Blog Title is Required'),
            body('description').notEmpty().withMessage('Blog Description is Required'),
            body('status').notEmpty().withMessage('Blog Status is Required'),
            body('title').isString().withMessage('Blog Title must be a string'),
        ];
        Promise.all(validationRules.map(rule => rule.run(req)))
        .then(() => {
            const errors = validationResult(req);
            if (errors.isEmpty()) {
                return next();
            }
            res.status(422).json({ errors: errors.array() });
        })
        .catch(next); 
        
    }
}