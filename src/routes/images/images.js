
const Router = require("koa-router");
const body = require("koa-body");
const knex = require("../../database/db-client");
let log = require("../../logger/logger");
let { minioClient, BUCKET_NAME } = require("../../object-store/minio");
const uuidv4 = require("uuid/v4");

router = new Router();

/**
 * Get all deals.
 */
router.get("/images", async (ctx, next) => {
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
 * Upload an image.
 */
router.post("/images",
    body({
        multipart: true
    }),
    async (ctx, next) => {
        let req = ctx.request.body;

        log.info(req.fields);
        log.info(req.files);
        log.info(req);
        
        // handle upload
        let uploads = [];
        let urls = [];
        for (let key in req.files) {
            log.info(key);
            uploads.push(minioClient.fPutObject(BUCKET_NAME, req.files[key].name, req.files[key].path, req.files[key].type));
            urls.push(`${minioClient.protocol}//${minioClient.host}:${minioClient.port}/${BUCKET_NAME}/${req.files[key].name}`);
        }
        Promise.all(uploads);

        // associate deal with image
        log.info(urls);
        let dealId = req.fields["deal-id"];
        knex("deals")
            .where({
                id: dealId
            })
            .update({
                photo_urls: urls
            })
            .then((res) => {
                log.info("Added images to deal.");
                log.info(res);
            });
        
        ctx.body = urls;
        ctx.status = 201;
    });

module.exports = router;
