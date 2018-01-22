let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
let app = require('../app.js');
let User = require('../src/user.js');
let th = require('./testHelper.js');
let registered_users= [{"userName":"pavani","sessionid":0},{"userName":"harshad","sessionid":1}];
let session = {
  'pavani':new User('Pavani'),
  'harshad':new User('harshad')
}
app.registered_users = registered_users;
app.session = session;
describe('app',()=>{

  describe("bad url",()=>{
    it("should give 404 error",()=>{
      request(app,{method:"POST",url:"/sdfasd"},(res)=>{
        th.status_is_not_found(res);
      })
    })
  })

  describe("GET /login",()=>{
    it('should serve the login page when user isNot loggedIn',done=>{
      request(app,{method:'GET',url:'/login'},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"login page");
      })
      done();
    })
    it('should serve the login page if the cookie is invalid',done=>{
      request(app,{method:"GET",url:"/login",headers:{cookie:"loggedIn=true"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"login page");
        done();
      })
    })
    it('should redirect to home page when user is valid and cookie is valid',done=>{
      request(app,{method:"GET",url:"/login",headers:{cookie:"sessionid=0"}},(res)=>{
        th.should_be_redirected_to(res,"/home");
        done();
      })
    })
  })

  describe('POST /addTodo',()=>{
    it("should add new Todo in specified user",(done)=>{
      request(app,{method:'POST',url:'/addTodo',body:"title=newTodo&description=todoDesc",headers:{cookie:"sessionid=0"}},(res)=>{
        th.should_be_redirected_to(res,"/todos");
      })
      done();
    })
  })

  describe('GET /getTodo',()=>{
    it("should give the particular todo of specified user",(done)=>{
      request(app,{method:'POST',url:'/addTodo',body:"title=newTodo&description=todoDesc",headers:{cookie:"sessionid=0"}},(res)=>{
        th.should_be_redirected_to(res,"/todos");
      })
      request(app,{method:'GET',url:'/getTodo',body:"todoId=0",headers:{cookie:"sessionid=0"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,'"title":"newTodo"')
      })
      done();
    })
  })

  describe('GET /getTodos',()=>{
    it("should give the todos of  specified user",(done)=>{
      request(app,{method:'POST',url:'/addTodo',body:"title=newTodo&description=todoDesc",headers:{cookie:"sessionid=0"}},(res)=>{
        th.should_be_redirected_to(res,"/todos");
      })
      request(app,{method:'GET',url:'/getTodos',headers:{cookie:"sessionid=0"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,`<ul><li id=0 title='todoDesc'`)
      })
      done();
    })
  })

  describe('POST /addTodoItem',()=>{
    it("should add new Item in specified user's Todo",(done)=>{
      request(app,{method:'POST',url:'/addTodo',body:"title=newTodo&description=todoDesc",headers:{cookie:"sessionid=0"}},(res)=>{
        th.should_be_redirected_to(res,"/todos");
      })
      request(app,{method:'POST',url:'/addTodoItem',body:`todoId=0&objective=todoItem`,headers:{cookie:"sessionid=0"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,'"id":0');
      })
      done();
    })
  })

  describe('POST /modifyTitle',()=>{
    it("should modify the title of the todo in specified user's Todo",(done)=>{
      request(app,{method:'POST',url:'/addTodo',body:"title=newTodo&description=todoDesc",headers:{cookie:"sessionid=0"}},(res)=>{
        th.should_be_redirected_to(res,"/todos");
      })
      request(app,{method:'POST',url:'/modifyTodoTitle',body:`todoId=0&todoTitle=newtitle`,headers:{cookie:"sessionid=0"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,'"title":"newtitle"');
      })
      done();
    })
  })

  describe('POST /modifyTodoDescription',()=>{
      it("should modify the description of the todo in specified user's Todo",(done)=>{
        request(app,{method:'POST',url:'/addTodo',body:"title=newTodo&description=todoDesc",headers:{cookie:"sessionid=0"}},(res)=>{
          th.should_be_redirected_to(res,"/todos");
        })
        request(app,{method:'POST',url:'/modifyTodoDescription',body:`todoId=0&todoDescription=new`,headers:{cookie:"sessionid=0"}},(res)=>{
          th.status_is_ok(res);
          th.body_contains(res,'"description":"new"');
        })
        done();
      })
    })

  describe('POST /modifyTodoItem',()=>{
    it("should modify the particular item in specified user's Todo",(done)=>{
      request(app,{method:'POST',url:'/addTodo',body:"title=newTodo&description=todoDesc",headers:{cookie:"sessionid=0"}},(res)=>{
        th.should_be_redirected_to(res,"/todos");
      })
      request(app,{method:'POST',url:'/addTodoItem',body:`todoId=0&objective=todoItem`,headers:{cookie:"sessionid=0"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,'"id":0');
      })
      request(app,{method:"POST",url:'/modifyTodoItem',body:`todoId=0&itemId=0&objective=obj`,headers:{cookie:"sessionid=0"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,'"objective":"obj"');
      })
      done();
    })
  })

  describe('POST /markItem',()=>{
    it("should mark particular item as done in specified user's Todo",(done)=>{
      request(app,{method:'POST',url:'/addTodo',body:"title=newTodo&description=todoDesc",headers:{cookie:"sessionid=0"}},(res)=>{
        th.should_be_redirected_to(res,"/todos");
      })
      request(app,{method:'POST',url:'/addTodoItem',body:`todoId=0&objective=todoItem`,headers:{cookie:"sessionid=0"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,'"id":0');
      })
      request(app,{method:'POST',url:'/markItem',body:`todoId=0&itemId=0`,headers:{cookie:"sessionid=0"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,'"status":true');
      })
      done();
    })
  })

  describe('POST /unmarkItem',()=>{
    it("should mark particular item as undone in specified user's Todo",(done)=>{
      request(app,{method:'POST',url:'/addTodo',body:"title=newTodo&description=todoDesc",headers:{cookie:"sessionid=0"}},(res)=>{
        th.should_be_redirected_to(res,"/todos");
      })
      request(app,{method:'POST',url:'/addTodoItem',body:`todoId=0&objective=todoItem`,headers:{cookie:"sessionid=0"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,'"id":0');
      })
      request(app,{method:'POST',url:'/markItem',body:`todoId=0&itemId=0`,headers:{cookie:"sessionid=0"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,'"status":true');
      })
      request(app,{method:'POST',url:'/unmarkItem',body:`todoId=0&itemId=0`,headers:{cookie:"sessionid=0"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,'"status":false');
      })
      done();
    })
  })

  describe('POST /deleteTodo',()=>{
    it("should delete the particular todo of specified user",(done)=>{
      request(app,{method:'POST',url:'/addTodo',body:"title=Todo1&description=todoDesc",headers:{cookie:"sessionid=0"}},(res)=>{
        th.should_be_redirected_to(res,"/todos");
      })
      request(app,{method:'POST',url:'/deleteTodo',body:"todoId=0",headers:{cookie:"sessionid=0"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,'{}')
      })
      done();
    })
  })

  describe('POST /deleteTodoItem',()=>{
    it("should delete the particular todo's Item of specified user",(done)=>{
      request(app,{method:'POST',url:'/addTodo',body:"title=Todo1&description=todoDesc",headers:{cookie:"sessionid=0"}},(res)=>{
        th.should_be_redirected_to(res,"/todos");
      })
      request(app,{method:'POST',url:'/addTodoItem',body:`todoId=1&objective=todoItem`,headers:{cookie:"sessionid=0"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,'"id":1');
      })
      request(app,{method:'POST',url:'/deleteTodoItem',body:"todoId=1&itemId=0",headers:{cookie:"sessionid=0"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,'"items":{}')
      })
      done();
    })
  })

  describe('GET /home',()=>{
    it("should redirect to login page if user is not logged in",()=>{
      request(app,{method:"GET",url:"/home"},(res)=>{
        th.should_be_redirected_to(res,"/login")
      })
    })
    it("should redirect to login page if cookie is invalid",()=>{
      request(app,{method:"GET",url:"/home",headers:{cookie:"loggedIn=true"}},(res)=>{
        th.should_be_redirected_to(res,"/login")
      })
    })
    it("should serve the home page if cookie id valid",()=>{
      request(app,{method:"GET",url:"/home",headers:{cookie:"sessionid=0"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"pavani")
      })
    })
  })

  describe('GET /newTodo',()=>{
    it("should serve the newTodo page",(done)=>{
      request(app,{method:'GET',url:'/newTodo',headers:{cookie:"sessionid=0"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"<title>newTodo</title>");
      })
      done();
    })
    it("should redirect to login page",(done)=>{
      request(app,{method:'GET',url:'/newTodo',headers:{cookie:"sessionidd=0"}},(res)=>{
        th.should_be_redirected_to(res,"/login");
      })
      done();
    })
  })

  describe('GET /logout',()=>{
    it("should redirect to login page",()=>{
      request(app,{method:'GET',url:'/logout'},(res)=>{
        th.should_be_redirected_to(res,"/login");
      })
    })
    it("should have a expiring cookie",()=>{
      request(app,{method:'GET',url:'/logout',headers:{cookie:"sessionid=0"}},(res)=>{
        th.should_have_expiring_cookie(res,"sessionid","0");
      })
    })
  })

  describe('POST /login',()=>{
    it('should Redirect to home page if valid user',done=>{
      request(app,{method:'POST',url:'/login',body:"userName=pavani"},(res)=>{
        th.should_be_redirected_to(res,"/home");
      })
      done();
    })
    it('should Redirect to login page if invalid user',done=>{
      request(app,{method:'POST',url:'/login',body:"userName=bhavani"},(res)=>{
        th.should_be_redirected_to(res,"/login");
      })
      done();
    })
    it("should set a cookie loggedIn for valid user",done=>{

      request(app,{method:"POST",url:"/login",body:"userName=pavani"},(res)=>{
        th.should_have_cookie_field(res,"sessionid");
      })
      done();
    })
    it("should have an expiring cookie for invalid user",done=>{
      request(app,{method:"POST",url:"/login",body:"userName=pani"},(res)=>{
        th.should_have_expiring_cookie(res,"message","loginFailed");
      })
      done();
    })
  })

})
