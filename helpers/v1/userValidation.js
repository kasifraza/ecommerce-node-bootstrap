const { validationResult, body } = require('express-validator');

// Server Side Validation
module.exports = {

    // Login Validation
    loginValidate : (req, res, next) => {
        console.log(req.body);
        const validationRules = [
            body('email').notEmpty().withMessage('Email is Required'),
            body('email').isEmail().withMessage('Email is Invalid'),
            body('password').notEmpty().withMessage('Password is Required'),
            body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
            
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
    },

    // Register Validation
    registerValidate : (req, res, next) => {
        const {  password, confirm_password } = req.body;
        if(password !== confirm_password){
            return res.status(422).json({ errors: [{ msg: 'Passwords do not match' }] });
        }
        const validationRules = [
            body('name').notEmpty().withMessage('Name is Required'),
            body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
            body('confirm_password').notEmpty().withMessage('Confirm Password is Required'),
            body('email').notEmpty().withMessage('Email is Required'),
            body('email').isEmail().withMessage('Email is Invalid'),
            body('password').notEmpty().withMessage('Password is Required'),
            body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
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
    },

    // Create Addresses Validation
    createAddressValidate : (req, res, next) => {
        const validationRules = [
            body('firstname').notEmpty().withMessage('First Name is Required'),
            body('lastname').notEmpty().withMessage('Last Name is Required'),
            body('street').notEmpty().withMessage('Street is Required'),
            body('city').notEmpty().withMessage('City is Required'),
            body('state').notEmpty().withMessage('State is Required'),
            body('zip').notEmpty().withMessage('Zip Code is Required'),
            body('phone').notEmpty().withMessage('Phone Number is Required'),
            body('email').notEmpty().withMessage('Email is Required'),
            body('email').isEmail().withMessage('Email is Invalid'),
            body('city').isString().withMessage('City must be a string'),
            body('phone').isMobilePhone().withMessage('Phone Number must be a valid mobile phone number'),
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