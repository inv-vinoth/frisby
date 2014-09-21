var frisby = require('frisby');
var Chance = require('chance');
var config = require('../config/configuration');
var endpoints = require('../config/endpoints');

//variables
var chance = new Chance();
var name = chance.first();
var description = chance.string({
    length: 20
});
var email = chance.email({
    domain: "test.com"
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
    
    frisby.create('API : Create Account')
        .post(baseHost + endpoints.account.accounts, {
            "account": {
                "name": name,
                "description": description
            },
            "user": {
                "email": email,
            }
        }, {
            json: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expectHeader('Content-Type', 'application/json')
        .expectStatus(200)
        .expectJSON({
            "@type": "accountResource",
            "name": name,
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
        .afterJSON(function(json) {
            expect(json['@type']).toBeDefined();
            expect(json.createdAt).toBeDefined();
            expect(json.createdBy).toBeDefined();
            expect(json.updatedAt).toBeDefined();
            expect(json.updatedBy).toBeDefined();
            expect(json.accountid).toBeDefined();
            expect(json.name).toBeDefined();
            expect(json.description).toBeDefined();
            expect(json.type).toBeDefined();
            expect(json.disabled).toBeDefined();
        })
        .toss();
});