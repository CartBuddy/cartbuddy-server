
const Router = require("koa-router");
const body = require("koa-body");
const uuidv4 = require("uuid/v4");

const knex = require("../../database/db-client");
let log = require("../../logger/logger");
const User = require("../../models/user");

router = new Router();

/**
 * Get all users.
 */
router.get("/users", async (ctx, next) => {
    let res = {};
    res = await knex("users");
    log.info(res);

    let users = res.map((sqlUser) => {
        return User.fromSql(sqlUser);
    });

    ctx.body = users;
    ctx.type = "application/json";
    ctx.status = 200;
});

/**
 * Get a single user.
 */
router.get("/users/:id", async (ctx, next) => {
    let res = await knex("users").where({
        id: ctx.params.id
    });
    
    log.info(res);

    // return the element
    if (res.length === 1) {
        let user = User.fromSql(res[0]);
        ctx.body = user;
    }

    // not found, so return empty object
    else {
        ctx.body = {};
    }

    ctx.type = "application/json";
    ctx.status = 200;
});

/**
 * Create a user.
 */
router.post("/users", body(), async (ctx, next) => {
    let req = ctx.request.body;
    let user = new User(req);
    let res = await knex("users")
        .insert(user.toSql())
        .returning("id");

    log.info(res);
    // res should be an array with one id
    let id = res[0];
    ctx.body = `${ctx.origin}/users/${id}`;
    ctx.status = 201;
});

module.exports = router;
