const About = require("../../models/backend/About");
module.exports = {

    index: (req, resp) => {
        const currentUrl = req.originalUrl;
        resp.render('./backend/default/index',{title: 'Admin',currentUrl});
    },

    about: (req, resp) => {
        const currentUrl = req.originalUrl;
        About.findById('63cba2289ad8ac17d1576026', (err, about) => {
            if (err) {
                resp.redirect("/admin");
            } else {
                if (about == null) {
                    resp.redirect("/admin");
                } else {
                    resp.render('./backend/default/about', { title: 'Update '+about.title, about: about ,currentUrl});
                }
            }
        });
    },

    // post req
    updateabout: (req, resp) => {
        About.findByIdAndUpdate('63cba2289ad8ac17d1576026', {
            title: req.body.title,
            description: req.body.description,
            updated_on:Date.now()
        }, (err, result) => {
            if (err) {
                resp.json({ message: err.message, type: 'danger' });
            } else {
                req.session.message = {
                    type: "success",
                    message: "About US Updated Successfully",
                };
                resp.redirect("/admin/about/update");
            }
        });
    },
}