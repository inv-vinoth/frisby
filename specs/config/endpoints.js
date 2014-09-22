var endpoints = {}

//Passport endpoints
endpoints.user = {};
endpoints.user.users = "xospassport/api/users"
endpoints.user.signin = "xospassport/api/users/signin"
endpoints.user.profile = "xospassport/api/users/profile"

//Passport Account endpoints
endpoints.account = {};
endpoints.account.accounts = "xospassport/api/accounts"
endpoints.account.invites = "xospassport/api/accounts/invites"

//EmpireManage endpoints

module.exports = endpoints;