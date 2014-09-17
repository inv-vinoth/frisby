module.exports = function(){
    
    var xospassport_server = "http://localhost";
    var xospassport_port = "8080";
    
    var users = "xospassport/api/users";
    var user_signin = "xospassport/api/users/signin";
    
    return {
        xospassport_server: xospassport_server,
        xospassport_port: xospassport_port,
        users: users
    }
}();