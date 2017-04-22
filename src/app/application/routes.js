/*
 * @Author: Hemant Rai - hemantrai1988@gmail.com
 * @Date: 2017-03-31 15:52:37
 * @Last Modified by:   Hemant Rai - hemantrai1988@gmail.com
 * @Last Modified time: 2017-03-31 15:52:37
 */

'use strict';
/*global load*/
var applicationModel = load("application/applicationModel"),
    C = require('hg-base').Controller;


function applicationController(app) {
    //var self = this;
    //self.app = app; 
    /*jshint validthis:true */
    C.call(this);
    var self = this;
    self.init(app);

    self.model = new applicationModel(app);
    self.app.set('application_model', self.model);
    self.config = self.app.get('config');
    self.session = app.get('session');

    self.validator = app.get('validator');
}

applicationController.prototype = Object.create(C.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: applicationController,
        writable: true
    }
});

applicationController.prototype.setup = function() {
    var self = this;
    self.app.get('/applications/fields', self.getApplicationsFields.bind(self));
    self.app.post('/applications/checkduplicate', self.checkDuplicateApplication.bind(self));
    self.app.post('/applications/cv', self.uploadApplicantResume.bind(self));
    self.app.put('/applications/withdraw/:id', self.withdrawApplication.bind(self));
    self.app.put('/applications/:id', self.updateApplication.bind(self));
    self.app.post('/applications/generatepdf/:id', self.triggerApplicantPDFCreation.bind(self));
    self.app.post('/applications', self.createApplication.bind(self));
    self.app.get('/application/:id/:companyId', self.getApplication.bind(self));
};

applicationController.prototype.getApplicationsFields = function(req, res) {
    var self = this;
    var json = require('hg-base').GlobalBbObj;
    self.okResponse(res, 200, json, null, req);
};

applicationController.prototype.checkDuplicateApplication = function(req, res) {
    var self = this;
    var v = self.validator;

    var data = req.body;

    req.rest.set_headers(self.config.api.companyId, data.company_id);

    //Check if company_id is present in data
    if (data !== false && v.presence([data.company_id, data.job_id, data.email])) {
        self.model.checkDuplicateApplication(data, req)
            .then(function(records) {
                self.okResponse(res, 200, records, null, req);
            })
            .catch(function(e) {
                if (e.indexOf("Record Not Found") > -1) {
                    self.okResponse(res, 200, false, null, req);
                } else if (e.indexOf("Candidate already exists") > -1) {
                    self.nokResponse(res, 409, e, e, req);
                } else {
                    self.nokResponse(res, 500, e, e, req);
                }
            });
    } else {
        self.nokResponse(res, 400, 'Invalid request format', null, req);
    }
};

applicationController.prototype.updateApplication = function(req, res) {
    var self = this;
    var config = self.config;
    var v = self.validator;

    var applicationId = req.param('id');

    var data = req.body;

    req.rest.set_headers(self.config.api.companyId, data.company_id);

    //Check if company_id is present in data
    if (data !== false && v.presence([data.formdata])) {
        self.model.updateApplication(applicationId, req)
            .then(function(records) {
                self.okResponse(res, 202, records, null, req);
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

applicationController.prototype.withdrawApplication = function(req, res) {
    var self = this;
    var config = self.config;
    var v = self.validator;

    var applicationId = req.param('id');

    var data = req.body;

    req.rest.set_headers(self.config.api.companyId, data.company_id);

    //Check if job_id and company_id is present in data
    if (data !== false && v.presence([data.job_id, data.company_id, data.additional_comments, data.candidate_number, data.candidate_name])) {
        self.model.withdrawApplication(applicationId, req)
            .then(function(records) {
                self.okResponse(res, 202, records, null, req);
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

applicationController.prototype.triggerApplicantPDFCreation = function(req, res) {
    var self = this;
    var config = self.config;
    var applicationId = req.param('id');

    self.model.triggerApplicantPDFCreation(applicationId, req)
        .then(function(record) {
            self.okResponse(res, 200, record, null, req);
        })
        .catch(function(e) {
            var statusCode = e.response.statusCode;
            var errMessage = e.response.headers[config.api.messageKey];

            self.nokResponse(res, statusCode, errMessage, errMessage, req);
        });
};

applicationController.prototype.uploadApplicantResume = function(req, res) {
    var self = this;
    var config = self.config;
    var data = req.body;
    var files = req.files;

    self.model.uploadFile(req.headers[config.api.companyId], files, 'CV')
        .then(function(record) {
            self.okResponse(res, 200, record, null, req);
        })
        .catch(function(e) {
            var statusCode = e.response.statusCode;
            var errMessage = e.response.headers[config.api.messageKey];

            self.nokResponse(res, statusCode, errMessage, errMessage, req);
        });
};

applicationController.prototype.createApplication = function(req, res) {
    var self = this;
    var config = self.config;
    var v = self.validator;

    var data = req.body;

    req.rest.set_headers(self.config.api.companyId, data.company_id);

    //Check if email is present in data
    if (data !== false && v.presence([data.first_name, data.last_name]) && ((!v.presence(data.email) && v.presence(data.without_email)) || v.presence(data.email))) {
        self.model.createApplication(req)
            .then(function(record) {
                self.okResponse(res, 200, record, null, req);
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

applicationController.prototype.getApplication = function(req, res) {
    var self = this;

    var applicationId = req.param('id');
    var companyId = req.param('companyId');

    self.model.getApplication(applicationId, companyId, req)
    .then(function(record) {
        self.okResponse(res, 200, record, null, req);
    })
    .catch(function(e) {
        var statusCode = e.response.statusCode;
        var errMessage = e.response.headers[config.api.messageKey];

        self.nokResponse(res, statusCode, errMessage, errMessage, req);
    });
};


module.exports = applicationController;