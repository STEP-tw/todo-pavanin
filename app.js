const WebApp = require('./webapp');

let RedirectToLoginpage=(req,res)=>{
  if(req.url=="/") res.redirect("/login")
}

const app = WebApp.create();

app.use(RedirectToLoginpage);
module.exports=app;
