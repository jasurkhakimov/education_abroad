// Import net module.
var net = require('net');

// This function create and return a net.Socket object to represent TCP client.
function getConn(connName){

    var option = {
        host:'127.0.0.1',
        port: 9999
    }

    // Create TCP client.
    var client = net.createConnection(option, function () {
        console.log('Connection local address : ' + client.localAddress + ":" + client.localPort);
        console.log('Connection remote address : ' + client.remoteAddress + ":" + client.remotePort);
    });

    // client.setTimeout(100000);
    client.setEncoding('utf8');

    // When receive server send back data.
    client.on('data', function (data) {
        console.log('Server return data : ' + data);
    });

    // When connection disconnected.
    client.on('end',function () {
        console.log('Client socket disconnect. ');
    });

    client.on('timeout', function () {
        console.log('Client connection timeout. ');
    });

    client.on('error', function (err) {
        console.error(JSON.stringify(err));
    });

    return client;
}

// Create a java client socket.
var javaClient = getConn('Java');

// let get = JSON.stringify({info: 'add_uni', json: {name: 'inha', rank: 1000, country: 'Uzbekistan', description: 'Some description', address: 'Ziyolilar 7, Tashkent, Uzb', reference: 'http://inha.uz'}});
// let get = JSON.stringify({info: 'more', json: {id: '1'}});
// let get = JSON.stringify({info: 'all_universities'});

javaClient.write(get);


// console.log(auth)