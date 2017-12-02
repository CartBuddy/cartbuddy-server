
const deals = require("./deals/deals");
const likes = require("./deals/likes/likes");
const images = require("./images/images");
const users = require("./users/users");


let routers = [
    deals,
    likes,
    images,
    users
];

module.exports = routers;
