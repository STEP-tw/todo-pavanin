let chai = require('chai');
let assert = chai.assert;

let th = {};
th.should_be_redirected_to = (res,location)=>{
  assert.equal(res.statusCode,302);
  assert.equal(res.headers.Location,location);
};
th.status_is_not_found = (res) => assert.equal(res.statusCode,404);
th.status_is_ok = (res)=>assert.equal(res.statusCode,200);
th.content_type_is = (res,expected)=> assert.equal(res.headers['Content-Type'],expected);

th.body_contains = (res,text)=> assert.isOk(res.body.includes(text),`missing ${text}`);
th.body_does_not_contain = (res,text)=> assert.isNotOk(res.body.includes(text),`missing ${text}`);

th.should_not_have_cookie = (res,name)=> {
  let cookieText = res.headers['Set-Cookie']||'';
  assert.notInclude(cookieText,`${name}=`);
};
th.should_have_cookie = (res,name,value)=> {
  // console.log(res.headers);
  let cookieText = res.headers['Set-Cookie'];
  assert.include(cookieText,`${name}=${value}`);
};
th.should_have_cookie_field = function(res,cookieField){
  let cookieText = res.headers['Set-Cookie'];
  assert.include(cookieText,`${cookieField}`);
}
th.should_have_expiring_cookie = (res,name,value)=> {
  // console.log(res.headers);
  let cookieText = res.headers['Set-Cookie'];
  assert.include(cookieText,`${name}=${value}; Max-Age=`);
};
module.exports = th;
