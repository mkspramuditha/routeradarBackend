var mqtt = require('mqtt');
var redis = require('redis');

var redisClient = redis.createClient(6380, '127.0.0.1');
var client  = mqtt.connect('mqtt://test.mosquitto.org');

client.on('connect', function () {
    client.subscribe('presence');
    // client.publish('presence', 'Hello mqtt');
});

client.on('message', function (topic, message) {
    // message is Buffer
    var now = new Date();

    now.format("dd/MM/yyyy hh:mm TT");
    redisClient.set(now,message.toString());
    // console.log(message.toString());
    // client.end();
});
