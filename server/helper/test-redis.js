const redis = require('redis');
const client = redis.createClient();

client.get('test', redis.print);
client.set('test', 'camiler', 'EX', 20);
client.get('test', function (err, reply) {
  console.log(reply);
});

