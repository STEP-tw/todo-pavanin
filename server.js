const http = require('http');
const app= require("./app.js");
const PORT = 9990;
const User = require('./src/user.js');
const fs= require("fs");

app.fs=fs;
let registered_users= [{"userName":"pavani"},{"userName":"harshad"}];
let session = {
  'pavani':new User('Pavani'),
  'harshad':new User('harshad')
}

app.registered_users = registered_users;
app.session=session;

let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
