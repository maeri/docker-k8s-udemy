import keys from "./keys";
import * as redis from "redis";

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: +keys.redisPort,
  retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

function fib(index: number) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

//subscribe for 'message' event
sub.on("message", (channel, message) => {
  redisClient.hset("values", message, fib(parseInt(message)));
});

//subscribe for 'insert' event
sub.subscribe('insert');