let chai = require('chai');
let assert = chai.assert;
let app = require('../app.js');
let User = require('../src/user.js');
let th = require('./testHelper.js');
let MockFs= require("../mock.js");
let request= require("supertest");
let registered_users= [{"userName":"pavani","sessionid":0},{"userName":"harshad","sessionid":1}];
app.fs=new MockFs;
app.registered_users = registered_users;
let ShouldHaveSessionCookies = (res)=>{
  const keys = Object.keys(res.headers);
  let key = keys.find(k=>k.match(/set-cookie/i));
  let sessionCookie=res.headers[key].find(k=>k.match(/sessionid/));
  if(!sessionCookie) throw new Error(`Didnot expect Set-Cookie in header of ${keys}`);
}
let ShouldHaveExpiringMessageCookies = (res)=>{
  const keys = Object.keys(res.headers);
  let key = keys.find(k=>k.match(/set-cookie/i));
  console.log(key);
  console.log(res.headers[key]);
  let message=res.headers[key].find(k=>k.match(/message=Login Failed; Max-Age=5/));
  if(!message) throw new Error(`Didnot expect Set-Cookie in header of ${keys}`);
}
let ShouldHaveExpiringSessionCookies = (res)=>{
  const keys = Object.keys(res.headers);
  let key = keys.find(k=>k.match(/set-cookie/i));
  console.log(key);
  console.log(res.headers[key]);
  let message=res.headers[key].find(k=>k.match(/sessionid=0; Max-Age=0/));
  if(!message) throw new Error(`Didnot expect Set-Cookie in header of ${keys}`);
}
describe('app',()=>{
  before(()=>{
      app.fs.addFile("./public/templates/login.html","login page")
      app.fs.addFile("./public/templates/home.html","pavani")
      app.fs.addFile("./public/templates/newTodo.html","<title>newTodo</title>")
      app.fs.addFile("./public/templates/todos.html","pavani")
      app.fs.addFile("./public/css/todos.css","div")
      app.fs.addFile("request.log","")
  })
  beforeEach(()=>{
    let session = {
      'pavani':new User('Pavani'),
      'harshad':new User('harshad')
    }
    app.session = session;
  })

  describe("bad url",()=>{
    it("should give 404 error",(done)=>{
      request(app)
      .post("/bad")
      .expect(404)
      .end(done)
    })
  })

  describe('GET /todos',()=>{
    it("should redirect to login page if user is not logged in",(done)=>{
      request(app)
      .get("/todos")
      .expect(302)
      .expect('Location','/login')
      .end(done)
    })
    it("should redirect to login page if cookie is invalid",(done)=>{
      request(app)
      .get("/todos")
      .set("cookie","sessionid=pavani")
      .expect(302)
      .expect('Location','/login')
      .end(done)
    })
    it("should serve the todos page if cookie id valid",(done)=>{
      request(app)
      .get("/todos")
      .set("cookie","sessionid=0")
      .expect(200)
      .expect('Content-Type',/html/)
      .expect(/pavani/)
      .end(done)
    })
  })

  describe('GET /css/todos.css',()=>{
    it("should serve the todos page if cookie id valid",(done)=>{
      request(app)
      .get("/css/todos.css")
      .set("cookie","sessionid=0")
      .expect(200)
      .expect('Content-Type',/css/)
      .expect(/invisible/)
      .end(done)
    })
  })

  describe("GET /login and /",()=>{
    it('should serve the login page when user isNot loggedIn',(done)=>{
      request(app)
      .get("/login")
      .expect(200)
      .expect('Content-Type',/html/)
      .expect(/login page/)
      .end(done)
      // done();
    })
    it('should serve the login page if the cookie is invalid',(done)=>{
      request(app)
      .get("/login")
      .set("cookie","sessionId=0")
      .expect(200)
      .expect('Content-Type',/html/)
      .expect(/login page/)
      .end(done)
    })
    it('should serve the login page for / if the cookie is invalid',(done)=>{
      request(app)
      .get("/")
      .set("cookie","sessionId=0")
      .expect(200)
      .expect('Content-Type',/html/)
      .expect(/login page/)
      .end(done)
    })
    it('should redirect to home page when cookie is valid',(done)=>{
      request(app)
      .get("/login")
      .set("cookie","sessionid=0")
      .expect(302)
      .expect('Location','/home')
      .end(done)
    })
    it('should redirect to home page for / when cookie is valid',(done)=>{
      request(app)
      .get("/")
      .set("cookie","sessionid=0")
      .expect(302)
      .expect('Location','/home')
      .end(done)
    })
  })

  describe('POST /addTodo',()=>{
    it("should add new Todo in specified user",(done)=>{
      request(app)
      .post("/addTodo")
      .set("cookie","sessionid=0")
      .send("title=newTodo&description=todoDesc")
      .expect(302)
      .expect('Location',"/todos")
      .end(done)
    })
  })

  describe('post /getTodo',()=>{
    it("should give the particular todo of specified user",(done)=>{
      app.session["pavani"].addTodo("newTodo","desc");
      request(app)
      .post("/getTodo")
      .set("cookie","sessionid=0")
      .send("todoId=0")
      .expect(200)
      .expect('Content-Type',/html/)
      .expect(/newTodo/)
      .end(done)
    })
    it("should give the particular todo wnich dont have any descriptionof specified user",(done)=>{
      app.session["pavani"].addTodo("newTodo");
      request(app)
      .post("/getTodo")
      .set("cookie","sessionid=0")
      .send("todoId=0")
      .expect(200)
      .expect('Content-Type',/html/)
      .expect(/no description/)
      .end(done)
    })
  })

  describe('GET /getTodos',()=>{
    it("should give the todos of  specified user",(done)=>{
      app.session["pavani"].addTodo("newTodo","desc");
      request(app)
      .get("/getTodos")
      .set("cookie","sessionid=0")
      .expect(200)
      .expect('Content-Type',/html/)
      .expect(/desc/)
      .end(done)
    })
  })

  describe('POST /addTodoItem',()=>{
    it("should add new Item in specified user's Todo",(done)=>{
      app.session["pavani"].addTodo("newTodo","no description");
      request(app)
      .post("/addTodoItem")
      .set("cookie","sessionid=0")
      .send(`todoId=0&objective=todoItem`)
      .expect(200)
      .expect('Content-Type',/html/)
      .expect(/todoItem/)
      .end(done)
    })
  })

  describe('POST /modifyTitle',()=>{
    it("should modify the title of the todo in specified user's Todo",(done)=>{
      app.session["pavani"].addTodo("newTodo","desc");
      request(app)
      .post("/modifyTodoTitle")
      .set("cookie","sessionid=0")
      .send(`todoId=0&todoTitle=newTitle`)
      .expect(200)
      .expect('Content-Type',/html/)
      .expect(/newTitle/)
      .end(done)
    })
  })

  describe('POST /modifyTodoDescription',()=>{
      it("should modify the description of the todo in specified user's Todo",(done)=>{
        app.session["pavani"].addTodo("newTodo","desc");
        request(app)
        .post("/modifyTodoDescription")
        .set("cookie","sessionid=0")
        .send(`todoId=0&todoDescription=new`)
        .expect(200)
        .expect('Content-Type',/html/)
        .expect(/new/)
        .end(done)
      })
    })

  describe('POST /modifyTodoItem',()=>{
    it("should modify the particular item in specified user's Todo",(done)=>{
      app.session["pavani"].addTodo("newTodo","desc");
      app.session["pavani"].addTodoItem("objective",0);
      request(app)
      .post("/modifyTodoItem")
      .set("cookie","sessionid=0")
      .send(`todoId=0&itemId=0&objective=obj`)
      .expect(200)
      .expect('Content-Type',/html/)
      .expect(/obj/)
      .end(done)
    })
  })

  describe('POST /markItem',()=>{
    it("should mark particular item as done in specified user's Todo",(done)=>{
      app.session["pavani"].addTodo("newTodo","desc");
      app.session["pavani"].addTodoItem("objective",0);
      request(app)
      .post("/markItem")
      .set("cookie","sessionid=0")
      .send(`todoId=0&itemId=0`)
      .expect(200)
      .expect('Content-Type',/html/)
      .expect(/checked/)
      .end(done)
    })
  })

  describe('POST /unmarkItem',()=>{
    it("should mark particular item as undone in specified user's Todo",(done)=>{
      app.session["pavani"].addTodo("newTodo","desc");
      app.session["pavani"].addTodoItem("objective",0);
      request(app)
      .post("/unmarkItem")
      .set("cookie","sessionid=0")
      .send(`todoId=0&itemId=0`)
      .expect(200)
      .expect('Content-Type',/html/)
      .expect(/unchecked/)
      .end(done)
    })
  })

  describe('POST /deleteTodoItem',()=>{
    it("should delete the particular todo's Item of specified user",(done)=>{
      app.session["pavani"].addTodo("newTodo","desc");
      app.session["pavani"].addTodoItem("objective",0);
      request(app)
      .post("/deleteTodoItem")
      .set("cookie","sessionid=0")
      .send(`todoId=0&itemId=0`)
      .expect(200)
      .expect('Content-Type',/html/)
      .expect(/<br><br>/)
      .end(done)
    })
  })

  describe('POST /deleteTodo',()=>{
    it("should delete the particular todo of specified user",(done)=>{
      app.session["pavani"].addTodo("newTodo","desc");
      request(app)
      .post("/deleteTodo")
      .set("cookie","sessionid=0")
      .send(`todoId=0`)
      .expect(200)
      .expect('Content-Type',/html/)
      .expect(/no todos/)
      .end(done)
    })
  })

  describe('GET /home',()=>{
    it("should redirect to login page if user is not logged in",(done)=>{
      request(app)
      .get("/home")
      .expect(302)
      .expect('location','/login')
      .end(done)
    })
    it("should redirect to login page if cookie is invalid",(done)=>{
      request(app)
      .get("/home")
      .set('cookie','invalid=Cookie')
      .expect(302)
      .expect('location','/login')
      .end(done)
    })
    it("should serve the home page if cookie id valid",(done)=>{
      request(app)
      .get("/home")
      .set('cookie','sessionid=0')
      .expect(200)
      .expect(/pavani/)
      .end(done)
    })
  })

  describe('GET /newTodo',()=>{
    it("should serve the newTodo page",(done)=>{
      request(app)
      .get("/newTodo")
      .set('cookie','sessionid=0')
      .expect(200)
      .expect(/newTodo/)
      .end(done)
    })
    it("should redirect to login page",(done)=>{
      request(app)
      .get("/newTodo")
      .set('cookie','invalid=Cookie')
      .expect(302)
      .expect('location','/login')
      .end(done)
    })
  })

  describe('GET /logout',()=>{
    it("should redirect to login page",(done)=>{
      request(app)
      .get("/logout")
      .expect(302)
      .expect('location','/login')
      .end(done)
    })
    it("should have a expiring cookie",(done)=>{
      request(app)
      .get("/logout")
      .set('cookie','sessionid=0')
      .expect(ShouldHaveExpiringSessionCookies)
      .end(done)
    })
  })

  describe('POST /login',()=>{
    it('should Redirect to home page if valid user',done=>{
      request(app)
      .post("/login")
      .send("userName=pavani")
      .expect(302)
      .expect('location','/home')
      .end(done)
    })
    it('should Redirect to login page if invalid user',done=>{
      request(app)
      .post("/login")
      .send("userName=pavni")
      .expect(302)
      .expect('location','/login')
      .end(done)
    })
    it("should set a cookie loggedIn for valid user",done=>{
      request(app)
      .post("/login")
      .send("userName=pavani")
      .expect(ShouldHaveSessionCookies)
      .end(done)
    })
    it("should have an expiring cookie for invalid user",done=>{
      request(app)
      .post("/login")
      .send("userName=pvani")
      .expect(ShouldHaveExpiringMessageCookies)
      .end(done)
    })
  })

})
