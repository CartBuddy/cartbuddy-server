
const Koa = require("koa");
const uuidv1 = require("uuid/v1");
const Minio = require("minio");
const cors = require("@koa/cors");

const routers = require("./routes/routes");
let knex = require("./database/db-client");
let log = require("./logger/logger");
let { minioClient, BUCKET_NAME } = require("./object-store/minio");


async function main() {
    const app = new Koa();
    app.proxy = true;
    /**
     * Configure the logger.
     */
    app.use(async (ctx, next) => {
        // request
        let logc = log.child({ request_id: uuidv1() });
        logc.debug({ req: ctx.req });
        const startTime = Date.now();

        await next();

        // response
        const elapsedTime = Date.now() - startTime;
        logc.info(`${ctx.ip} ${ctx.host} [${new Date().toISOString()}] "${ctx.method} ${ctx.url} ${ctx.protocol}" ${ctx.status} ${ctx.length ? ctx.length : ""} - ${elapsedTime}ms`);
        logc.debug({ res: ctx.res });
    });

    /**
     * CORS
     */
    app.use(cors());

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
    let existTables = await knex.schema
        .hasTable("deals")
        .hasTable("users");
    let existsAll = existTables.reduce((accumulator, currentValue) => {
        return accumulator && currentValue;
    });

    // create tables if not all exist
    if (!existsAll) {
        log.info("Creating database tables.");
        let res = await knex.schema
            .dropTableIfExists("deals")
            .dropTableIfExists("users")
            .createTableIfNotExists("deals", (table) => {
                table.uuid("id").primary();
                table.uuid("user_id");
                table.specificType("photo_urls", "text[]");
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
        log.info("Successfully created database tables.");
    }
    else {
        log.info("Using existing tables.");
    }

    /**
     * Create the minio file client.
     */
    try {
        await minioClient.bucketExists(BUCKET_NAME);
        log.info("Using existing bucket.");
    }
    // bucket does not exist, so create it
    catch (err) {
        console.error(err);
        await minioClient.makeBucket(BUCKET_NAME, "");
        log.info("Successfully made bucket.");
    }

    await minioClient.setBucketPolicy(BUCKET_NAME, "", Minio.Policy.READWRITE);

    console.log("Listening on port 3000");
    app.listen(3000);
    
}


main();
