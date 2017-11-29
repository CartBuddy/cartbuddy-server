

const { Pool, Client } = require("pg");

class DbClient {

    constructor() {
        this.client = new Client({
            user: "bennycooly",
            host: "localhost",
            database: "cartstopper",
            password: "",
            port: 5432,
        });
    }

    connect() {
          this.client.connect();
    }

    async createTable() {
        const createTableText =
        `
        DROP TABLE deals;

        CREATE TABLE IF NOT EXISTS deals (
            date_col DATE,
            timestamp_col TIMESTAMP,
            timestamptz_col TIMESTAMPTZ
          );
        `

        let res = await this.client.query(createTableText);
        console.log(res);
    }
}

module.exports = DbClient;

