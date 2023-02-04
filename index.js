require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts')
const mongoUrl = process.env.MONGOURL;
const helpers = require('./helpers/helper');
const retrieveCartCount = require('./middlewares/cartCount');
const User = require('./models/backend/User');
const jwt = require('jsonwebtoken');


const app = express();

// Mongo DB Connection
mongoose.set("strictQuery", false);
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
});

// ALL uses
app.use(session({
    secret: 'sessionjhh flash',
    resave: false,
    saveUninitialized: true,
  //   cookie: {
  //     secure: true,
  //     httpOnly: true,
  //     maxAge: 30 * 86400000
  // }
}));

// cookie use
app.use(cookieParser());

app.use((req,resp,next) => {
  if(req.cookies.token){
    const token = req.cookies.token;
    jwt.verify(token, process.env.JWT_SECRET,async (error, decoded) => {
        if (error) {
            resp.clearCookie('token');
        }
        else {
            const user = await User.findById(decoded.user.id);
            if (user) {
                req.session.user = user;
                req.data = user;
                
            }
        }
    });
  }
  resp.locals.message = req.session.message;
  resp.locals.user = req.session.user;
  resp.locals.checkoutUser = req.session.checkoutUser;
  delete req.session.message;
  next();
});



app.use(express.json());

app.use(express.urlencoded({extended:true}));
app.use(express.static('uploads'));
app.use(express.static(path.join(__dirname,'assets')));
// retrieve cart count
app.use(retrieveCartCount);

// Setting up my ejs view engine
app.use(expressLayouts)
app.set('layout', './layouts/layout')
app.set('view engine','ejs');


// Setting UP Helper
app.locals.getCategoryName = helpers.getCategoryName;
// Routes
const defaultRoutes = require('./routes/default/defaultRoutes');
const adminRoutes = require('./routes/admin/adminRoutes');
const shopRoutes = require('./routes/default/product/productRoutes');
const userRoutes = require('./routes/default/users/userRoutes');
const cartRoutes = require('./routes/default/product/cartRoutes');
const apiRoutes = require('./routes/api/apiRoutes');
app.use('/',defaultRoutes);

// Frontend product pages
app.use('/shop',shopRoutes);

// Cart Routes
app.use('/cart',cartRoutes);

// Frontend API
app.use('/api',apiRoutes);

// CMS 
app.use('/admin',adminRoutes);

// Frontend User 
app.use('/user',userRoutes);


//  error page
app.use(function(err, req, resp, next) {
  const currentUrl = req.originalUrl;
  if(req.url.startsWith('/admin')) {
    resp.status(err.status || 500);
    // resp.json();
    resp.render('./partials/backend/error', {
        message: err.message,
        error: err,
        title : err.status,
        currentUrl
    });
  } else {
    resp.status(err.status || 500);
    resp.render('./partials/frontend/error', {
        message: err.message,
        error: err
    });
  }
});
 

app.listen(3000, () => {
    console.log(`Server started on port`);
});