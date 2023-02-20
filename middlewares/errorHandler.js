function errorHandler(err, req, res,next) {
    res.status(err.status || 500);
    const currentUrl = req.originalUrl;
    // console.log(req.url);
    if(req.url.startsWith('/admin')) {
        res.render('./partials/backend/error', {
            message: err.message,
            error: err,
            title : err.status,
            currentUrl
        });
    }else{
        if (err.status === 404) {
            // req.app.set('layout', false);
            req.app.set('layout', './layouts/layout');
            return res.render('./partials/frontend/404', {
                message: err.message,
                error: err,
            });
        }
        // }else{
            req.app.set('layout', './layouts/layout');
            res.render('./partials/frontend/error', {
                message: err.message,
                error: err,
                title : err.status || 'Something went wrong',
            });
        // }
    }
}
module.exports = errorHandler;