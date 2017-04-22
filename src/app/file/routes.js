'use strict';
/*global load*/
var fileModel = load("file/fileModel"),
    C = require('hg-base').Controller;

function fileController(app) {
    //var self = this;
    //self.app = app; 
    /*jshint validthis:true */
    C.call(this);
    var self = this;
    self.init(app);

    self.model = new fileModel(app);
    self.app.set('file_model', self.model);
    self.config = self.app.get('config');
    self.session = app.get('session');

    self.validator = app.get('validator');
}

fileController.prototype = Object.create(C.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: fileController,
        writable: true
    }
});

fileController.prototype.setup = function() {
    var self = this;
    self.app.put('/files', self.updateFile.bind(self));
    self.app.delete('/files/:id', self.deleteFile.bind(self));
    self.app.get('/files/:id', self.getFileDetails.bind(self));
    self.app.get('/files/:id/url', self.getFileUrl.bind(self));
};


fileController.prototype.deleteFile = function(req, res) {
    var self = this;
    var config = self.config;
    var id = req.param('id');

    self.model.deleteFile(id, req)
        .then(function(record) {
            self.okResponse(res, 204, record, null, req);
        })
        .catch(function(e) {
            var statusCode = e.response.statusCode;
            var errMessage = e.response.headers[config.api.messageKey];

            self.nokResponse(res, statusCode, errMessage, errMessage, req);
        });
};

fileController.prototype.updateFile = function(req, res) {
    var self = this;
    var id = req.param('id');

    self.model.updateFile(id, req)
        .then(function(record) {
            self.okResponse(res, 202, record, null, req);
        })
        .catch(function(e) {
            if (e.indexOf("Record not found") > -1) {
                self.nokResponse(res, 404, null, null, req);
            } else {
                self.nokResponse(res, 500, e, e, req);
            }
        });
};

fileController.prototype.getFileDetails = function(req, res) {
    var self = this;
    var id = req.params.id;

    self.model.getFileDetails(req, id)
        .then(function(record) {
            self.okResponse(res, 200, record, null, req);
        })
        .catch(function(e) {
           if (e.indexOf("Record not found") > -1) {
                self.nokResponse(res, 404, null, null, req);
            } else {
                self.nokResponse(res, 500, e, e, req);
            }
        });
};

fileController.prototype.getFileUrl = function(req, res) {
    var self = this;
    var id = req.params.id;

    self.model.getFileUrl(req, id)
        .then(function(record) {
            self.okResponse(res, 200, record, null, req);
        })
        .catch(function(e) {
            if (e.indexOf("Record not found") > -1) {
                self.nokResponse(res, 404, null, null, req);
            } else {
                self.nokResponse(res, 500, e, e, req);
            }
        });
};

module.exports = fileController;