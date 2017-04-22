/*global load */
/*jshint -W079 */
var M = require('hg-base').Model,
    Promise = require('bluebird'),
    S = require('hg-sdks').storage.files;

function fileModel(app) {
    M.call(this);
    var self = this;
    self.setup(app);
    self.storageSdk = new S(self.config);
}

fileModel.prototype = Object.create(M.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: fileModel,
        writable: true
    }
});


fileModel.prototype.deleteFile = function(fileId, req) {
    var self = this;
    return new Promise(function(fulfill, reject) {
        self.storageSdk.deleteFile(fileId, req.company_id)
            .then(function(record) {
                fulfill(record.body);
            })
            .catch(function(e) {
                return reject(e);
            });
    });
};

fileModel.prototype.updateFile = function(fileId, req) {
    var self = this;
    return new Promise(function(fulfill, reject) {
        self.storageSdk.updateFileFields(fileId, req.company_id, req.body)
            .then(function(record) {
                fulfill(record.body);
            })
            .catch(function(e) {
                return reject(e);
            });
    });
};

fileModel.prototype.getFileDetails = function(req, fileId) {
    var self = this;

    return new Promise(function(fulfill, reject) {
        self.storageSdk.getFileDetails(fileId, req.company_id, req)
            .then(function(record) {
                var fileObj = JSON.parse(record);
                fileObj.html = (fileObj.html !== undefined) ? new Buffer(fileObj.html, 'base64').toString() : fileObj.html;
                fulfill(fileObj);
            })
            .catch(function(e) {
                return reject(e);
            });
    });
};

fileModel.prototype.getFileUrl = function(req, fileId) {
    var self = this;
    var expiry_in_seconds = 48 * 60 * 60;

    return new Promise(function(fulfill, reject) {
        self.storageSdk.getDownloadUrl(fileId, req.company_id, expiry_in_seconds, req)
            .then(function(record) {
                fulfill(record);
            })
            .catch(function(e) {
                return reject(e);
            });
    });
};


module.exports = fileModel;