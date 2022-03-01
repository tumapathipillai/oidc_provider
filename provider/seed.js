require("dotenv").config({ path: "../.env" });
const client = require("./utils/redisClient");

client.flushall();

client.set(
  "Client:client1",
  JSON.stringify({
    client_id: "client1",
    client_secret: "client1",
    redirect_uris: [`${process.env.CLIENT_URL_1}redirect`],
    post_logout_redirect_uris: [`${process.env.CLIENT_URL_1}login`],
  })
);

client.set(
  "Client:client2",
  JSON.stringify({
    client_id: "client2",
    client_secret: "client2",
    redirect_uris: [`${process.env.CLIENT_URL_2}redirect`],
    post_logout_redirect_uris: [`${process.env.CLIENT_URL_2}login`],
  })
);

client.hset(
  "login",
  "achraf",
  JSON.stringify({
    password: "PasswordAchraf",
    webId: "https://pod.inrupt.com/atalby1/",
  })
);

client.hset(
  "login",
  "thileepan",
  JSON.stringify({
    password: "PasswordThileepan",
    webId: "https://pod.inrupt.com/tumapathipillai/",
  })
);
