const WebApp = require('./webapp');
const timeStamp = require('./time.js').timeStamp;
const fs= require("fs");
const generateHtmlFor=require("./src/htmlGenerator.js");
const toS=function(content){
  return JSON.stringify(content);
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
  if(req.urlIsOneOf(urls)){
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
};

let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = app.registered_users.find(u=>u.sessionid==sessionid);
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
  let user = app.registered_users.find(name=>name.userName==req.body.userName);
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
  let user=app.session[req.user.userName]
  let title= req.body.title;
  let description= req.body.description||"";
  user.addTodo(title,description);
  res.redirect("/todos");
}

let handleAddTodoItem= function(req,res){
  let sessionid = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[sessionid["userName"]];
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

let handleGetTodos= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let allTodos=user.getTodos();
  let todos=generateHtmlFor.todoTitlesList(allTodos,"asdf");
  res.write(todos);
  res.end();
}

let handleGetTodo= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  let todo=user.getTodo(todoId);
  res.write(toS(todo));
  res.end();
}

let handleDeleteTodo= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  user.deleteTodo(todoId);
  let todos=user.getTodos();
  res.write(toS(todos));
  res.end();
}

let handleDeleteTodoItem= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  let itemId = req.body.itemId;
  user.deleteTodoItem(todoId,itemId);
  let todo=user.getTodo(todoId);
  res.write(toS(todo));
  res.end();
}

let handleModifyTodoTitle= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  let todoTitle = req.body.todoTitle;
  user.modifyTodoTitle(todoTitle,todoId);
  let todo=user.getTodo(todoId);
  res.write(toS(todo));
  res.end();
}

let handleModifyDescription= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  let todoDescription = req.body.todoDescription;
  user.modifyTodoDescription(todoDescription,todoId);
  let todo=user.getTodo(todoId);
  res.write(toS(todo));
  res.end();
}

let handleModifyItem= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  let itemId =  req.body.itemId;
  let objective = req.body.objective;
  user.modifyTodoItem(todoId,itemId,objective);
  let todo=user.getTodo(todoId);
  res.write(toS(todo));
  res.end();
}

let handleMarkTodoItem= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  let todoItemId= req.body.itemId;
  user.markTodoItem(todoId,todoItemId);
  let todo=user.getTodo(todoId);
  res.write(toS(todo));
  res.end();
}

let handleUnmarkTodoItem= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  let todoItemId= req.body.itemId;
  user.unmarkTodoItem(todoId,todoItemId);
  let todo=user.getTodo(todoId);
  res.write(toS(todo));
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
app.get("/getTodo",handleGetTodo);
app.post("/deleteTodo",handleDeleteTodo);
app.post("/deleteTodoItem",handleDeleteTodoItem);
app.post("/markItem",handleMarkTodoItem);
app.post("/unmarkItem",handleUnmarkTodoItem);
app.post("/addTodoItem",handleAddTodoItem);
app.post("/modifyTodoItem",handleModifyItem);
app.post("/modifyTodoDescription",handleModifyDescription);
app.post("/modifyTodoTitle",handleModifyTodoTitle);

module.exports=app;
