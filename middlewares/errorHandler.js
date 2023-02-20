function errorHandler(err, req, res, next) {
    res.status(err.status || 500);
    const currentUrl = req.originalUrl;
    if (req.url.startsWith('/admin')) {
        req.app.set('layout', './layouts/admin');
        return res.render('./partials/backend/error', {
            message: err.message,
            error: err,
            title: err.status || 500,
            currentUrl
        });
    } else {
        req.app.set('layout', './layouts/layout');
        return res.render('./partials/frontend/error', {
            message: err.message,
            error: err,
            title: err.status || 'Something went wrong',
        });
    }
}
module.exports = errorHandler;