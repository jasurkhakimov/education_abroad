const { app, BrowserWindow } = require('electron')
// const { app, globalShortcut } = require('electron')

var net = require('net');

// This function create and return a net.Socket object to represent TCP client.


function getConn(connName){

    var option = {
        host:'192.168.43.38',
        port: 9990
    }
    global.json_data = {data: ''};

    global.session = {auth: null};
    // Create TCP client.

    global.all_universities = {data: null};

    // var executed = false;
    global.client = net.createConnection(option, function () {
        console.log('Connection local address : ' + client.localAddress + ":" + client.localPort);
        console.log('Connection remote address : ' + client.remoteAddress + ":" + client.remotePort);
    });    

    
    // client.setTimeout(100000);
    client.setEncoding('utf8');

    // When receive server send back data.
    client.on('data', function (data) {
        json_data.data += data;
        // console.log(json_data);
        console.log(client.localAddress + ":" + client.localPort + ' Server return data : ' + data);
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





function createWindow () {
  // Создаем окно браузера.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  global.javaClient = getConn('User');
  // и загрузить index.html приложения.
  win.loadFile('login.html')
}

app.on('ready', createWindow)




//Import net module.


// Create a java client socket.

// let get = JSON.stringify({info: 'add_uni', json: {name: 'inha', rank: 1000, country: 'Uzbekistan', description: 'Some description', address: 'Ziyolilar 7, Tashkent, Uzb', reference: 'http://inha.uz'}});
// let get = JSON.stringify({info: 'more', json: {id: '1'}});

// javaClient.write(get);


// console.log(auth)

