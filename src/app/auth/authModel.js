/*global load */
/*jshint -W079 */
var M = require('hg-base').Model;
var Promise = require('bluebird');
var agencies = require('hg-sdks').data.agencies;
var agenciesSec = require('hg-sdks').security.agencies;


function authModel(app) {
    M.call(this);
    var self = this;
    self.setup(app);
    self.agenciesSdk = new agencies(self.config);
    self.agenciesSecSdk = new agenciesSec(self.config);
}

authModel.prototype = Object.create(M.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: authModel,
        writable: true
    }
});

authModel.prototype.doLogin = function(req) {
    var self = this;
    var log = self.log;
    var session = req.session;
    var config = self.app.get('config');
    var user_model = self.app.get('user_model');
    var dataToPost = req.body;

    return new Promise(function(fulfill, reject) {
        self.agenciesSecSdk.validateAgencyUser(dataToPost)
            .then(function(record) {
                var agencyRecord = JSON.parse(record);

                //Get agency user profile and save it in session
                user_model.getUserProfile(agencyRecord.agency_id)
                    .then(function(rec) {
                        console.log("agency record: ", rec);

                        var finalRetData = {};
                        rec.user_id = rec.agency_id;                        

                        var recordData = {
                            agency_id: rec.agency_id,
                            user_id: rec.agency_id,
                            organisation_name: rec.organisation_name,
                            first_name: rec.first_name,
                            last_name: rec.last_name,
                            mobile: rec.mobile,
                            telephone: rec.telephone,
                            created_date_time: rec.created_date_time,
                            email: rec.email,
                            agency_website: rec.agency_website,
                            registered_no: rec.registered_no,
                            margin_rates: rec.margin_rates,
                            agency_no: rec.agency_no,
                            profile_url : rec.profile_url,
                            loginTimeStamp: agencyRecord.loginTimeStamp,
                            logoutTimeStamp: agencyRecord.logoutTimeStamp,
                            lastLoginTimeStamp: agencyRecord.lastLoginTimeStamp                           
                        };

                        finalRetData.records = recordData;
                        finalRetData.token = session.id;

                        //Write token in the session
                        var sessionData = {
                            users: recordData
                        };

                        session.set('users', sessionData);

                        fulfill(finalRetData);
                    })
                    .catch(function(e) {
                        //log.error(e);
                        return reject(e);
                    });                
            })
            .catch(function(e) {
                return reject(e);
            });        
    });
};

authModel.prototype.logout = function(req){
    var self = this;
    var log = self.log;
    var session = req.session;

    return new Promise(function(fulfill, reject) {
        session.get('users')
        .then(function(sessionData) {
            var data = {meta_data : {logoutTimeStamp : '', loginTimeStamp : sessionData.users.loginTimeStamp, lastLoginTimeStamp : sessionData.users.loginTimeStamp } };

            self.agenciesSecSdk.updateAgencyUser(req.user_id, data)
            .then(function() {
                session.destroy()
                .then(function(){
                    fulfill("deleted");
                })
                .catch(function(e){
                    log.error(e);
                    return reject(e);
                });
            })
            .catch(function(e) {
                reject(e);
            });            
        })
        .catch(function(e){
            reject(e);
        });
    });
};


module.exports = authModel;