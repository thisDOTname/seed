/*global load */
/*jshint -W079 */
var M = require('hg-base').Model,
    Promise = require('bluebird'),
    Emails = require('hg-sdks').messaging.emails,
    EmailClass = require('hg-base').EmailClass,
    A = require('hg-sdks').data.agencies,
    B = require('hg-sdks').security.agencies,
    fs = require('fs'),
    request = require('request'),
    discovery = require('hg-base').Discovery;


function userModel(app) {
    M.call(this);
    var self = this;
    self.setup(app);
    self.emailModel = new Emails(self.config);
    self.agenciesSdk = new A(self.config);
    self.agenciesSdkSecu = new B(self.config);
}

userModel.prototype = Object.create(M.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: userModel,
        writable: true
    }
});

userModel.prototype.getUserProfile = function(agencyId, req) {
    var self = this;
    var log = self.log;
    var config = self.config;
    var file_model = self.app.get('file_model');
    var agenciesSdk = self.agenciesSdk;
    //Fetch user's details first
    return new Promise(function(fulfill, reject) {
        agenciesSdk.getAgencyProfileById(agencyId)
            .then(function(agencyRec) {
                var agencyData = JSON.parse(agencyRec);

                self.agenciesSdkSecu.getAgencyUser(agencyId)
                    .then(function(userData) {
                        userData = JSON.parse(userData);

                        //Fetch user's profile image and send it along with other data
                        if (!self.lo.isEmpty(userData.profile_url)) {
                            if (userData.profile_url[0].url) {
                                agencyData[0].profile_url = userData.profile_url[0].url;
                                fulfill(agencyData[0]);
                            } else if (userData.profile_url[0].id) {
                                var fileId = userData.profile_url[0].id;
                                file_model.getFileUrl(agencyId, fileId)
                                    .then(function(fileData) {
                                        fileData = fileData ? JSON.parse(fileData) : [];
                                        agencyData[0].profile_url = fileData.downloadable_url;

                                        fulfill(agencyData[0]);
                                    })
                                    .catch(function(err) {
                                        console.log("Error while fetching profile image url: ", err);
                                        reject(err);
                                    });
                            } else {
                                agencyData[0].profile_url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACJElEQVR42u3d0U3EMBBFUfffQYrggz5SAD/UkhUVgMTanvE7I6UAuCdmxSb2GAfOdV3PjGuYnNhQCA6E6DAID4LwIIgOg/gQCA+C8CCID4HwIIgPgfgQCA+C+BCID4H48QiECUYgSDACIYIRCBCMoMMv5r7vf18QNAPwjugdMcTHnxm+C4TI+CvDd4AQE39n+OoQjgdQKX5FBOJD8IgPwXMUgA7xqyFw90PwuPsBEB8CSz8AAEBg+QfA3e//AgBYBcS3CgAAgK97fV0MAAAAAOBRL4+OAQAAAAAAEAog/Tn/+PcIAAAAAAAgAACAPACnv94NwC8IAAAAgND4AAAAAAAAAAABAAAAAEBafAAAAACAkB0/AQAAAADEBwCAfgBsEgUAAACIHw2gEwIAAADAXsEARCIAAIB+J44BEBy/4/l/AAAgfjKAighaA7AKhMe3CgDQ9iBo8QEA4NS9AgEI3ikUAAAASN8xHIDg8wIAcGoIADviAwAAACc+/dv14EgAAABgB4AuCACYFL8LAgAmxreV7AE7gb5jxD/kWJhTAHgodDGACgi8Hbwx/i4EdgsvFH8FgJOOidkJYswcwWuDGCtG8JogxsoRvBaIsXpEr4Vh7BjBa4AYO0eEvdeoMEIEx4dAfAjEh0B8CMSHQHwQhIdAfAjEB0F4CMQHQXgQhP/LfH5/faSE//lZFQ+EoG7onwYlQyEoF4hBoTAQCgR9iDzx0/sL0bDV2h2VuWoAAAAASUVORK5CYII=';
                                fulfill(agencyData[0]);
                            }

                        } else {
                            agencyData[0].profile_url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACJElEQVR42u3d0U3EMBBFUfffQYrggz5SAD/UkhUVgMTanvE7I6UAuCdmxSb2GAfOdV3PjGuYnNhQCA6E6DAID4LwIIgOg/gQCA+C8CCID4HwIIgPgfgQCA+C+BCID4H48QiECUYgSDACIYIRCBCMoMMv5r7vf18QNAPwjugdMcTHnxm+C4TI+CvDd4AQE39n+OoQjgdQKX5FBOJD8IgPwXMUgA7xqyFw90PwuPsBEB8CSz8AAEBg+QfA3e//AgBYBcS3CgAAgK97fV0MAAAAAOBRL4+OAQAAAAAAEAog/Tn/+PcIAAAAAAAgAACAPACnv94NwC8IAAAAgND4AAAAAAAAAAABAAAAAEBafAAAAACAkB0/AQAAAADEBwCAfgBsEgUAAACIHw2gEwIAAADAXsEARCIAAIB+J44BEBy/4/l/AAAgfjKAighaA7AKhMe3CgDQ9iBo8QEA4NS9AgEI3ikUAAAASN8xHIDg8wIAcGoIADviAwAAACc+/dv14EgAAABgB4AuCACYFL8LAgAmxreV7AE7gb5jxD/kWJhTAHgodDGACgi8Hbwx/i4EdgsvFH8FgJOOidkJYswcwWuDGCtG8JogxsoRvBaIsXpEr4Vh7BjBa4AYO0eEvdeoMEIEx4dAfAjEh0B8CMSHQHwQhIdAfAjEB0F4CMQHQXgQhP/LfH5/faSE//lZFQ+EoG7onwYlQyEoF4hBoTAQCgR9iDzx0/sL0bDV2h2VuWoAAAAASUVORK5CYII=';
                            fulfill(agencyData[0]);
                        }
                    })
                    .catch(function(e) {
                        reject(e);
                    });

            })
            .catch(function(e) {
                log.error(e.response.headers[config.api.messageKey]);
                return reject(e);
            });
    });
};

userModel.prototype.forgotpasswordValidate = function(emailId, domainName) {
    var self = this;
    var agenciesSdkSecu = self.agenciesSdkSecu;
    var log = self.log;
    var config = self.config;

    return new Promise(function(fulfill, reject) {
        agenciesSdkSecu.forgotPasswordValidate(emailId)
            .then(function(agencyRec) {
                var agencyData = JSON.parse(agencyRec);

                delete agencyData['@type'];
                delete agencyData['@class'];
                delete agencyData['@rid'];
                delete agencyData['@version'];

                agencyData.domain_name = domainName;

                self.sendMail('FORGOT_PASSWORD', agencyData, function(response) {
                    if (response === 'Done') {
                        fulfill(true);
                    } else {
                        reject(false);
                    }
                });
            })
            .catch(function(e) {
                log.error(e.response.headers[config.api.messageKey]);
                return reject(e);
            });
    });
};

userModel.prototype.sendMail = function(action, data, callback) {
    var self = this;
    var applicationModel = self.app.get('application_model');
    var domainName = data.domain_name;

    self.emailModel.getEmailTemplate(action)
        .then(function(templateData) {
            templateData = JSON.parse(templateData);
            var htmlTemplate = '<html><body>' + templateData.template + '</body></html>';
            var objEmail = new EmailClass();
            var configVars = {
                user: "Agency user",
                signature: 'Admin',
                email: data.email,
                link: 'https://' + domainName + '/#!/reset-password/' + data.uniqueId
            };

            objEmail.initEmailClass(templateData.template, configVars, templateData.subject, data.email, '', htmlTemplate);
            var template = objEmail.ComposeMailAndSave();

            var queueData = {
                "template": template
            };

            applicationModel.writeToMessageQueue(self.config.queue.topic_emailTemplates, queueData);

            callback("Done");
        })
        .catch(function(e) {
            callback("Mail Not Sent", e);
        });
};

userModel.prototype.checkresetPasswordLink = function(link) {
    var self = this;
    var agenciesSdkSecu = self.agenciesSdkSecu;
    var log = self.log;
    var config = self.config;

    return new Promise(function(fulfill, reject) {
        agenciesSdkSecu.validateResetPasswordLink(link)
            .then(function(agencyRec) {
                var agencyData = JSON.parse(agencyRec);

                delete agencyData['@type'];
                delete agencyData['@class'];
                delete agencyData['@rid'];
                delete agencyData['@version'];

                fulfill(agencyData);
            })
            .catch(function(e) {
                log.error(e.response.headers[config.api.messageKey]);
                return reject(e);
            });
    });
};

userModel.prototype.updatePassword = function(data) {
    var self = this;
    var agenciesSdkSecu = self.agenciesSdkSecu;
    var log = self.log;
    var config = self.config;

    var agencyId = data.agency_id;

    var sendData = {
        password: data.password,
        email: data.email,
        linkFlag: data.linkFlag
    };

    return new Promise(function(fulfill, reject) {
        agenciesSdkSecu.updateAgencyUser(agencyId, sendData)
            .then(function(agencyRec) {
                var agencyData = JSON.parse(agencyRec);

                fulfill(agencyData);
            })
            .catch(function(e) {
                log.error(e.response.headers[config.api.messageKey]);
                return reject(e);
            });
    });
};

userModel.prototype.signupAgency = function(req) {
    var self = this;
    var log = self.log;
    var config = self.app.get('config');

    var dataToPost = req.body;

    var companyId = dataToPost.company_id;

    //Delete unnecessary property company_id
    delete dataToPost.company_id;

    return new Promise(function(fulfill, reject) {
        self.agenciesSdk.signUpAgency(companyId, dataToPost, req)
            .then(function(agencyRec) {
                var agencyData = JSON.parse(agencyRec);
                fulfill(agencyData);
            })
            .catch(function(e) {
                log.error(e.response.headers[config.api.messageKey]);
                return reject(e);
            });
    });
};

userModel.prototype.getUserByEmail = function(email, companyId, req) {
    var self = this;
    var log = self.log;
    var lodash = self.lo;
    var config = self.app.get('config');

    return new Promise(function(fulfill, reject) {
        self.agenciesSdk.checkAgencyExistsForCompany(email, companyId, req)
            .then(function(rec) {
                var userData = JSON.parse(rec);

                if (lodash.isEmpty(userData)) {
                    fulfill(null);
                } else {
                    fulfill(userData);
                }
            })
            .catch(function(e) {
                log.error(e.response.headers[config.api.messageKey]);
                reject(e);
            });
    });
};

userModel.prototype.uploadAgencyFile = function(agencyId, companyId, files) {
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
            fileProcessOptions.doc_preview = true;

            var headers = {};
            headers[config.api.keyName] = config.api.key;
            headers[config.api.companyId] = companyId;
            headers[config.api.fileResourceTypeHeader] = 'agency';
            headers[config.api.fileResourceEntityHeader] = 'agency';
            headers[config.api.fileResourceEntityIdHeader] = agencyId;
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


userModel.prototype.getAgencyFile = function(fileId) {
    var self = this;
    var log = self.log;
    var config = self.config;



    return new Promise(function(fulfill, reject) {
        discovery.findService('hg-storage').then(function(opts) {
            var url = 'http://' + opts.host + ':' + opts.port + '/files/' + fileId;

            var headers = {};
            headers[config.api.keyName] = config.api.key;

            request.get({
                url: url,
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

module.exports = userModel;