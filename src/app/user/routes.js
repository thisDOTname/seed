'use strict';
/*global load*/
var userModel = load("user/userModel"),
    C = require('hg-base').Controller;
var agencies = require('hg-sdks').security.agencies;

function userController(app) {
    //var self = this;
    //self.app = app; 
    /*jshint validthis:true */
    C.call(this);
    var self = this;
    self.init(app);

    self.model = new userModel(app);
    self.app.set('user_model', self.model);
    self.config = self.app.get('config');
    self.session = app.get('session');
    self.agencySdk = new agencies(self.config);
    self.validator = app.get('validator');
}

userController.prototype = Object.create(C.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: userController,
        writable: true
    }
});

userController.prototype.setup = function() {
    var self = this;
    self.app.get('/users/email', self.getUserByEmail.bind(self));
    self.app.get('/users/:uuid', self.getUser.bind(self));
    self.app.get('/users/agencies/files', self.getAgencyFile.bind(self));
    self.app.post('/users/agencies/upload/', self.uploadAgencyFile.bind(self));
    self.app.get('/users/agencies/:agency_id', self.getUsersData.bind(self));
    self.app.put('/users/:uuid', self.updateUser.bind(self));
    self.app.post('/forgotpassword', self.forgotpasswordValidate.bind(self));
    self.app.post('/resetpasswordlink', self.validateResetPasswordLink.bind(self));
    self.app.put('/resetpassword', self.updatePassword.bind(self));
   


    self.app.post('/signup', self.signupAgency.bind(self));
};

userController.prototype.updatePassword = function(req, res) {
    var self = this;
    var config = self.config;
    var v = self.validator;

    var data = req.body;

    if (data !== false && v.presence([data.agency_id, data.email, data.password, data.linkFlag])) {
        self.model.updatePassword(data)
            .then(function(response) {
                self.okResponse(res, 202, response, null, req);
            })
            .catch(function(e) {
                var errMessage = e.response.headers[config.api.messageKey];
                self.nokResponse(res, e.statusCode, errMessage, errMessage, req);
            });
    } else {
        self.nokResponse(res, 400, 'Invalid request format', null, req);
    }
};

userController.prototype.validateResetPasswordLink = function(req, res) {
    var self = this;
    var config = self.config;
    var v = self.validator;

    var data = req.body;

    if (data !== false && v.presence([data.link])) {
        self.model.checkresetPasswordLink(data.link)
            .then(function(response) {
                self.okResponse(res, 200, response, null, req);
            })
            .catch(function(e) {
                var errMessage = e.response.headers[config.api.messageKey];
                self.nokResponse(res, e.statusCode, errMessage, errMessage, req);
            });
    } else {
        self.nokResponse(res, 400, 'Invalid request format', null, req);
    }
};

userController.prototype.getUser = function(req, res) {
    var self = this;
    var agencyId = req.param('uuid');

    self.model.getUserProfile(agencyId, req)
        .then(function(response) {
            self.okResponse(res, 200, response, null, req);
        })
        .catch(function(e) {
            self.nokResponse(res, 500, "User could not be fetched: " + e, e, req);
        });
};

userController.prototype.getUsersData = function(req, res) {
    var self = this;
    var agencyId = req.param('agency_id');
    self.agencySdk.getAgencyUser(agencyId)
        .then(function(records) {
            self.okResponse(res, 200, records, null, req);
        })
        .catch(function(e) {
            self.nokResponse(res, 500, "User could not be fetched: " + e, e, req);
        });
};

userController.prototype.updateUser = function(req, res) {
    var self = this;
    var agencyId = req.param('uuid');
    var data = req.body;
    self.agencySdk.updateAgencyUser(agencyId, data)
        .then(function(response) {
            self.okResponse(res, 202, response, null, req);
        })
        .catch(function(e) {
            self.nokResponse(res, 500, "User could not be fetched: " + e, e, req);
        });
};

userController.prototype.forgotpasswordValidate = function(req, res) {
    var self = this;
    var config = self.config;
    var v = self.validator;

    var data = req.body;

    if (data !== false && v.presence([data.username, data.domain_name])) {
        self.model.forgotpasswordValidate(data.username, data.domain_name)
            .then(function(response) {
                self.okResponse(res, 200, response, null, req);
            })
            .catch(function(e) {
                var errMessage = e.response.headers[config.api.messageKey];
                self.nokResponse(res, e.statusCode, errMessage, errMessage, req);
            });
    } else {
        self.nokResponse(res, 400, 'Invalid request format', null, req);
    }
};

userController.prototype.signupAgency = function(req, res) {
    var self = this;
    var config = self.config;
    var v = self.validator;

    var data = req.body;

    //Check if company_id is present in data
    if (data !== false && v.presence([data.company_id])) {
        self.model.signupAgency(req)
            .then(function(records) {
                self.okResponse(res, 201, records, null, req);
            })
            .catch(function(e) {
                var statusCode = e.response.statusCode;
                var errMessage = e.response.headers[config.api.messageKey];

                self.nokResponse(res, statusCode, errMessage, errMessage, req);
            });
    } else {
        self.nokResponse(res, 400, 'Invalid request format', null, req);
    }
};

userController.prototype.getUserByEmail = function(req, res) {
    var self = this;
    var email = req.param('email');
    var company_id = req.param('company_id');
    var config = self.config;

    self.model.getUserByEmail(email, company_id, req)
        .then(function(record) {
            if (record === null) {
                self.okResponse(res, 404, {}, null, req);
            } else {
                self.okResponse(res, 200, record, null, req);
            }
        })
        .catch(function(e) {
            var statusCode = e.response.statusCode;
            var errMessage = e.response.headers[config.api.messageKey];
            var existsCompany = e.response.headers['x-exists-company'];
            res.set('x-exists-company', existsCompany);

            self.nokResponse(res, statusCode, errMessage, errMessage, req);
        });
};

userController.prototype.uploadAgencyFile = function(req, res) {
    var self = this;
    var config = self.config;
    var data = req.body;
    var files = req.files;

    self.model.uploadAgencyFile(req.headers['agency_id'], req.headers[config.api.companyId], files)
        .then(function(record) {
            self.okResponse(res, 200, record, null, req);
        })
        .catch(function(e) {
            var statusCode = e.response.statusCode;
            var errMessage = e.response.headers[config.api.messageKey];

            self.nokResponse(res, statusCode, errMessage, errMessage, req);
        });
};

userController.prototype.getAgencyFile = function(req, res) {
    var self = this;
    var config = self.config;
    var data = req.param('file_id');

    self.model.getAgencyFile(data)
        .then(function(record) {
            self.okResponse(res, 200, record, null, req);
        })
        .catch(function(e) {
            var statusCode = e.response.statusCode;
            var errMessage = e.response.headers[config.api.messageKey];

            self.nokResponse(res, statusCode, errMessage, errMessage, req);
        });
};




module.exports = userController;