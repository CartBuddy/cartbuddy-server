
const Bunyan = require("bunyan");

let log = Bunyan.createLogger({
    name: "cartbuddy-server"
});

module.exports = log;
