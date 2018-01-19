const WebApp = require('./webapp');
const timeStamp = require('./time.js').timeStamp;
const fs= require("fs");
const User = require('./src/models/user.js');
//initizing with pavani as userName
let registered_users= [{"userName":"pavani"}]
let session = {};
let getUserName= function(user){
  return user.userName;
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
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(name=>name.userName==req.body.userName);
  if(user&&sessionid){
    req.user = user;
  }
};

let redirectifNotLoggedIn= function(req,res,url){
  if(req.cookies.sessionid){
    res.redirect(url);
    return;
  }
}

let handleGetLogin=(req,res)=>{
  if(req.cookies.sessionid){
    res.redirect("/home");
    return;
  }
  let contents= fs.readFileSync("./login.html",'utf8');
  res.setHeader('content-type',"text/html");
  res.write(contents.replace("_login_",req.cookies.message||""));
  res.end();
}

let handlePostLogin= (req,res)=>{
  let user = registered_users.find(name=>name.userName==req.body.userName);
  console.log(user);
  if(!user) {
    res.setHeader('Set-Cookie',`message=loginFailed; Max-Age=5`);
    res.redirect('/login');
    return;
  }
  let userName=getUserName(user);
  let sessionId = new Date().getTime();
  session[sessionId]=new User(userName);
  res.setHeader("Set-Cookie",`sessionid=${sessionId}`);
  user.sessionid=sessionId;
  res.redirect("/home");
}

let handleAddTodo= function(req,res){
  if(!req.cookies.sessionid){
    res.redirect("/login");
    return;
  }
  let user=session[req.cookies.sessionid];
  let title= req.body.title;
  let description= req.body.description;
  user.addTodo(title,description);
  console.log(user);
  res.redirect("/todos");
}

let handleNewTodo= function(req,res){
  if(!req.cookies.sessionid){
    res.redirect("/login");
    return;
  }
  let contents= fs.readFileSync("./newTodo.html",'utf8');
  res.setHeader('content-type',"text/html");
  res.write(contents);
  res.end();
}

let handleGetHome= function(req,res){
  if(req.cookies.sessionid){
    let contents= fs.readFileSync("./home.html",'utf8');
    res.setHeader('content-type',"text/html");
    res.write(contents.replace("_userName_",req.cookies.user));
    res.end();
    return;
  }
  res.redirect("/login");

}

let handleLogout= function(req,res){
  res.setHeader("Set-Cookie",`sessionid=0; Max-Age=0`)
  res.redirect("/");
}

const app = WebApp.create();
app.use(logRequest);
app.use(loadUser);
app.get("/",handleGetLogin);
app.get("/login",handleGetLogin);
app.get("/home",handleGetHome);
app.get("/logout",handleLogout);
app.get("/newTodo",handleNewTodo);
app.post("/login",handlePostLogin);
app.post("/addTodo",handleAddTodo);
app.addCustomSession =(customSession)=> session = customSession;
module.exports=app;
