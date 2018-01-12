const http = require('http');
const timeStamp = require('./time.js').timeStamp;
const app= require("./app.js");
const PORT = 9000;
let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
