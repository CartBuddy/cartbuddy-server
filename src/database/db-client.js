

const Knex = require("knex");
const fs = require("fs");
const path = require("path");

const DB_CONFIG = require("../../config/database");

class DbClient {

}

let knex = new Knex(DB_CONFIG);

module.exports = knex;
