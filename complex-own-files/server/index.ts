import keys from "./keys";

//Express App Setup
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

//Postgres Client Setup
import { Pool } from "pg";

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  port: +keys.pgPort
});

pgClient.on("error", () => console.log("Lost PG connection"));

pgClient.query("CREATE TABLE IF NOT EXISTS values(number INT)").catch(err => console.log(err));

//Redis Client Setup
import * as redis from "redis";

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: +keys.redisPort,
  retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

//Express route handlers

app.get("/", (req, res) => {
  res.send("HI");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * FROM values");
  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  //redis js doesnt have async - await functionality
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  redisClient.hset("values", index, "Nothing yet!");

  //wake up worker to start calulations
  redisPublisher.publish("insert", index);

  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);
  res.send({ working: true });
});

app.listen(5000, err => {
  console.log("Listening");
});
