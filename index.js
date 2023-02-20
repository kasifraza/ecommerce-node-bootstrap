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
const catlist = require('./middlewares/catList');
const User = require('./models/backend/User');
const jwt = require('jsonwebtoken');
const Category = require('./models/backend/Category');
const bannerRoutes = require('./routes/admin/bannerRoutes');
const brandRoutes = require('./routes/admin/brandRoutes');
const ctaRoutes = require('./routes/admin/ctaRoutes');
const defaultRoutes = require('./routes/default/defaultRoutes');
const adminRoutes = require('./routes/admin/adminRoutes');
const shopRoutes = require('./routes/default/product/productRoutes');
const userRoutes = require('./routes/default/users/userRoutes');
const cartRoutes = require('./routes/default/product/cartRoutes');
const testimonialRoutes = require('./routes/admin/testimonialRoutes');
const apiRoutes = require('./routes/api/apiRoutes');
const apiv1Routes = require('./routes/api/v1/apiv1Routes');
const errorHandler = require('./middlewares/errorHandler');
const { isAdmin } = require('./middlewares/isAdmin');


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

app.use((req, resp, next) => {
  if (req.cookies.token) {
    const token = req.cookies.token;
    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
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
  resp.locals.admin = req.session.admin;
  resp.locals.checkoutUser = req.session.checkoutUser;
  delete req.session.message;
  next();
});


// setting all category for ejs view file in header
app.use(helpers.allCategories);


app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'));
// app.use(express.static('uploads/products'));
app.use(express.static(path.join(__dirname, 'assets')));
// retrieve cart count
app.use(retrieveCartCount);

// retreive all category for navbar
// Setting up my ejs view engine
app.use(expressLayouts)
app.set('layout', './layouts/layout')
app.set('view engine', 'ejs');


// Setting UP Helper
app.locals.getCategoryName = helpers.getCategoryName;

app.use('/', defaultRoutes);

// Frontend product pages
app.use('/shop', shopRoutes);

// Cart Routes
app.use('/cart', cartRoutes);

// Frontend API
app.use('/api', apiRoutes);

// All Api
app.use('/api/v1',apiv1Routes);

// CMS 
app.use('/admin', adminRoutes);
app.use('/admin/banner', isAdmin, bannerRoutes);
app.use('/admin/brand', isAdmin, brandRoutes);
app.use('/admin/testimonial', isAdmin, testimonialRoutes);
app.use('/admin/cta', isAdmin, ctaRoutes);

// Frontend User 
app.use('/user', userRoutes);


//  error page
app.use(errorHandler);
app.use('*', (req, resp) => {
  resp.status(404).render('./partials/frontend/404',{title:'Not Found'});
});


app.listen(8000, () => {
  console.log(`Server started on port`);
});