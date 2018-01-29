const express = require('express');
const timeStamp = require('./time.js').timeStamp;
const generateHtmlFor=require("./src/htmlGenerator.js");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const toS=function(content){
  return JSON.stringify(content);
}

let redirectToLoginIfNotLoggedIn=function(req,res,next){
  let urls=["/","/login"];
  let method="GET";
  if(!req.user&&method==req.method&&!urls.includes(req.url)){
    res.redirect("/login");
    return;
  }
  next();
}

let redirectToHomeIfLoggedIn= function(req,res,next){
  let urls=["/","/login"];
  let method="GET";
  if(urls.includes(req.url) && req.user){
    res.redirect("/home")
    return;
  }
  next();
}

let logRequest = (req,res,next)=>{
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${toS(req.method,null,2)} ${toS(req.url,null,2)}`,
    `HEADERS=> ${toS(req.headers,null,2)}`,
    `COOKIES=> ${toS(req.cookies,null,2)}`,
    `BODY=> ${toS(req.body,null,2)}`,''].join('\n');
  app.fs.appendFile('request.log',text,()=>{});
  console.log(`url => ${req.url} method => ${req.method}`);
  next();
};

let loadUser = (req,res,next)=>{
  let sessionid = req.cookies.sessionid;
  let user = app.registered_users.find(u=>u.sessionid==sessionid);
  if(user&&sessionid){
    req.user = user;
  }
  next();
};

let handleGetLogin=(req,res)=>{
  let contents= app.fs.readFileSync("./public/templates/login.html",'utf8');
  res.set('content-type',"text/html");
  res.send(contents.replace("_login_",req.cookies.message||""));
}

let handlePostLogin= (req,res)=>{
  let user = app.registered_users.find(name=>name.userName==req.body.userName);
  if(!user) {
    res.set('Set-Cookie',`message=Login Failed; Max-Age=5`);
    res.redirect('/login');
    return;
  }
  let sessionId = new Date().getTime();
  res.set("Set-Cookie",`sessionid=${sessionId}`);
  user.sessionid=sessionId;
  res.redirect("/home");
}

let handleAddTodo= function(req,res){
  let user=app.session[req.user.userName]
  let title= req.body.title;
  let description= req.body.description;
  user.addTodo(title,description);
  res.redirect("/todos");
}

let handleAddTodoItem= function(req,res){
  let sessionid = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[sessionid["userName"]];
  let todoId= req.body.todoId;
  let objective= req.body.objective;
  user.addTodoItem(objective,todoId);
  todo=user.getTodo(todoId);
  let todohtml=generateHtmlFor.todo(todo,"changeStatus");
  res.send(todohtml);
}

let handleNewTodo= function(req,res){
  let contents= app.fs.readFileSync("./public/templates/newTodo.html",'utf8');
  res.set('content-type',"text/html");
  res.send(contents);
}

let handleGetTodos= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let allTodos=user.getTodos();
  let todoTitles=generateHtmlFor.todoTitlesList(allTodos,"getTodo");
  res.set('Content-Type', 'text/html');
  res.send(todoTitles);
}

let handleGetTodo= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  let todo=user.getTodo(todoId);
  let todohtml=generateHtmlFor.todo(todo,"changeStatus");
  res.set('Content-Type', 'text/html');
  res.send(todohtml);
}

let handleDeleteTodo= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  user.deleteTodo(todoId);
  let todos=user.getTodos();
  let todoTitles=generateHtmlFor.todoTitlesList(todos,"getTodo");
  res.set('Content-Type', 'text/html');
  res.send(todoTitles);
}

let handleDeleteTodoItem= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  let itemId = req.body.itemId;
  user.deleteTodoItem(todoId,itemId);
  let todo=user.getTodo(todoId);
  let todohtml=generateHtmlFor.todo(todo,"changeStatus");
  res.send(todohtml);
}

let handleModifyTodoTitle= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  let todoTitle = req.body.todoTitle;
  user.modifyTodoTitle(todoTitle,todoId);
  let todo=user.getTodo(todoId);
  let todohtml=generateHtmlFor.todo(todo,"changeStatus");
  res.send(todohtml);
}

let handleModifyDescription= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  let todoDescription = req.body.todoDescription;
  user.modifyTodoDescription(todoDescription,todoId);
  let todo=user.getTodo(todoId);
  let todohtml=generateHtmlFor.todo(todo,"changeStatus");
  res.send(todohtml);
}

let handleModifyItem= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  let itemId =  req.body.itemId;
  let objective = req.body.objective;
  user.modifyTodoItem(todoId,itemId,objective);
  let todo=user.getTodo(todoId);
  let todohtml=generateHtmlFor.todo(todo,"changeStatus");
  res.send(todohtml);
}

let handleMarkTodoItem= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  let todoItemId= req.body.itemId;
  user.markTodoItem(todoId,todoItemId);
  let todo=user.getTodo(todoId);
  let todohtml=generateHtmlFor.todo(todo,"changeStatus");
  res.send(todohtml);
}

let handleUnmarkTodoItem= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  let todoItemId= req.body.itemId;
  user.unmarkTodoItem(todoId,todoItemId);
  let todo=user.getTodo(todoId);
  let todohtml=generateHtmlFor.todo(todo,"changeStatus");
  res.send(todohtml);
}

let handleGetHome= function(req,res){
    let contents= app.fs.readFileSync("./public/templates/home.html",'utf8');
    res.set('content-type',"text/html");
    res.send(contents.replace("_userName_",req.user.userName));

    return;
}

let handleTodosView= function(req,res){
    let contents= app.fs.readFileSync("./public/templates/todos.html",'utf8');
    res.set('content-type',"text/html");
    res.send(contents.replace("_userName_",req.user.userName));

    return;
}

let handleLogout= function(req,res){
  res.set("Set-Cookie",`sessionid=0; Max-Age=0`)
  res.redirect("/");
}


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'))
app.use(logRequest);
app.use(loadUser);
app.use(redirectToLoginIfNotLoggedIn)
app.use(redirectToHomeIfLoggedIn)
app.get("/",handleGetLogin);
app.get("/login",handleGetLogin);
app.post("/login",handlePostLogin);
app.get("/home",handleGetHome);
app.get("/todos",handleTodosView);
app.get("/logout",handleLogout);
app.get("/newTodo",handleNewTodo);
app.post("/addTodo",handleAddTodo);
app.get("/getTodos",handleGetTodos);
app.post("/getTodo",handleGetTodo);
app.post("/deleteTodo",handleDeleteTodo);
app.post("/deleteTodoItem",handleDeleteTodoItem);
app.post("/markItem",handleMarkTodoItem);
app.post("/unmarkItem",handleUnmarkTodoItem);
app.post("/addTodoItem",handleAddTodoItem);
app.post("/modifyTodoItem",handleModifyItem);
app.post("/modifyTodoDescription",handleModifyDescription);
app.post("/modifyTodoTitle",handleModifyTodoTitle);

module.exports=app;
