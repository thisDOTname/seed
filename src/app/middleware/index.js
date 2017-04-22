'use strict';
var r = require('hg-base').RestConnector;
var allowed_urls = ['/auth/login', '/forgotpassword', '/resetpasswordlink', '/resetpassword', '/signup', '/users/email', '/files', '/users/agencies/upload', '/users/agencies/files'];

module.exports = {

    auth: function(req, res, next) {
        var session = req.session;
        var config = req.app.get('config');
        req.rest = new r(config);
        var sessionId = req.headers[config.api.tokenKeyName];
        var log = req.app.get('log');

        if (req.originalUrl === '/health') {
            next();
        } else {
            var url = req.originalUrl.split("?")[0];
            var formattedUrl = url || req.originalUrl;

            if (allowed_urls.indexOf(formattedUrl) < 0) {
                if (typeof(sessionId) !== 'undefined') {
                    session.get('users')
                        .then(function(sessionData) {
                            req.user_id = sessionData.users.user_id;
                            req.rest.set_headers(config.api.userId, sessionData.users.user_id);
                            req.rest.set_headers(config.api.userType, 'user');
                            next();
                        })
                        .catch(function(e) {
                            log.error(e);
                            res.set('X-Status', 'error');
                            res.set(config.api.messageKey, 'Invalid API credentials. You must pass the API key HTTP header (' + config.api.tokenKeyName + ') with correct value.');
                            res.status(401).json({});
                        });
                } else {
                    res.set('X-Status', 'error');
                    res.set(config.api.messageKey, 'Invalid API credentials. You must pass the API key HTTP header (' + config.api.tokenKeyName + ') with correct value.');
                    res.status(401).json({});
                }
            } else {
                next();
            }
        }
    }
};