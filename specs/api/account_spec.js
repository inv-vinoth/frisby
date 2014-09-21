var frisby = require('frisby');
var Chance = require('chance');
var config = require('../config/configuration');
var endpoints = require('../config/endpoints');

//variables
var chance = new Chance();

// Admin users
var admin_name = chance.first();
var admin_email = chance.email({
    domain: "test.com"
});

// Non Admin users
var name = chance.first();
var email = chance.email({
    domain: "test.com"
});

// Account details
var account_name = chance.string({
    length: 8
})
var description = chance.string({
    length: 20
});
var baseHost = config.xospassport.IP_ADDR + ":" + config.xospassport.PORT + '/';

frisby.globalSetup({
    request: {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
})

describe("/Accounts Endpoint Test Suite", function() {
    
    describe("/Accounts Preconditions", function() {

        it('should create admin user', function() {
            frisby.create('API : Create Admin user')
                .post(baseHost + endpoints.user.users, {
                    email: admin_email,
                    name: admin_name,
                    password: "123",
                    confirmpassword: "123",
                    isAdmin: "true"
                }, {
                    json: true
                })
                .expectHeader('Content-Type', 'application/json')
                .expectStatus(200)
                .toss();
        });

        it('should create non-admin user', function() {
            frisby.create('API : Create Non-Admin user')
                .post(baseHost + endpoints.user.users, {
                    email: email,
                    name: name,
                    password: "123",
                    confirmpassword: "123",
                    isAdmin: "false"
                }, {
                    json: true
                })
                .expectHeader('Content-Type', 'application/json')
                .expectStatus(200)
                .toss();
           })
        })
    
    describe("/Accounts Endpoints", function() {
        
        it('should create Account with admin user', function() {
            frisby.create('API : Create Account with admin user')
                .post(baseHost + endpoints.account.accounts, {
                    "account": {
                        "name": account_name,
                        "description": description
                    },
                    "user": {
                        "email": admin_email,
                    }
                }, {
                    json: true
                })
                .expectHeader('Content-Type', 'application/json')
                .expectStatus(200)
                .expectJSON({
                    "@type": "accountResource",
                    "name": account_name,
                    "description": description,
                    "type": "",
                    "disabled": false
                })
                .expectJSONTypes({
                    "@type": String,
                    "createdAt": String,
                    "createdBy": Number,
                    "updatedAt": String,
                    "updatedBy": Number,
                    "accountid": Number,
                    "name": String,
                    "description": String,
                    "type": String,
                    "disabled": Boolean
                })
                .toss();
        });

        it('should create Account with non-admin user', function() {
            frisby.create('API : Create Account with non-admin user')
                .post(baseHost + endpoints.account.accounts, {
                    "account": {
                        "name": account_name,
                        "description": description
                    },
                    "user": {
                        "email": email,
                    }
                }, {
                    json: true
                })
                .expectHeader('Content-Type', 'application/json')
                .expectStatus(200)
                .expectJSON({
                    "@type": "accountResource",
                    "name": account_name,
                    "description": description,
                    "type": "",
                    "disabled": false
                })
                .expectJSONTypes({
                    "@type": String,
                    "createdAt": String,
                    "createdBy": Number,
                    "updatedAt": String,
                    "updatedBy": Number,
                    "accountid": Number,
                    "name": String,
                    "description": String,
                    "type": String,
                    "disabled": Boolean
                })
                .toss();
        });

        it('should get all accounts', function() {
            frisby.create('API: Authentication')
                .post(baseHost + endpoints.user.signin, {
                    "email": admin_email,
                    "password": "123"
                }, {
                    json: true
                })
                .expectStatus(200)
                .expectHeader('Content-Type', 'application/json')
                .expectJSONTypes({
                    "token": String
                })
                .afterJSON(function(json) {
                    // User Profile
                    frisby.create('GET: All Accounts')
                        .addHeaders({
                            'Authorization': "Bearer " + json.token
                        })
                        .get(baseHost + endpoints.account.accounts)
                        .expectStatus(200)
                        .expectHeader('Content-Type', 'application/json')
                        .expectJSON('?',{
                            "@type": "accountResource",
                            "name": account_name,
                            "description": description,
                            "type": "",
                            "disabled": false
                        })
                        .expectJSONTypes('?',{
                            "@type": String,
                            "createdAt": String,
                            "createdBy": Number,
                            "updatedAt": String,
                            "updatedBy": Number,
                            "accountid": Number,
                            "name": String,
                            "description": String,
                            "type": String,
                            "disabled": Boolean
                        })
                        .toss();
                })
                .toss()
        });
        
        it('should signin in account', function() {
            frisby.create('API : Create Account with admin user')
                .post(baseHost + endpoints.account.accounts, {
                    "account": {
                        "name": account_name,
                        "description": description
                    },
                    "user": {
                        "email": admin_email,
                    }
                }, {
                    json: true
                })
                .expectHeader('Content-Type', 'application/json')
                .expectStatus(200)
                .expectJSON({
                    "@type": "accountResource",
                    "name": account_name,
                    "description": description,
                    "type": "",
                    "disabled": false
                })
                .expectJSONTypes({
                    "@type": String,
                    "createdAt": String,
                    "createdBy": Number,
                    "updatedAt": String,
                    "updatedBy": Number,
                    "accountid": Number,
                    "name": String,
                    "description": String,
                    "type": String,
                    "disabled": Boolean
                })
                .afterJSON(function(json){
                   var account_id = json.accountid;    
                   frisby.create('API: Authentication')
                    .post(baseHost + endpoints.user.signin, {
                        "email": admin_email,
                        "password": "123"
                    }, {
                        json: true
                    })
                    .expectStatus(200)
                    .expectHeader('Content-Type', 'application/json')
                    .expectJSONTypes({
                        "token": String
                    })                                                 
                .afterJSON(function(json){
                    frisby.create('Account signin')
                        .addHeaders({
                            'Authorization': "Bearer " + json.token
                        })
                        .post(baseHost + endpoints.account.accounts + "/" + account_id + "/" + "signin")
                        .expectStatus(200)
                        .expectHeader('Content-Type', 'application/json')
                        .expectJSONTypes({
                            "token": String
                        }) 
                        .toss();
                 })
                 .toss()    
             })
            .toss()
        });
    });
});