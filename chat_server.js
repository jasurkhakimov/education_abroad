const mysql = require('mysql');


let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: null,
    database: 'os'
})

conn.connect((err)=>{
    if(err){
        return console.log(err.stack);
    }

    console.log('Connected successfully');
})

conn.query("SET SESSION wait_timeout = 604800");




// Import net module.
var net = require('net');

var option = {
    host:'192.168.43.165',
    port: 9990
}

// Create and return a net.Server object, the function will be invoked when client connect to this server.
var server = net.createServer(function(client) {

    console.log('Client connect. Client local address : ' + client.localAddress + ':' + client.localPort + '. client remote address : ' + client.remoteAddress + ':' + client.remotePort);
    server.getConnections(function (err, count) {
        if(!err)
        {
            // Print current connection count in server console.
            console.log("There are %d connections now. ", count);
        }else
        {
            // console.error(JSON.stringify(err));
        }

    });
    client.setEncoding('utf-8');

    // client.setTimeout(1000);

    // When receive client data.
    client.on('data', function (data) {



        // Print received client data and length.
        console.log('Receive client send data : ' + data + ', data size : ' + client.bytesRead);

        // Server send data back to client use client net.Socket object.
        // client.end('Server received data : ' + data + ', send back to client data size : ' + client.bytesWritten);

        let array_data = JSON.parse(data);
        
        function auth(array)
        {
            console.log(array['info']);
            let email = array.json['email'];
            let password = array.json['password'];

            let query = `SELECT * FROM users WHERE email='${email}' AND password='${password}'`;
                
            conn.query(query, (err, rows, fileds)=>{
                if(rows != '')
                {
                    if(rows[0].email == email && rows[0].password == password){
                        let auth_data = JSON.stringify(rows.reduce(function (accumulator, currentValue) {
                            return {...accumulator, currentValue}
                        }, {}));
                        client.write(auth_data);
                    }
                }else{
                    client.write('{"error": "Error on email or password"}')
                }
            })
        }

        function register(array)
        {
            
            let query = `SELECT * FROM users WHERE email='${array.json.email}'`;
            conn.query(query, (err, rows, fields)=>{
                if(rows == '')
                {
                    let query = 'INSERT INTO users SET ?';
            
                    conn.query(query, array.json, (err, res) => {
                        if(err) throw err;
                    
                        console.log('Last insert ID:', res.insertId);
                        client.write('{"success": "Added"}');

                    });
                }else{
                    client.write('{"error": "Email already exists"}');

                }
            })
        }
        

        function all_universities(){

            let query = 'SELECT * FROM `universities` ORDER BY rank';
            // let query1 = `SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'name', name, 'description', description, 'rank', rank, 'address', address, 'reference', reference, 'country', country)) from universities`
            
            conn.query(query, (err,rows) => {
                let uni_data = JSON.stringify(rows.reduce(function (accumulator, currentValue) {
                    return {...accumulator, [currentValue.id]: currentValue}
                }, {}));
                
                setTimeout(()=>{
                    client.write(uni_data);
                },800);
              });
        }

        function search_uni(array)
        {
            let country_id =  array.json.country_id;
            let level = array.json.level;
            
            
            let query = `SELECT universities.* FROM universities, country WHERE country.id='${country_id}' AND level='${level}' AND country.country_name=universities.country`;

            conn.query(query, (err,rows) => {
                if(err) throw err;

                let uni_data = JSON.stringify(rows.reduce(function (accumulator, currentValue) {
                    return {...accumulator, [currentValue.id]: currentValue}
                }, {}));
                
                client.write(uni_data);
            });

        }
        
        function more(array)
        {
            let id =  array.json.id ;

            let query = `SELECT * FROM universities WHERE id='${id}'`;

            conn.query(query, (err,rows) => {
                if(err) throw err;
                let uni_data = JSON.stringify(rows.reduce(function (accumulator, currentValue) {
                    return {...accumulator, [currentValue.id]: currentValue}
                }, {}));
                client.write(uni_data);
            });
        }


        function add_uni(array){

            conn.query('INSERT INTO universities SET ?', array.json, (err, res) => {
            if(err) throw err;
            client.write('1');
            console.log('Last university insert ID:', res.insertId);
            });

        }

        function getOnlineUsers()
        {
            server.getConnections(function (err, count) {
                if(!err)
                {
                    // Print current connection count in server console.
                    client.write(String(count));
                }else
                {
                    console.error(JSON.stringify(err));
                }
    
            });
        }



        if(array_data.info == 'auth')
        {
            auth(array_data);
        }else if(array_data.info == 'register'){
            register(array_data);
        }else if(array_data.info == 'all_universities'){
            all_universities();
        }else if(array_data.info == 'search_uni'){
            search_uni(array_data);
        }else if(array_data.info == 'more'){
            more(array_data)
        }else if(array_data.info == 'add_uni'){
            add_uni(array_data);
        }else if(array_data.info == 'online_users')
        {
            getOnlineUsers();
        }

        
        server.getConnections(function (err, count) {
            if(!err)
            {
                // Print current connection count in server console.
                console.log("There are %d connections now. ", count);
            }else
            {
                console.error(JSON.stringify(err));
            }

        });
    });


    client.on('error', ()=>{
        client.end();
        server.getConnections(function (err, count) {
            if(!err)
            {
                // Print current connection count in server console.
                console.log("There are %d connections now. ", count);
            }else
            {
                console.error(JSON.stringify(err));
            }

        });
    })

    // When client send data complete.
    client.on('end', function () {
        console.log('Client disconnect.');

        // Get current connections count.
        server.getConnections(function (err, count) {
            if(!err)
            {
                // Print current connection count in server console.
                console.log("There are %d connections now. ", count);
            }else
            {
                console.error(JSON.stringify(err));
            }

        });
    });

    // // When client timeout.
    // client.on('timeout', function () {
    //     console.log('Client request time out. ');
    // })
});

// Make the server a TCP server listening on port 9999.
server.listen(option, function () {

    // Get server address info.
    var serverInfo = server.address();

    var serverInfoJson = JSON.stringify(serverInfo);

    console.log('TCP server listen on address : ' + serverInfoJson);

    server.on('close', function () {
        console.log('TCP server socket is closed.');
    });

    server.on('error', function (error) {
        client.end();
        // console.error(JSON.stringify(error));
    });

});