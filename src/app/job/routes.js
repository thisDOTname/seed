'use strict';
/*global load*/
var C = require('hg-base').Controller;
var agencies = require('hg-sdks').data.agencies;
var jobs = require('hg-sdks').data.jobs;

function jobController(app) {
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
    self.jobSdk = new jobs(self.config);
}

jobController.prototype = Object.create(C.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: jobController,
        writable: true
    }
});

jobController.prototype.setup = function() {
    var self = this;
    self.app.get('/agencies/job/released/:agency_id', self.getJobsForAgency.bind(self));
    self.app.get('/agencies/job/applications/:agency_id/:job_id', self.getApplicationsForJob.bind(self));
    self.app.get('/job/:id', self.getJobById.bind(self));
};

jobController.prototype.getJobsForAgency = function(req, res) {
    var self = this;
    var page_no = req.param("page_no");
    var per_page = req.param("per_page");
    var agency_id = req.param('agency_id');
    if (page_no !== undefined && per_page !== undefined) {
        self.agencySdk.getJobsForAgency(agency_id, page_no, per_page)
            .then(function(records) {
                self.okResponse(res, 200, records, null, req);
            })
            .catch(function(e) {
                self.nokResponse(res, 500, e, e, req);
            });
    } else {
        self.nokResponse(res, 500, 'Paginations params not present', null, req);
    }
};

jobController.prototype.getApplicationsForJob = function(req, res) {
    var self = this;
    var page_no = req.param("page_no");
    var per_page = req.param("per_page");
    var agency_id = req.param('agency_id');
    var job_id = req.param('job_id');
    if (page_no !== undefined && per_page !== undefined) {
        self.agencySdk.getApplicationsForJob(agency_id, job_id, page_no, per_page)
            .then(function(records) {
                self.okResponse(res, 200, records, null, req);
            })
            .catch(function(e) {
                self.nokResponse(res, 500, e, e, req);
            });
    } else {
        self.nokResponse(res, 500, 'Paginations params not present', null, req);
    }
};

jobController.prototype.getJobById = function(req, res) {
    var self = this;
    var job_id = req.params.id;
    self.jobSdk.getJobById(job_id, req)
        .then(function(record) {
            self.okResponse(res, 200, record, null, req);
        })
        .catch(function(e) {
            self.nokResponse(res, 500, e, e, req);
        });
};



module.exports = jobController;