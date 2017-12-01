
const Router = require("koa-router");
const knex = require("../../database/db-client");
let log = require("../../logger/logger");

const uuidv4 = require("uuid/v4");

router = new Router();

/**
 * Get all deals.
 */
router.get("/deals", async (ctx, next) => {
    let res = {};
    // parse the query
    if (ctx.query) {
        // sort deals
        if (ctx.query.sort) {
            let sortType = ctx.query.sort;
            switch(sortType) {
                case "recent":
                res = await knex("deals").orderby("updated_at");
                    break;
                
                case "nearby":
                    break;

                case "popular":
                    break;

                default:
                    res = await knex("deals");
            }
        }
        res = await knex("deals").where(ctx.query);
        log.info(res);
    }

    // no query
    else {
        res = await knex("deals");
        log.info(res);
    }

    ctx.body = res;
    ctx.type = "application/json";
    ctx.status = 200;
});

/**
 * Get a single deal.
 */
router.get("/deals/:id", async (ctx, next) => {
    let res = await knex("deals").where({
        id: ctx.params.id
    });
    
    log.info(res);

    // return the element
    if (res.length === 1) {
        ctx.body = res[0];
    }

    // not found, so return empty object
    else {
        ctx.body = {};
    }

    ctx.type = "application/json";
    ctx.status = 200;
});

/**
 * Create a deal.
 */
router.post("/deals", async (ctx, next) => {
    let req = ctx.request.body;
    let res = await knex("deals").insert({
        id: uuidv4(),
        title: req.title,
        description: req.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: req.category,
        place_id: req.place_id,
        num_likes: 0
    });
    log.info(res);
    ctx.body = {};
    ctx.status = 201;
});

module.exports = router;
