const WishList = require('../models/backend/Wishlist');
const isUserORisCookie = (req, res, next) => {
    const user = req.session.user;
    const cookieWishlist = req.cookies.wishlist;
    if(user && cookieWishlist) {
        if(cookieWishlist.length > 0) {
            for(let i = 0; i < cookieWishlist.length; i++) {
                Product.findById(cookieWishlist[i], async (err, product) => {
                    if(err) {
                        cookieWishlist.splice(i, 1);
                    }
                    const addTowish = new WishList({
                        user: user._id,
                        products: product._id
                    });
                    await addTowish.save();
                    cookieWishlist.splice(i, 1);
                    i--;
                });
            }
            res.cookie('wishlist', cookieWishlist, { maxAge: 90000 });
            WishList.find({user: user._id}, (err, wishlists) => {
                if(err) {
                    req.session.message = {
                        type : 'error',
                        message : 'WishList is Empty'
                    };
                    return res.redirect('/shop');
                }
                return res.render('wishlist', {
                    wishlists : wishlists,
                    title : 'WishList',
                });
            }).populate('products');
        }
    } else if(!user && cookieWishlist) {
        if(cookieWishlist.length > 0) {
            const wishlists = [];
            for(let i = 0; i < cookieWishlist.length; i++) {
                Product.findById(cookieWishlist[i], (err, product) => {
                    if(err) {
                        cookieWishlist.splice(i, 1);
                        i--;
                    }
                    wishlists.push(product);
                });
            }
            res.cookie('wishlist', cookieWishlist, { maxAge: 90000 });
            if(wishlists.length > 0) {
                return res.render('wishlist', {
                    title : 'WishList',
                    wishlists
                });
            }else{
                req.session.message = {
                    type : 'error',
                    message : 'WishList is Empty'
                }
                return res.redirect('/shop');
            }

        }
    }
}