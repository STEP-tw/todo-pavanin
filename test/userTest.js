let chai = require('chai');
let assert = chai.assert;
let Todo = require("../src/models/todo.js");
let Item = require("../src/models/item.js");
let User = require("../src/models/user.js");

describe("user",()=>{
  let user
  beforeEach(()=>{
    user = new User("kitty");
  })
  describe("name",()=>{
    it("should return the name of the user",()=>{
      assert.deepEqual(user.getName(),"kitty");
    })
  })

  describe("todos",()=>{
    it("should add a todo to the user's todos",()=>{
      user.addTodo("title","description");
      let expected={};
      expected[0]= new Todo("title","description")
      assert.deepEqual(user.getTodos(),expected);
    })
    it("should add the todos to the user's todos",()=>{
      user.addTodo("title1","description1");
      user.addTodo("title2","description2");
      user.addTodo("title3","description3");
      user.addTodo("title4","description4");
      let expected={};
      expected[0]= new Todo("title1","description1")
      expected[1]= new Todo("title2","description2")
      expected[2]= new Todo("title3","description3")
      expected[3]= new Todo("title4","description4")
      assert.deepEqual(user.getTodos(),expected);
    })
    it("should delete the todo from the user's todos",()=>{
      user.addTodo("title1","description1");
      user.addTodo("title2","description2");
      user.addTodo("title3","description3");
      user.addTodo("title4","description4");
      user.deleteTodo(2);
      let expected={};
      expected[0]= new Todo("title1","description1")
      expected[1]= new Todo("title2","description2")
      expected[3]= new Todo("title4","description4")
      assert.deepEqual(user.getTodos(),expected);
    })
    it("should modify the todo title of the user's todo",()=>{
      user.addTodo("title","description");
      user.modifyTodoTitle("newTitle",0)
      let expected={};
      expected[0]= new Todo("newTitle","description")
      assert.deepEqual(user.getTodos(),expected);
    })
    it("should modify the todo description of the user's todo",()=>{
      user.addTodo("title","description");
      user.modifyTodoDescription("newDescription",0)
      let expected={};
      expected[0]= new Todo("title","newDescription")
      assert.deepEqual(user.getTodos(),expected);
    })
    it("should add todo item to the user's todo",()=>{
      user.addTodo("title","description");
      user.addTodoItem("objective",0);
    })
  })
})
