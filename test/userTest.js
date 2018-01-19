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
  describe("getTodos",()=>{
    it("should give empty object",()=>{
      let expected={};
      assert.deepEqual(user.getTodos(),expected);
    })
    it("should give all todos",()=>{
      user.addTodo("title","description");
      user.addTodo("title2","description2");
      let expected={};
      expected[0]= new Todo(0,"title","description")
      expected[1]= new Todo(1,"title2","description2")
      assert.deepEqual(user.getTodos(),expected);
    })
  })
  describe("getTodo",()=>{
    it("should give the specific todo",()=>{
      user.addTodo("title","description");
      let expected= new Todo(0,"title","description")
      assert.deepEqual(user.getTodo(0),expected);
    })
  })
  describe("addTodo",()=>{
    it("should add a todo to the user's todos",()=>{
      user.addTodo("title","description");
      let expected={};
      expected[0]= new Todo(0,"title","description")
      assert.deepEqual(user.getTodos(),expected);
    })
    it("should add the todos to the user's todos",()=>{
      user.addTodo("title1","description1");
      user.addTodo("title2","description2");
      user.addTodo("title3","description3");
      user.addTodo("title4","description4");
      let expected={};
      expected[0]= new Todo(0,"title1","description1")
      expected[1]= new Todo(1,"title2","description2")
      expected[2]= new Todo(2,"title3","description3")
      expected[3]= new Todo(3,"title4","description4")
      assert.deepEqual(user.getTodos(),expected);
    })
  })
  describe("deleteTodo",()=>{
    it("should delete the todo from the user's todos",()=>{
      user.addTodo("title1","description1");
      user.addTodo("title2","description2");
      user.addTodo("title3","description3");
      user.addTodo("title4","description4");
      user.deleteTodo(3);
      let expected={};
      expected[0]= new Todo(0,"title1","description1")
      expected[1]= new Todo(1,"title2","description2")
      expected[2]= new Todo(2,"title3","description3")
      assert.deepEqual(user.getTodos(),expected);
    })
  })
  describe("modifyTodoTitle",()=>{
    it("should modify the todo title of the user's todo",()=>{
      user.addTodo("title","description");
      user.modifyTodoTitle("newTitle",0)
      let expected={};
      expected[0]= new Todo(0,"newTitle","description")
      assert.deepEqual(user.getTodos(),expected);
    })
  })
  describe("modifyTodoDescription",()=>{
    it("should modify the todo description of the user's todo",()=>{
      user.addTodo("title","description");
      user.modifyTodoDescription("newDescription",0)
      let expected={};
      expected[0]= new Todo(0,"title","newDescription")
      assert.deepEqual(user.getTodos(),expected);
    })
  })
  describe("addTodoItem",()=>{
    it("should add todo item to the user's todo",()=>{
      user.addTodo("title","description");
      user.addTodoItem("objective",0);
      let expected={}
      expected[0]=new Todo(0,"title","description");
      expected[0].addItem("objective");
      assert.deepEqual(user.getTodos(),expected);
    })
  })
  describe("deleteTodoItem",()=>{
    it("should add todo item to the user's todo",()=>{
      user.addTodo("title","description");
      user.addTodoItem("objective",0);
      let expected={}
      expected[0]=new Todo(0,"title","description");
      expected[0].itemId =1;
      user.deleteTodoItem(0,0);
      assert.deepEqual(user.getTodos(),expected);
    });
  })
  describe("modifyTodoItem",()=>{
    it("should modify objective of the todo item of the users todo",()=>{
      user.addTodo("title","description");
      user.addTodoItem("objective",0);
      user.modifyTodoItem(0,0,"new objective");
      let expected={}
      expected[0]=new Todo(0,"title","description");
      expected[0].addItem("new objective");
      assert.deepEqual(user.getTodos(),expected);
    });
  })
  describe("markTodoItem",()=>{
    it("should mark objective of the todo item of the users todo",()=>{
      user.addTodo("title","description");
      user.addTodoItem("objective",0);
      user.markTodoItem(0,0);
      let expected={}
      expected[0]=new Todo(0,"title","description");
      expected[0].addItem("objective");
      expected[0].markItem(0);
      assert.deepEqual(user.getTodos(),expected);
    });
  })
  describe("unmarkTodoItem",()=>{
    it("should unmark objective of the todo item of the users todo",()=>{
      user.addTodo("title","description");
      user.addTodoItem("objective",0);
      user.markTodoItem(0,0);
      user.unmarkTodoItem(0,0);
      let expected={}
      expected[0]=new Todo(0,"title","description");
      expected[0].addItem("objective");
      assert.deepEqual(user.getTodos(),expected);
    });
  })
})
