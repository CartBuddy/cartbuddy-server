
const uuidv4 = require("uuid/v4");

/**
 * Map of JSON field names to SQL column names.
 */
const JSON_TO_SQL = {
    id: "id",
    userId: "user_id",
    photoUrls: "photo_urls",
    title: "title",
    description: "description",
    createdAt: "created_at",
    updatedAt: "updated_at",
    category: "category",
    foodId: "food_id",
    placeId: "place_id",
    numLikes: "num_likes",
    location: "location",
    comments: "comments"
};

class Deal {
    constructor(json) {
        // default values
        this.id = uuidv4();
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        this.numLikes = 0;

        for (let prop in json) {
            this[prop] = json[prop];
        }
    }

    toSql() {
        let sqlDeal = {};
        for (let prop in JSON_TO_SQL) {
            sqlDeal[JSON_TO_SQL[prop]] = this[prop];
        }
        return sqlDeal;
    }

    static fromSql(sqlDeal) {
        let deal = new Deal();
        for (let prop in JSON_TO_SQL) {
            deal[prop] = sqlDeal[JSON_TO_SQL[prop]];
        }
        return deal;
    }
}

module.exports = Deal;
