
const Koa = require("koa");
const Router = require('koa-router');
const pg = require("./database/db-client");

const minioClient = require("./object-store/minio");

async function main() {
    const app = new Koa();
    const router = new Router();

    app.use(async ctx => {
        ctx.body = "Hello World"
    });
    
    let res = await pg.schema
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
            table.specificType("location", "point");
        })
        .createTableIfNotExists("users", (table) => {
            table.uuid("id").primary();
            table.string("username");
            table.string("password");
            table.timestamp("joined_on");
        });

    console.log(res);

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
