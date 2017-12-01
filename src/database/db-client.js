

const Knex = require("knex");
const fs = require("fs");
const path = require("path");

const DB_CONFIG = require("../../config/database");

class DbClient {

    constructor() {
        this.client = new Client(DB_CONFIG);
    }

    async connect() {
        let res = await this.client.connect();
        console.log(res);
    }

    async createTables() {
        const dropTablesQuery = fs.readFileSync(path.join(__dirname, "../../queries/drop-tables.sql")).toString();
        const createTablesQuery = fs.readFileSync(path.join(__dirname, "../../queries/create-tables.sql")).toString();
        let res;
        try {
            res = await this.client.query(dropTablesQuery + createTablesQuery);
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
        console.log(res);
    }

    async dropTables() {
        const dropTablesQuery = fs.readFileSync(path.join(__dirname, "../../queries/drop-tables.sql")).toString();
        let res = await this.client.query(dropTablesQuery);
        console.log(res);
    }
}

let knex = new Knex(DB_CONFIG);

module.exports = knex;

