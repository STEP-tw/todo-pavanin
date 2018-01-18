const WebApp = require('./webapp');
const timeStamp = require('./time.js').timeStamp;
const fs= require("fs");
let registered_users= [{"userName":"pavani"}]
let RedirectToLoginpage=(req,res)=>{
  if(req.url=="/") res.redirect("/login.html")
}

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
  let loggedIn = req.cookies.loggedIn;
  let user = registered_users.find(name=>name.userName==req.body.userName);
  if(user&&loggedIn){
    req.user = user;
  }
};

let handleGetLogin=(req,res)=>{
  if(req.cookies.loggedIn&&req.user){
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
  if(!user) {
    res.setHeader('Set-Cookie',`message=loginFailed; Max-Age=5`);
    res.redirect('/login');
    return;
  }
  res.setHeader("Set-Cookie",[`loggedIn=true`,`user=${getUserName(user)}`]);
  // res.setHeader("Set-Cookie");
  res.redirect("/home");
}

let handleGetHome= function(req,res){
  let user= registered_users.find(name=>name.userName==req.cookies.user);
console.log(req.cookies.loggedIn);
  if(user&&req.cookies.loggedIn){
    let contents= fs.readFileSync("./home.html",'utf8');
    res.setHeader('content-type',"text/html");
    res.write(contents.replace("_userName_",req.cookies.user));
    res.end();
    return;
  }
  res.redirect("/login");

}

let handleLogout= function(req,res){
  res.setHeader("Set-Cookie",[`loggedIn=false; Max-Age=5`,`user=; Max-Age=5`])
  res.redirect("/");
}

const app = WebApp.create();
app.use(logRequest);
app.use(loadUser);
app.get("/",handleGetLogin);
app.get("/login",handleGetLogin);
app.get("/home",handleGetHome);
app.get("/logout",handleLogout);
app.post("/login",handlePostLogin);

module.exports=app;
