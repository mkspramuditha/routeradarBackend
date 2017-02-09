var mqtt = require('mqtt');
var redis = require('redis');

var redisClient = redis.createClient(6379, '127.0.0.1');
var client  = mqtt.connect('mqtt://128.199.217.137');

client.on('connect', function () {
    client.subscribe('test');
    console.log('connect');
    // client.publish('presence', 'Hello mqtt');
});

client.on('message', function (topic, message) {
    // message is Buffer
    // console.log(message.toString());
    var now = new Date();
    //
    now.toString();
    redisClient.set(now,message.toString());
    console.log(message.toString());
    // client.end();
});
