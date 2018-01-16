let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
let app = require('../app.js');
let th = require('./testHelper.js');

describe('app',()=>{
  describe('GET /',()=>{
    it('should serve the login page',done=>{
      request(app,{method:'GET',url:'/'},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"login page");
      })
      done();
    })
  }),
  describe('GET /login',()=>{
    it('should serve the login page',done=>{
      request(app,{method:'GET',url:'/login'},(res)=>{
        th.status_is_ok(res);
        th.body_contains(res,"login page");
      })
        done();
    })
  })
})
