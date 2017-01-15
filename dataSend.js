var redis = require('redis');

var redisClient = redis.createClient(6380, '127.0.0.1');

var data = [];
var send =[];
var keyArray = [];



function scan () {
    console.log('sds');
    client.scan(
        cursor,
        'MATCH', '*',
        'COUNT', '10',
        function (err, res) {
            if (err) throw err;

            // Update the cursor position for the next scan
            cursor = res[0];
            // get the SCAN result for this iteration
            var keys = res[1];


            if (keys.length > 0) {
                data = data.concat(keys);
            }

            if (cursor === '0') {
                sendData();
                return null;
            }

            return scan();
        }
    );
}

function sendData() {
    console.log('scan -end');
    var count =0;
    if(data.length ==0){
        console.log('no-data');
        process.exit()
    }
    for(var i=0;i<data.length;i++)
    {
        keyArray.push(data[i]);
        console.log(i);
        var temp = data[i];
        var tempValue = null;
        redisClient.get(temp, function(err, reply) {

            tempValue = reply;
            send.push(JSON.parse(tempValue));
            count+=1;
            if (count == data.length){
                console.log('sdsd');
                PostCode(send);
                console.log(send.length);
            }
        });
    }
}


function PostCode(dataEnter) {
    console.log(dataEnter);

    var post_req  = null, post_data = JSON.stringify(dataEnter);
    console.log(post_data);
    var post_options = {
        hostname: '128.199.173.183',
        port    : '80',
        path    : '/routeradar/web/app_dev.php/gps/upload',
        method  : 'POST',
        headers : {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Content-Length': post_data.length
        }
    };

    post_req = http.request(post_options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ', chunk);
            var reply = JSON.parse(chunk);
            if(reply.status == true)
            {
                redisClient.del(keyArray,function (test) {
                    console.log('delete ok');
                    process.exit();
                });
                console.log('done');

            }
        });
    });

    post_req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    post_req.write(post_data);
    post_req.end();

}
