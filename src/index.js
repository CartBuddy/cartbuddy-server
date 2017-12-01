
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const uuidv1 = require("uuid/v1");

const routers = require("./routes/routes");
const knex = require("./database/db-client");
let logger = require("./logger/logger");
const minioClient = require("./object-store/minio");


async function main() {
    const app = new Koa();

    /**
     * Configure the logger.
     */
    app.use(async (ctx, next) => {
        // request
        let log = logger.child({ request_id: uuidv1() });
        log.debug({ req: ctx.req });
        const startTime = Date.now();

        await next();

        // response
        const elapsedTime = Date.now() - startTime;
        log.info(`${ctx.ip} ${ctx.host} [${new Date().toISOString()}] "${ctx.method} ${ctx.url} ${ctx.protocol}" ${ctx.status} ${ctx.length ? ctx.length : ""} - ${elapsedTime}ms`);
        log.debug({ res: ctx.res });
    });

    /**
     * Body Parser
     */
    app.use(bodyParser());

    /**
     * Add app routes.
     */
    routers.forEach((router) => {
        app.use(router.routes());
        app.use(router.allowedMethods());
    });
    
    /**
     * Create the database tables.
     */
    let res = await knex.schema
        .dropTableIfExists("deals")
        .dropTableIfExists("users")
        .createTableIfNotExists("deals", (table) => {
            table.uuid("id").primary();
            table.uuid("user_id");
            table.string("photo_url");
            table.string("title");
            table.text("description");
            // created_at and updated_at fields
            // equivalent to:
            //  table.timestamp("created_at");
            //  table.timestamp("updated_at");
            table.timestamps();
            table.string("category");
            table.string("food_id");
            table.string("place_id");
            table.integer("num_likes");
            table.specificType("location", "point");
            table.specificType("comments", "text[]");
        })
        .createTableIfNotExists("users", (table) => {
            table.uuid("id").primary();
            table.string("username");
            table.string("email");
            table.timestamp("joined_on");
        });

    console.log(res);

    /**
     * Create the minio file server.
     */
    try {
        await minioClient.makeBucket("cartbuddy", "");
        console.log("Successfully made bucket.");
    }

    catch (err) {
        console.error("Error creating bucket: " + err);
    }


    console.log("Listening on port 3000");
    app.listen(3000);
    
}


main();
