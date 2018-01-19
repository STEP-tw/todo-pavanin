let chai = require('chai');
let assert = chai.assert;
let Todo = require("../src/models/todo.js");
let Item = require("../src/models/item.js");

describe("todo",()=>{
  let todo
  beforeEach(()=>{
    todo = new Todo("0","title","description");
  })
  describe("addItem",()=>{
    it("should addItem to the todo",()=>{
      let objective="firstItem";
      todo.addItem(objective);
      expected={}
      expected[0]=new Item(objective);
      assert.deepEqual(todo.getItems(),expected);
    })
    it("should addItem any number of items to the todo",()=>{
      let first="firstItem";
      let second="secondItem";
      todo.addItem(first);
      todo.addItem(second);
      expected={}
      expected[0]=new Item(first);
      expected[1]=new Item(second);
      assert.deepEqual(todo.getItems(),expected);
    })
  })

  describe("deleteItem",()=>{
    it("should delete the item",()=>{
      let objective="firstItem";
      todo.addItem(objective);
      todo.deleteItem(0);
      expected={}
      assert.deepEqual(todo.getItems(),expected);
    })
    it("should delete one the item",()=>{
      let first="firstItem";
      let second="secondItem";
      todo.addItem(first);
      todo.addItem(second);
      todo.deleteItem(1);
      console.log(todo.getItems());
      expected={};
      expected[0]=new Item(first);
      assert.deepEqual(todo.getItems(),expected);
    })
    it("should delete the specific item and it won't change the id af the remaining items",()=>{
      let first="firstItem";
      let second="secondItem";
      todo.addItem(first);
      todo.addItem(second);
      todo.deleteItem(0);
      expected={};
      expected[1]=new Item(second);
      assert.deepEqual(todo.getItems(),expected);
    })
  })

  describe("modify item",()=>{
    it("should modify the objective of the item",()=>{
      let objective="firstItem";
      todo.addItem(objective);
      todo.modifyItem(0,"modified")
      expected={}
      expected[0]=new Item("modified");
      assert.deepEqual(todo.getItems(),expected);
    })
  })

  describe("mark item",()=>{
    it("should mark the item",()=>{
      let objective="firstItem";
      todo.addItem(objective);
      todo.markItem(0);
      assert.isOk(todo.getItemStatus(0));
    })
  })

  describe("unmark item",()=>{
    it("should unmark the item",()=>{
      let objective="firstItem";
      todo.addItem(objective);
      todo.markItem(0);
      todo.unmarkItem(0)
      assert.isNotOk(todo.getItemStatus(0));
    })
  })

  describe("todo description",()=>{
    it("should return the description of the todo",()=>{
      expected="description";
      assert.deepEqual(todo.getDescription(),expected);
    })
    it("should return the modified description",()=>{
      expected="desp";
      todo.modifyDescription(expected);
      assert.deepEqual(todo.getDescription(),expected);
    })
  })

  describe("todo title",()=>{
    it("should return the title of the todo",()=>{
      expected="title";
      assert.deepEqual(todo.getTitle(),expected);
    })
    it("should return the modified title of the todo",()=>{
      expected="new title";
      todo.modifyTitle(expected);
      assert.deepEqual(todo.getTitle(),expected);
    })
  })
})
