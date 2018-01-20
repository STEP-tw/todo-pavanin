const WebApp = require('./webapp');
const timeStamp = require('./time.js').timeStamp;
const fs= require("fs");
const User = require('./src/user.js');
const toS=function(content){
  return JSON.stringify(content);
}
let registered_users= [{"userName":"pavani","sessionid":0},{"userName":"harshad","sessionid":1}];

let session = {
  'pavani':new User('Pavani'),
  'harshad':new User('harshad')
}

let redirectToLoginIfNotLoggedIn=function(req,res){
  let urls=["/","/login"];
  let method="GET";
  if(method==req.method&&!urls.includes(req.url)){
    !req.user && res.redirect("/login")
  }
}

let redirectToHomeIfLoggedIn= function(req,res){
  let urls=["/","/login"];
  let method="GET";
  if(urls.includes(req.url)){
    req.user && res.redirect("/home")
  }
}

let logRequest = (req,res)=>{
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${toS(req.method,null,2)} ${toS(req.url,null,2)}`,
    `HEADERS=> ${toS(req.headers,null,2)}`,
    `COOKIES=> ${toS(req.cookies,null,2)}`,
    `BODY=> ${toS(req.body,null,2)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});
  console.log(`${req.method} ${req.url}`);
};

let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(user&&sessionid){
    req.user = user;
  }

};

let handleGetLogin=(req,res)=>{
  let contents= fs.readFileSync("./login.html",'utf8');
  res.setHeader('content-type',"text/html");
  res.write(contents.replace("_login_",req.cookies.message||""));
  res.end();
}

let handlePostLogin= (req,res)=>{
  let user = registered_users.find(name=>name.userName==req.body.userName);
  if(!user) {
    res.setHeader('Set-Cookie',`message=loginFailed; Max-Age=5`);
    res.redirect('/login');
    return;
  }
  let sessionId = new Date().getTime();
  res.setHeader("Set-Cookie",`sessionid=${sessionId}`);
  user.sessionid=sessionId;
  res.redirect("/home");
}

let handleAddTodo= function(req,res){
  let user=session[req.user.userName]
  let title= req.body.title;
  let description= req.body.description||"";
  user.addTodo(title,description);
  res.redirect("/todos");
}

let handleAddTodoItem= function(req,res){
  let sessionid = registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=session[sessionid["userName"]];
  let todoId= req.body.todoId;
  let objective= req.body.objective;
  user.addTodoItem(objective,todoId);
  res.write(toS(user.getTodo(todoId)));
  res.end();
}

let handleNewTodo= function(req,res){
  let contents= fs.readFileSync("./newTodo.html",'utf8');
  res.setHeader('content-type',"text/html");
  res.write(contents);
  res.end();
}

let handleGetHome= function(req,res){
    let contents= fs.readFileSync("./home.html",'utf8');
    res.setHeader('content-type',"text/html");
    res.write(contents.replace("_userName_",req.user.userName));
    res.end();
    return;
}

let handleLogout= function(req,res){
  res.setHeader("Set-Cookie",`sessionid=0; Max-Age=0`)
  res.redirect("/");
}

const app = WebApp.create();
app.use(logRequest);
app.use(loadUser);
app.use(redirectToLoginIfNotLoggedIn)
app.use(redirectToHomeIfLoggedIn)
app.get("/",handleGetLogin);
app.get("/login",handleGetLogin);
app.post("/login",handlePostLogin);
app.get("/home",handleGetHome);
app.get("/logout",handleLogout);
app.get("/newTodo",handleNewTodo);
app.post("/addTodo",handleAddTodo);
app.get("/getTodos",handleGetTodos);
app.post("/addTodoItem",handleAddTodoItem);
module.exports=app;
