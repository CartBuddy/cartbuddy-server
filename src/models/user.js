
const uuidv4 = require("uuid/v4");

/**
 * Map of JSON field names to SQL column names.
 */
const JSON_TO_SQL = {
    id: "id",
    username: "username",
    email: "email",
    joinedOn: "joined_on"
};

class User {
    constructor(json) {
        // default values
        this.id = uuidv4();
        this.joinedOn = new Date().toISOString();

        for (let prop in json) {
            this[prop] = json[prop];
        }
    }

    toSql() {
        let sqlUser = {};
        for (let prop in JSON_TO_SQL) {
            sqlUser[JSON_TO_SQL[prop]] = this[prop];
        }
        return sqlUser;
    }

    static fromSql(sqlUser) {
        let user = new User();
        for (let prop in JSON_TO_SQL) {
            user[prop] = sqlUser[JSON_TO_SQL[prop]];
        }
        return user;
    }
}

module.exports = User;
