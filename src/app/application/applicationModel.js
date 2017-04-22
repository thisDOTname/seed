/*
 * @Author: Hemant Rai - hemantrai1988@gmail.com
 * @Date: 2017-03-31 15:18:37
 * @Last Modified by: Hemant Rai - hemantrai1988@gmail.com
 * @Last Modified time: 2017-03-31 15:51:53
 */

/*global load */
/*jshint -W079 */
var M = require('hg-base').Model,
    Promise = require('bluebird'),
    Agencies = require('hg-sdks').data.agencies,
    Chance = require('chance'),
    uuidgen = require('uuid'),
    fs = require('fs'),
    EmailClass = require('hg-base').EmailClass,
    Applications = require('hg-sdks').data.applications,
    COMP = require('hg-sdks').data.companies,
    U = require('hg-sdks').security.users,
    J = require('hg-sdks').data.jobs,
    C = require('hg-sdks').data.candidates,
    Emails = require('hg-sdks').messaging.emails,
    E = require('hg-sdks').workflow.envelopes,
    W = require('hg-sdks').workflow.workflows,
    discovery = require('hg-base').Discovery,
    request = require('request');

function applicationModel(app) {
    M.call(this);
    var self = this;
    self.setup(app);
    self.agenciesSdk = new Agencies(self.config);
    self.applicationsSdk = new Applications(self.config);
    self.companiesSdk = new COMP(self.config);
    self.jobsSdk = new J(self.config);
    self.usersSdk = new U(self.config);
    self.candidatesSdk = new C(self.config);
    self.emailsSdk = new Emails(self.config);
    self.envelopesSdk = new E(self.config);
    self.workflowSdk = new W(self.config);
    self.chance = new Chance();
}

applicationModel.prototype = Object.create(M.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: applicationModel,
        writable: true
    }
});


applicationModel.prototype.checkDuplicateApplication = function(data, req) {
    var self = this;
    var log = self.log;

    var candidatesSdk = self.candidatesSdk;
    var applicationsSdk = self.applicationsSdk;

    var companyId = data.company_id;
    var emailId = data.email;
    var jobId = data.job_id;
    var continueFlag = 0;

    return new Promise(function(fulfill, reject) {
        candidatesSdk.getCandidateByEmailId(emailId, companyId)
            .then(function(candData) {
                var candidateObject = JSON.parse(candData);
                var candidateId = candidateObject.id;
                if (candidateObject.agency_id === undefined || candidateObject === '') {
                    continueFlag = 1;
                } else {
                    if (data.agency_id === candidateObject.agency_id) {
                        continueFlag = 1;
                    }
                }

                if (continueFlag === 1) {
                    //Check if application exists between job and candidate
                    applicationsSdk.checkApplicationExists(jobId, candidateId, req)
                        .then(function(rec) {
                            var chkRec = JSON.parse(rec);
                            fulfill(chkRec);
                        })
                        .catch(function(err) {
                            log.error(err);
                            reject(err);
                        });
                } else {
                    reject('Candidate already exists');
                }
            })
            .catch(function(e) {
                log.error(e);
                reject(e);
            });
    });
};

applicationModel.prototype.updateApplication = function(applicationId, req) {
    var self = this;
    var log = self.log;
    var applicationsSdk = self.applicationsSdk;

    var data = req.body;

    var companyId = data.company_id;

    //Set application status to Applied
    data.status = "Applied";

    delete data.company_id;

    return new Promise(function(fulfill, reject) {
        self.workflowSdk.getApplicationStatuses(req)
            .then(function(statuses) {
                statuses = JSON.parse(statuses);
                var applyStatus = self.lo.find(statuses, {
                    name: 'Applied'
                });
                data.meta_data = applyStatus.meta_data;
                applicationsSdk.updateApplication(applicationId, data, req)
                    .then(function(resp) {
                        var appData = JSON.parse(resp);
                        self.envelopesSdk.getEnvelopeOfApplicationByType(applicationId, 'application', req)
                            .then(function(envelopesData) {
                                envelopesData = JSON.parse(envelopesData);
                                self.envelopesSdk.updateEnvelopeData(envelopesData.id, {
                                        status: 'Complete'
                                    }, req)
                                    .then(function() {
                                        fulfill(appData);
                                    })
                                    .catch(function(e) {
                                        reject(e);
                                    });
                            })
                            .catch(function(e) {
                                reject(e);
                            });
                    })
                    .catch(function(e) {
                        log.error(e);
                        reject(e);
                    });
            })
            .catch(function(e) {
                reject(e);
            });
    });
};

applicationModel.prototype.withdrawApplication = function(applicationId, req) {
    var self = this;
    var log = self.log;
    var session = req.session;
    var applicationsSdk = self.applicationsSdk;
    var agenciesSdk = self.agenciesSdk;
    var jobsSdk = self.jobsSdk;
    var usersSdk = self.usersSdk;
    var emailsSdk = self.emailsSdk;

    var data = req.body;

    var companyId = data.company_id;
    var jobId = data.job_id;
    var additionalComments = data.additional_comments;
    var candidateNumber = data.candidate_number;
    var candidateName = data.candidate_name;

    //Set application status to Applied
    var dataToPut = {};
    dataToPut.status = "Withdrew";
    dataToPut.additional_comments = additionalComments;

    return new Promise(function(fulfill, reject) {
        //Fetch company specific agency profile to send email to recruiter
        session.get('users')
            .then(function(sessionData) {
                var agencyDetails = sessionData.users;

                var agencyId = agencyDetails.agency_id;
                dataToPut.agency_id = agencyId;

                //Fetch company specific agency profile to send email to recruiter
                agenciesSdk.getAgencyProfileById(agencyId, companyId)
                    .then(function(agencyData) {
                        var agencyProfileDetails = (JSON.parse(agencyData))[0];

                        var agencyContactName = agencyProfileDetails.first_name + " " + agencyProfileDetails.last_name;
                        var agencyName = agencyProfileDetails.organisation_name;
                        var agencyEmail = agencyProfileDetails.email;
                        self.workflowSdk.getApplicationStatuses(req)
                            .then(function(statuses) {
                                statuses = JSON.parse(statuses);
                                var applyStatus = self.lo.find(statuses, {
                                    name: 'Withdrew'
                                });
                                dataToPut.meta_data = applyStatus.meta_data;
                                applicationsSdk.updateApplication(applicationId, dataToPut, req)
                                    .then(function(resp) {
                                        //Fetch job details which will be used while sending an email to recruiter
                                        jobsSdk.getJobById(jobId)
                                            .then(function(jobsData) {
                                                var jobsDetails = JSON.parse(jobsData);
                                                var jobNumber = jobsDetails.job_number;
                                                var jobTitle = jobsDetails.title;

                                                var recruiterId = jobsDetails.recruiter;

                                                //Fetch recruiter's email id to send an email to
                                                usersSdk.getUserDetails(recruiterId)
                                                    .then(function(recruiterData) {
                                                        var recruiterDetails = JSON.parse(recruiterData);

                                                        var recruiterEmail = recruiterDetails.email;

                                                        //Send an n otification email to recruiter for withdrawn of an application
                                                        emailsSdk.getEmailTemplate('APPLICANT_WITHDRAWN')
                                                            .then(function(templateDetails) {
                                                                var templateData = JSON.parse(templateDetails);
                                                                var htmlTemplate = '<html><body>' + templateData.template + '</body></html>';

                                                                var objEmail = new EmailClass();

                                                                var configVars = {
                                                                    applicant_name: candidateName,
                                                                    job_title: jobTitle,
                                                                    job_id: jobNumber,
                                                                    candidate_id: candidateNumber,
                                                                    candidate_name: candidateName,
                                                                    withdrawn_comments: additionalComments,
                                                                    agency_contact_name: agencyContactName,
                                                                    agency_name: agencyName
                                                                };

                                                                objEmail.initEmailClass(templateData.template, configVars, templateData.subject, recruiterEmail, agencyEmail, htmlTemplate);
                                                                var template = objEmail.ComposeMailAndSave();
                                                                var dataToWriteInQueue = {
                                                                    "template": template
                                                                };

                                                                self.writeToMessageQueue(self.config.queue.topic_emailTemplates, dataToWriteInQueue);
                                                                fulfill(true);
                                                            })
                                                            .catch(function(e) {
                                                                reject(e);
                                                            });
                                                    })
                                                    .catch(function(e) {
                                                        log.error(e);
                                                        reject(e);
                                                    });
                                            })
                                            .catch(function(error) {
                                                log.error(error);
                                                reject(error);
                                            });
                                    })
                                    .catch(function(e) {
                                        log.error(e);
                                        reject(e);
                                    });
                            })
                            .catch(function(e) {
                                reject(e);
                            });
                    })
                    .catch(function(err) {
                        log.error(err);
                        reject(err);
                    });
            })
            .catch(function(e) {
                log.error(e);
                reject(e);
            });
    });
};

applicationModel.prototype.writeToMessageQueue = function(queueTopic, queueData) {
    var self = this;

    return new Promise(function(fulfill, reject) {
        self.companiesSdk.writeToMessageQueue(queueTopic, queueData)
            .then(function(writeResp) {
                fulfill(writeResp);
            })
            .catch(function(e) {
                reject(e);
            });
    });
};

applicationModel.prototype.createApplication = function(req) {
    var self = this;
    var log = self.log;
    var lo = self.lo;
    var chance = self.chance;

    var candidatesSdk = self.candidatesSdk;

    var agencyId = req.user_id;

    var dataToPost = req.body;

    var firstName = dataToPost.first_name;
    var lastName = dataToPost.last_name;

    //Create random email address if not present
    if (!dataToPost.email) {
        dataToPost.email = firstName + '_' + lastName + '_' + chance.integer({
            min: 1,
            max: 1000
        }) + '@' + 'instantatsagency.com';
    }

    //Add agency id in post data
    dataToPost.agency_id = agencyId;

    var jobId = dataToPost.job_id;
    var companyId = dataToPost.company_id;

    var data = {
        source: dataToPost.source,
        env_type: dataToPost.env_type,
        agency_id: dataToPost.agency_id,
        bblite: dataToPost.bblite
    };

    var candidateObject = {};
    var candidateId = '';

    return new Promise(function(fulfill, reject) {
        //Check if candidate is already present in the system for this company
        var emailId = dataToPost.email;

        candidatesSdk.getCandidateByEmailId(emailId, companyId)
            .then(function(candData) {
                candidateObject = JSON.parse(candData);
                candidateId = candidateObject.id;

                data.candidateId = candidateId;
                var idGen = uuidgen.v4();
                self.addApplication(data, companyId, jobId, idGen, req)
                    .then(function(resp) {
                        //Update the candidate data
                        var updateData = lo.clone(dataToPost, true);
                        updateData.latest_appln_job_id = dataToPost.job_id;
                        updateData.latest_appln_job_title = dataToPost.job_title;
                        delete updateData.status;
                        delete updateData.env_type;
                        delete updateData.job_id;
                        delete updateData.job_title;
                        updateData.bblite = dataToPost.bblite;

                        if (candidateObject.agency_id === undefined || candidateObject === '') {
                            updateData.agency_submitted_date = self.dateformat(new Date(), "yyyy-mm-dd HH:MM:ss");
                        }

                        req.body = updateData;

                        candidatesSdk.updateCandidate(req, candidateId)
                            .then(function() {
                                fulfill(resp);
                            })
                            .catch(function(error) {
                                reject(error);
                            });
                    })
                    .catch(function(e) {
                        reject(e);
                    });
            })
            .catch(function(err) {
                //If candidate is not present then create it and do further processing
                if (err.indexOf("Record Not Found") > -1) {
                    var dataToPut = req.body;
                    var idGen = uuidgen.v4();

                    candidatesSdk.addCandidateForCompany(dataToPut, companyId, req)
                        .then(function(record) {
                            candidateObject = JSON.parse(record);
                            candidateId = candidateObject.id;

                            data.candidateId = candidateId;

                            self.addApplication(data, companyId, jobId, idGen, req)
                                .then(function(resp) {
                                    fulfill(resp);
                                })
                                .catch(function(error) {
                                    reject(error);
                                });
                        })
                        .catch(function(e) {
                            reject(e);
                        });
                } else {
                    log.error(err);
                    return reject(err);
                }
            });
    });
};

applicationModel.prototype.addApplication = function(data, companyId, jobId, idGen, req) {
    var self = this;
    var log = self.log;
    var lodash = self.lo;
    var applicationsSdk = self.applicationsSdk;
    var envelopesSdk = self.envelopesSdk;
    var companiesSdk = self.companiesSdk;
    var envType = data.env_type;
    var idUniq = (idGen) ? idGen : uuidgen.v4();

    var reqApplication = {
        candidate_uuid: data.candidateId,
        status: 'Applied',
        agency_id: data.agency_id,
        source: data.source,
        meta_data: {
            type: 'application',
            active: true,
            key: 'applied'
        },
        bblite: data.bblite
    };

    return new Promise(function(fulfill, reject) {
        self.workflowSdk.getApplicationStatuses(req)
            .then(function(statuses) {
                statuses = JSON.parse(statuses);
                var applyStatus = self.lo.find(statuses, {
                    name: 'Applied'
                });
                reqApplication.meta_data = applyStatus.meta_data;

                //Remove user id from request object, as it is not actual user id, it is being set as agency id
                req.rest.set_headers(self.config.api.userId, undefined);

                applicationsSdk.addApplicationToJob(reqApplication, jobId, req)
                    .then(function(rec) {
                        var applicationObject = JSON.parse(rec);
                        var applicationId = applicationObject.id;

                        var reqEnvelope = lodash.clone(req, true);

                        reqEnvelope.body = {
                            resource_id: applicationId,
                            type: envType,
                            notAddToQueue: true,
                            status: 'Complete'
                        };

                        reqEnvelope.rest = req.rest;

                        // Create Envelope
                        envelopesSdk.createEnvelope(reqEnvelope)
                            .then(function(record) {
                                var envelopeObject = JSON.parse(record);
                                applicationsSdk.generateApplicantPDF(applicationId, null, req)
                                    .then(function() {
                                        //Trigger actonomy record insertion, first check if settings is enabled for actonomy
                                        companiesSdk.getCompanySettings(req)
                                            .then(function(companySetResp) {
                                                var companySettingsResp = JSON.parse(companySetResp);

                                                const actonomySettings = companySettingsResp.ats_settings.actonomySettings || {};
                                                const actonomyEnabled = actonomySettings.enable || false;

                                                if (actonomyEnabled) {
                                                    applicationsSdk.generateActonomyRecord(applicationId, req)
                                                        .then(function(record) {
                                                            fulfill(envelopeObject);
                                                        })
                                                        .catch(function(err) {
                                                            log.error(err);
                                                            return reject(err);
                                                        });
                                                } else {
                                                    log.info("Actonomy is not enabled for given company");
                                                    fulfill(envelopeObject);
                                                }
                                            })
                                            .catch(function(error) {
                                                console.log("Error while fetching company settings: ", error);
                                                return reject(error);
                                            });
                                    })
                                    .catch(function(error) {
                                        log.error(error);
                                        return reject(error);
                                    });
                            })
                            .catch(function(error) {
                                log.error(error);
                                return reject(error);
                            });
                    })
                    .catch(function(err) {
                        log.error(err);
                        return reject(err);
                    });
            })
            .catch(function(error) {
                log.error(error);
                return reject(error);
            });
    });
};

applicationModel.prototype.triggerApplicantPDFCreation = function(applicationId, req) {
    var self = this;
    var log = self.log;
    var applicationsSdk = self.applicationsSdk;

    return new Promise(function(fulfill, reject) {
        applicationsSdk.generateApplicantPDF(applicationId, null, req)
            .then(function(record) {
                var recObject = JSON.parse(record);
                fulfill(recObject);
            })
            .catch(function(err) {
                log.error(err);
                return reject(err);
            });
    });
};

applicationModel.prototype.uploadFile = function(companyId, files, file_type) {
    var self = this;
    var log = self.log;
    var config = self.config;
    var fileData = {};
    self.lo.each(files, function(item, key) {
        fileData[key] = fs.createReadStream(item.path);
    });

    return new Promise(function(fulfill, reject) {
        discovery.findService('hg-storage').then(function(opts) {
            var url = 'http://' + opts.host + ':' + opts.port + '/files/new';
            var fileProcessOptions = {};
            fileData = fileData || {};
            if ('CV' === file_type) {
                fileProcessOptions.doc_preview = true;
                fileProcessOptions.text_extract = true;
            } else if ('Cover Letter' === file_type) {
                fileProcessOptions.doc_preview = true;
            }

            var headers = {};
            headers[config.api.keyName] = config.api.key;
            headers[config.api.companyId] = companyId;
            headers[config.api.pluginTaskPreviewHeader] = JSON.stringify(fileProcessOptions);
            headers[config.api.fileResourceTypeHeader] = config.api.fileResourceTypeHeaderValue;
            headers[config.api.fileResourceEntityHeader] = config.api.fileResourceEntityHeaderValue;
            headers[config.api.fileResourceEntityIdHeader] = '';
            request.post({
                url: url,
                formData: fileData,
                headers: headers
            }, function(err, httpResponse, body) {
                if (err) {
                    console.trace('err', err);
                    fulfill('could not upload file');
                }
                if (httpResponse.statusCode !== 200) {
                    console.trace('could not upload file \n', httpResponse.statusCode);
                    fulfill('could not upload file');
                }
                var resp = JSON.parse(body);
                fulfill(resp);
            });
        }, function(err) {
            console.trace('Error--\n', err);
            reject('could not upload file');
        });
    });
};

applicationModel.prototype.getApplication = function(applicationId, companyId, req) {
    var self = this;
    var log = self.log;
    var applicationsSdk = self.applicationsSdk;

    return new Promise(function(fulfill, reject) {
        applicationsSdk.getApplication(applicationId, companyId, null, req)
            .then(function(record) {
                var recObject = JSON.parse(record);
                fulfill(recObject);
            })
            .catch(function(err) {
                log.error(err);
                return reject(err);
            });
    });
};


module.exports = applicationModel;