const WebApp = require('./webapp');
const timeStamp = require('./time.js').timeStamp;
const generateHtmlFor=require("./src/htmlGenerator.js");

const toS=function(content){
  return JSON.stringify(content);
}

const getContentType = function(extension){
  let contentType={
    ".jpg":"img/jpg",
    ".html":"text/html",
    ".css":"text/css",
    ".js":"text/javascript",
    ".gif":"img/gif",
    ".pdf":"text/pdf",
    ".txt":"text/plain"
  };
  return contentType[extension] || "text/html";
};

let getPath= function(url){
  if(url=="/") return "./public/login";
  return "./public"+url;
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

let serveStaticFiles= function (req,res) {
  let path=getPath(req.url);
  extension= path.slice(path.lastIndexOf("."));
  let contentType=getContentType(extension);
  if(!app.fs.existsSync(path))return;
  res.setHeader("content-type",contentType);
  res.write(app.fs.readFileSync(path));
  res.end();
  return;
}

let logRequest = (req,res)=>{
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${toS(req.method,null,2)} ${toS(req.url,null,2)}`,
    `HEADERS=> ${toS(req.headers,null,2)}`,
    `COOKIES=> ${toS(req.cookies,null,2)}`,
    `BODY=> ${toS(req.body,null,2)}`,''].join('\n');
  app.fs.appendFile('request.log',text,()=>{});
};

let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = app.registered_users.find(u=>u.sessionid==sessionid);
  if(user&&sessionid){
    req.user = user;
  }

};

let handleGetLogin=(req,res)=>{
  let contents= app.fs.readFileSync("./public/templates/login.html",'utf8');
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
  todo=user.getTodo(todoId);
  let todohtml=generateHtmlFor.todo(todo);
  res.write(todohtml);
  res.end();
}

let handleNewTodo= function(req,res){
  let contents= app.fs.readFileSync("./public/templates/newTodo.html",'utf8');
  res.setHeader('content-type',"text/html");
  res.write(contents);
  res.end();
}

let handleGetTodos= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let allTodos=user.getTodos();
  let todoTitles=generateHtmlFor.todoTitlesList(allTodos,"asdf");
  res.write(todoTitles);
  res.end();
}

let handleGetTodo= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  let todo=user.getTodo(todoId);
  let todohtml=generateHtmlFor.todo(todo);
  res.write(todohtml);
  res.end();
}

let handleDeleteTodo= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  user.deleteTodo(todoId);
  let todos=user.getTodos();
  let todoTitles=generateHtmlFor.todoTitlesList(todos,"asdf");
  res.write(todoTitles);
  res.end();
}

let handleDeleteTodoItem= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  let itemId = req.body.itemId;
  user.deleteTodoItem(todoId,itemId);
  let todo=user.getTodo(todoId);
  let todohtml=generateHtmlFor.todo(todo);
  res.write(todohtml);
  res.end();
}

let handleModifyTodoTitle= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  let todoTitle = req.body.todoTitle;
  user.modifyTodoTitle(todoTitle,todoId);
  let todo=user.getTodo(todoId);
  let todohtml=generateHtmlFor.todo(todo);
  res.write(todohtml);
  res.end();
}

let handleModifyDescription= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  let todoDescription = req.body.todoDescription;
  user.modifyTodoDescription(todoDescription,todoId);
  let todo=user.getTodo(todoId);
  let todohtml=generateHtmlFor.todo(todo);
  res.write(todohtml);
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
  let todohtml=generateHtmlFor.todo(todo);
  res.write(todohtml);
  res.end();
}

let handleMarkTodoItem= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  let todoItemId= req.body.itemId;
  user.markTodoItem(todoId,todoItemId);
  let todo=user.getTodo(todoId);
  let todohtml=generateHtmlFor.todo(todo);
  res.write(todohtml);
  res.end();
}

let handleUnmarkTodoItem= function(req,res){
  let registeredUser = app.registered_users.find(name=>name.sessionid==req.cookies.sessionid);
  let user=app.session[registeredUser["userName"]];
  let todoId= req.body.todoId;
  let todoItemId= req.body.itemId;
  user.unmarkTodoItem(todoId,todoItemId);
  let todo=user.getTodo(todoId);
  let todohtml=generateHtmlFor.todo(todo);
  res.write(todohtml);
  res.end();
}

let handleGetHome= function(req,res){
    let contents= app.fs.readFileSync("./public/templates/home.html",'utf8');
    res.setHeader('content-type',"text/html");
    res.write(contents.replace("_userName_",req.user.userName));
    res.end();
    return;
}

let handleTodosView= function(req,res){
    let contents= app.fs.readFileSync("./public/templates/todos.html",'utf8');
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
app.use(serveStaticFiles);
app.get("/",handleGetLogin);
app.get("/login",handleGetLogin);
app.post("/login",handlePostLogin);
app.get("/home",handleGetHome);
app.get("/todos",handleTodosView);
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
