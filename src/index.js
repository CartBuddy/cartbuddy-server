
const Koa = require("koa");
const DbClient = require("./database/db");

const app = new Koa();

app.use(async ctx => {
    ctx.body = "Hello World"
});

let dbClient = new DbClient();
dbClient.connect();

dbClient.createTable();

console.log("Listening on port 3000");
app.listen(3000);
