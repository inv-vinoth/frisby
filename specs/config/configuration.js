var config = {}

//Passport configuration
config.xospassport = {};
config.xospassport.IP_ADDR = process.env.XS_IP_ADDR || "localhost";
config.xospassport.PORT = process.env.XS_WEB_PORT || 8080;

//EmpireManage configuration
config.empiremanage = {};
config.empiremanage.IP_ADDR = process.env.EM_IP_ADDR || "localhost"; 
config.empiremanage.PORT = process.env.EM_WEB_PORT || 8080; 

module.exports = config;