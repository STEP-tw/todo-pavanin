let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
let app = require('../app.js');
let User = require('../src/user.js');
let th = require('./testHelper.js');

describe('app',()=>{
  describe('GET /',()=>{
    it('should serve the login page when user is not loggedin',done=>{
      request(app,{method:'GET',url:'/'},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"login page");
      })
      done();
    })
    it('should serve the login page when cookie is valid but no user',done=>{
      request(app,{method:"GET",url:"/",headers:{cookie:"loggedIn=true"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"login page");
        done();
      })
    })
    it('should serve login page when cookie is invalid and no user',done=>{
      request(app,{method:"GET",url:"/",headers:{cookie:"logIn=true"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"login page");
        done();
      })
    })
    it('should serve the login page when user is valid but no cookie',done=>{
      request(app,{method:"GET",url:"/",body:"userName=pavani"},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"login page");
        done();
      })
    })
    it('should serve login page when user is invalid and no cookie',done=>{
      request(app,{method:"GET",url:"/",body:"userName=pavni"},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"login page");
        done();
      })
    })
    it('should serve login page when user and cookie are invalid',done=>{
      request(app,{method:"GET",url:"/",body:"userName=pavni",headers:{cookie:"logIn=true"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"login page");
        done();
      })
    })
    it('should redirect to home page when user is valid and cookie is valid',done=>{
      request(app,{method:"GET",url:"/",body:"userName=pavani",headers:{cookie:"sessionid=0"}},(res)=>{
        th.should_be_redirected_to(res,"/home");
        done();
      })
    })
    it('should serve login page when user is valid and cookie is invalid',done=>{
      request(app,{method:"GET",url:"/",body:"userName=pavani",headers:{cookie:"logIn=true"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"login page");
        done();
      })
    })
    it('should serve login page when user is invalid and cookie is valid',done=>{
      request(app,{method:"GET",url:"/",body:"userName=pani",headers:{cookie:"loggedIn=true"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"login page");
        done();
      })
    })
  }),

  describe("GET /login",()=>{
    it('should serve the login page when user isNot loggedIn',done=>{
      request(app,{method:'GET',url:'/login'},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"login page");
      })
      done();
    })
    it('should serve the login page if the cookie is valid but no user',done=>{
      request(app,{method:"GET",url:"/login",headers:{cookie:"loggedIn=true"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"login page");
        done();
      })
    })
    it('should serve login page if the cookie is invalid',done=>{
      request(app,{method:"GET",url:"/login",headers:{cookie:"logIn=true"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"login page");
        done();
      })
    })
    it('should serve login page if the user is invalid',done=>{
      request(app,{method:"GET",url:"/login",body:"userName=pavni"},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"login page");
        done();
      })
    })
    it('should serve login page if the user and cookie is invalid',done=>{
      request(app,{method:"GET",url:"/login",body:"userName=pavni",headers:{cookie:"logIn=true"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"login page");
        done();
      })
    })
    it('should serve login page if the user is valid and cookie is invalid',done=>{
      request(app,{method:"GET",url:"/login",body:"userName=pavani",headers:{cookie:"logIn=true"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"login page");
        done();
      })
    })
    it('should redirect to home page when user is valid and cookie is valid',done=>{
      request(app,{method:"GET",url:"/",body:"userName=pavani",headers:{cookie:"sessionid=0"}},(res)=>{
        th.should_be_redirected_to(res,"/home");
        done();
      })
    })
    it('should serve login page if the user is invalid and cookie is valid',done=>{
      request(app,{method:"GET",url:"/login",body:"userName=pani",headers:{cookie:"loggedIn=true"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"login page");
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

  describe('POST /addTodoItem',()=>{
    it("should add new Item in specified user's Todo",(done)=>{
      request(app,{method:"GET",url:"/login",body:"userName=pani",headers:{cookie:"loggedIn=true"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"login page");
        done();
      })
      request(app,{method:'POST',url:'/addTodoItem',body:`todoId=0&objective=todoItem`,headers:{cookie:"sessionid=0"}},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"itemId=1");
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
      request(app,{method:"GET",url:"/home",headers:{cookie:"loggedIn=true; user=pavni"}},(res)=>{
        th.should_be_redirected_to(res,"/login")
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
        th.should_be_redirected_to(res,"/");
      })
    })
    it("should have a expiring cookie",()=>{
      request(app,{method:'GET',url:'/logout'},(res)=>{
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
