
const deals = require("./deals/deals");
const images = require("./images/images");
const users = require("./users/users");

let routers = [
    deals,
    images,
    users
];

module.exports = routers;
