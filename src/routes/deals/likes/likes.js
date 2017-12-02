
const Router = require("koa-router");
const body = require("koa-body");
const uuidv4 = require("uuid/v4");

const knex = require("../../../database/db-client");
let log = require("../../../logger/logger");
const Deal = require("../../../models/deal");

router = new Router();

/**
 * Increment or decrement the number of likes.
 */
router.patch("/deals/:id/likes", body(), async (ctx, next) => {
    // get the current number of likes
    let res = await knex("deals").where({
        id: ctx.params.id
    });
    let numLikes = res[0].num_likes;
    let mode = ctx.request.body.mode;
    if (mode === "++") {
        ++numLikes;
    }
    else if (mode == "--") {
        --numLikes;
    }

    await knex("deals")
        .where({
            id: ctx.params.id
        })
        .update({
            num_likes: numLikes
        });

    // return new number of likes
    ctx.body = numLikes;
    ctx.status = 200;
});

module.exports = router;
