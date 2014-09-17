var frisby = require('frisby');
var Chance = require('chance');
var config = require('../config/configuration');
var endpoints = require('../config/endpoints');

//variables
var chance = new Chance();
var name = chance.first();
var email = chance.email({domain: "test.com"})

console.log(process.env.XS_IP_ADDR);

// User Specs
frisby.create('API : Create User')
    .post(config.xospassport.IP_ADDR + ":" + config.xospassport.PORT + "/" + endpoints.user.users, {
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
        expect(json.createdAt).toBeDefined();
        expect(json.createdBy).toBeDefined();
        expect(json.updatedAt).toBeDefined();
        expect(json.updatedBy).toBeDefined();
        expect(json.email).toBeDefined();
        expect(json.password).toBeDefined();
        expect(json.confirmpassword).toBeDefined();
        expect(json.id).toBeDefined();
        expect(json.accountid).toBeDefined();
        expect(json.resetpw).toBeDefined();
        expect(json.memberships).toBeDefined();
        
        frisby.create('API: Authentication')
            .post(config.xospassport.IP_ADDR + ":" + config.xospassport.PORT + "/" + endpoints.user.signin, {
                "email": json.email, 
                "password": json.password
            },
            { json: true },
            { headers: { 'Content-Type': 'application/json' }}
        )
        .expectStatus(200)
          .expectHeader('Content-Type', 'application/json')
          .expectJSONTypes({
            "token": String
          })
    })
.toss();