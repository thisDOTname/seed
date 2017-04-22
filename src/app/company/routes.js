'use strict';
/*global load*/
var C = require('hg-base').Controller;
var agencies = require('hg-sdks').data.agencies;
var companies = require('hg-sdks').data.companies;

function companyController(app) {
    //var self = this;
    //self.app = app; 
    /*jshint validthis:true */
    C.call(this);
    var self = this;
    self.init(app);

    self.config = self.app.get('config');
    self.session = app.get('session');

    self.validator = app.get('validator');
    self.agencySdk = new agencies(self.config);
    self.companySdk = new companies(self.config);
}

companyController.prototype = Object.create(C.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: companyController,
        writable: true
    }
});

companyController.prototype.setup = function() {
    var self = this;
    self.app.get('/companies/agencies/:agency_id', self.getCompaniesForAgency.bind(self));
    self.app.get('/companies/profile/:agency_id/:company_id', self.getCompaniesProfileForAgency.bind(self));
    self.app.put('/companies/profile/:agency_id/:company_id', self.updateCompaniesProfileForAgency.bind(self));
    self.app.put('/companies/profile/:agency_id', self.updateCompaniesProfileForAgency.bind(self));
    self.app.get('/companies/settings/:company_id', self.getCompanySettings.bind(self));

    //health check API endpoint
    self.app.get('/health', function(req, res) {
        res.status(200).json({
            status: 'OK'
        });
    });
};

companyController.prototype.getCompaniesForAgency = function(req, res) {
    var self = this;
    var agency_id = req.param('agency_id');
    self.agencySdk.getCompaniesForAgency(agency_id)
        .then(function(records) {
            self.okResponse(res, 200, records, null, req);
        })
        .catch(function(e) {
            self.nokResponse(res, 500, e, e, req);
        });
};

companyController.prototype.getCompaniesProfileForAgency = function(req, res) {
    var self = this;
    var agency_id = req.param('agency_id');
    var company_id = req.param('company_id');
    self.agencySdk.getAgencyProfileById(agency_id, company_id)
        .then(function(records) {
            self.okResponse(res, 200, records, null, req);
        })
        .catch(function(e) {
            self.nokResponse(res, 500, e, e, req);
        });
};

companyController.prototype.updateCompaniesProfileForAgency = function(req, res) {
    var self = this;
    var agency_id = req.param('agency_id');
    var company_id = req.param('company_id');
    var data = req.body;
    self.agencySdk.updateAgencyProfileById(agency_id, data, req.user_id, company_id, req)
        .then(function(records) {
            self.okResponse(res, 202, records, null, req);
        })
        .catch(function(e) {
            self.nokResponse(res, 500, e, e, req);
        });
};

companyController.prototype.getCompanySettings = function(req, res) {
    var self = this;
    var company_id = req.param('company_id');
    req.rest.set_headers(self.config.api.companyId, company_id);

    self.companySdk.getCompanySettings(req)
        .then(function(records) {
            self.okResponse(res, 200, records, null, req);
        })
        .catch(function(e) {
            self.nokResponse(res, 500, e, e, req);
        });
};

module.exports = companyController;