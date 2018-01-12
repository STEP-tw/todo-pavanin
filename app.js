const WebApp = require('./webapp');
const timeStamp = require('./time.js').timeStamp;
const fs= require("fs");
let registered_users= [{"userName":"pavani"}]
let RedirectToLoginpage=(req,res)=>{
  if(req.url=="/") res.redirect("/login.html")
}

let getContentType=function(url){
  let extention=url.substr(url.lastIndexOf("."));
  let fileHeaders={
    ".html":{contentType:"text/html"},
    ".jpg":{contentType:"image/jpg"},
    ".jpeg":{contentType:"image/jpeg"},
    ".css":{contentType:"text/css"},
    ".gif":{contentType:"image/gif"},
    ".pdf":{contentType:"application/pdf"},
  }
  return fileHeaders[extention];
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
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

let handleStaticFiles= (req,res)=>{
  if(fs.existsSync("./"+req.url)){
      res.setHeader('Content-type',getContentType(req.url));
      contents=fs.readFileSync("./"+req.url);
      res.write(contents);
      res.end();
  };
}

const app = WebApp.create();
app.use(logRequest);
app.use(loadUser);
app.use(RedirectToLoginpage);
app.use(handleStaticFiles);



app.get("/logout",(req,res)=>{
  res.setHeader('Set-Cookie',`logInFailed=false; Expires${new Date(1).toUTCString()}`);
  res.setHeader('Set-Cookie',`sessionid=0; Expires${new Date(1).toUTCString()}`);
  if(req.user)
    delete req.user.sessionid;
  res.redirect('./login.html');
});


app.post("/login",(req,res)=>{
  let user = registered_users.find(u=>u.userName==req.body.userName);
  if(!user) {
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.redirect('./login.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('./home.html');
})

module.exports=app;
