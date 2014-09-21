var frisby = require('frisby');
var Chance = require('chance');
var config = require('../config/configuration');
var endpoints = require('../config/endpoints');

//variables
var chance = new Chance();
var name = chance.first();
var email = chance.email({
    domain: "test.com"
})
var baseHost = config.xospassport.IP_ADDR + ":" + config.xospassport.PORT + '/';

frisby.globalSetup({
    request: {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'          
        }
    }
})

// User Specs
describe("/Users Endpoint Test Suite", function() {
    it("should create user, authenticate, get profile", function(){
    frisby.create('API : Create User')
        .post(baseHost + endpoints.user.users, {
            email: email,
            name: name,
            password: "123",
            confirmpassword: "123",
            isAdmin: "true"
        }, {
            json: true
        })
        .expectHeader('Content-Type', 'application/json')
        .expectStatus(200)
        .expectJSON({
            "@type": "userResource",
            "email": email,
            "name": name,
        })
        .expectJSONTypes({
            "@type": String,
            "createdAt": String,
            "createdBy": Number,
            "updatedAt": String,
            "updatedBy": Number,
            "email": String,
            "name": String,
            "password": String,
            "confirmpassword": String,
            "id": Number,
            "accountid": Number,
            "resetpw": Boolean,
            "memberships": Array
        })
        .afterJSON(function(json) {
            // Authentication Spec
            frisby.create('API: Authentication')
                .post(baseHost + endpoints.user.signin, {
                    "email": json.email,
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
                    frisby.create('API: User Profile')
                        .addHeaders({'Authorization': "Bearer " + json.token })
                        .get(baseHost + endpoints.user.profile)
                        .expectStatus(200)
                        .expectHeader('Content-Type', 'application/json')
                        .expectJSON({
                            "accountType": "",
                            "email": email,
                            "name": name,
                        })
                        .expectJSONTypes({
                            "accountType": String,
                            "email": String,
                            "name": String,
                            "accountid": Number,
                            "userid": Number,
                            "isAdmin": Boolean,
                        })
                        .toss();
                })
                .toss()
        })
        .toss();
    });    
});