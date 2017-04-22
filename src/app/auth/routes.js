/*global load*/
var authModel = load("auth/authModel");
var C = require('hg-base').Controller;
var util = require('util');

function authController(app) {
    //var self = this;
    //self.app = app; 

    C.call(this);
    var self = this;
    self.init(app);    

    self.model = new authModel(app);
    app.set('auth_model', self.model);
}

authController.prototype = Object.create(C.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: authController,
        writable: true
    }
});

authController.prototype.setup = function() {
    var self = this; 

    self.app.post('/auth/login', self.doLogin.bind(self));
    self.app.post('/auth/logout', self.doLogout.bind(self));
};

authController.prototype.doLogin = function(req, res) {
    var self = this;
    var config = self.config;

    self.model.doLogin(req)
        .then(function(record) {
            //Put authentication token in the response header
            res.set(config.api.tokenKeyName, record.token);
            self.okResponse(res, 200, record.records, null, req);
        })
        .catch(function(e) {
            //var errMessage = e.response.headers[config.api.messageKey];
            self.nokResponse(res, 401, 'Username or password is incorrect', 'null', req);
        });
};

authController.prototype.doLogout = function(req, res) {
    var self = this;
    self.model.logout(req)
        .then(function() {
            self.okResponse(res, 200, {}, null, req);
        })
        .catch(function(e) {
            self.nokResponse(res, 500, "Could not logout", e, req);
        });
};




module.exports = authController;