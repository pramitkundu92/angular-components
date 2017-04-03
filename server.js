var cluster = require('cluster');
var os = require('os');
var PORT = 7777;

if(cluster.isMaster){
    var num = os.cpus().length;
    console.log('Master cluster setting up ' + num + ' workers...');
    
    for(var i=0;i<num;i++){
        cluster.fork();
    }
    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });
    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
    
    console.log('Server started at http://localhost:'+PORT+'/components/demo/index');
}
else {
    var express = require('express');
    var http = require('http');

    var app = express();

    var router = express.Router();
    var context = '/components/demo';
    
    app.use(context, router);
    app.use(context, express.static(__dirname + '/webapp'));
    
    router.get('/index',function(req,res){
        res.sendFile(__dirname + '/index.html');           
    });

    var server = http.createServer(app);
    server.listen(PORT);
    
}