const http = require('http');
const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const PORT = 2002;
const path = require('path');
const port =  process.env.PORT ||PORT;
const mysql = require('mysql');
const pool = mysql.createPool({

    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password,
    connectionLimit: 10
}) 

app.use(expressEjsLayouts);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname , '/public')));
app.use('/src',express.static(path.join(__dirname , '/public/src')));

var initial_object = {};

//------------------------------------------------------------git---------------------------//
app.get('', (req,res)=>{
    app.use('/public', express.static(path.join(__dirname , '/public')));

    res.render('pages/main-page.ejs', {initial_object});
})

//=======================================================================

app.get('/qeck/join/:user&:secret&:code', (req,res)=>{
    app.use('/public', express.static(path.join(__dirname , '/public')));

    res.render('pages/qeck-frame.ejs', {initial_object, user:req.params.user});
})
//=======================================================================
var connectedSockets = {};
var numCount = 0;

io.sockets.on('connection', (socket)=>{
    numCount++;
    connectedSockets[numCount] = {user: socket};
        
    connectedSockets[numCount] = {user: socket};
    connectedSockets[numCount].user.on('username', (username)=>{
        connectedSockets[numCount].user.data.username = username;
       
    })

    socket.on('disconnect',(msg)=>{
           io.emit('user left', socket.data.user);
       })
    socket.on('send msg', (info)=>{
        io.sockets.emit('msg', info);
    })
    
    socket.on('user joined', (info)=>{
        socket.data = {user: info.user}
        io.sockets.emit('joined msg', info.msg);
    })
    
    
})
//---------------------------------------------------------------------------------------//
server.listen(port, ()=> console.log("Listening on port ",port));