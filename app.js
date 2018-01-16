const WebApp = require('./webapp');
const timeStamp = require('./time.js').timeStamp;
const fs= require("fs");
let registered_users= [{"userName":"pavani"}]
let RedirectToLoginpage=(req,res)=>{
  if(req.url=="/") res.redirect("/login.html")
}

let logRequest = (req,res)=>{
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${JSON.stringify(req.method,null,2)} ${JSON.stringify(req.url,null,2)}`,
    `HEADERS=> ${JSON.stringify(req.headers,null,2)}`,
    `COOKIES=> ${JSON.stringify(req.cookies,null,2)}`,
    `BODY=> ${JSON.stringify(req.body,null,2)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});
  console.log(`${req.method} ${req.url}`);
};

let loadUser = (req,res)=>{
  let loggedIn = req.cookies.loggedIn;
  let user = registered_users.find(u=>u.userName==req.body.userName);
  if(user&&loggedIn){
    req.user = user;
  }
};
let handleGetLogin=(req,res)=>{
  let contents= fs.readFileSync("./login.html");
  res.write(contents);
  res.end();
}
const app = WebApp.create();
app.use(logRequest);
app.use(loadUser);

app.get("/",(req,res)=>{
  let contents= fs.readFileSync("./login.html");
  res.write(contents);
  res.end();
})

app.get("/login",handleGetLogin);

module.exports=app;
