let chai = require('chai');
let assert = chai.assert;
let Item = require("../src/models/item.js");

describe("item",()=>{
  let item;
  beforeEach(()=>{
    item = new Item("todo item","90")
  })
  describe("modify item",()=>{
    it("should modify the objective of the item",()=>{
      let objective = "new todo item";
      item.modify("new todo item");
      assert.deepEqual(item.getObjective(),objective);
    })
  })
  describe("getObjective",()=>{
    it("should return the objective of the item",()=>{
      assert.deepEqual(item.getObjective(),"todo item");
    })
  })
  describe("isDone ",()=>{
    it("should return false when the item is not marked",()=>{
      assert.isNotOk(item.isDone());
    }),
    it("should return true when the item is marked",()=>{
      item.mark();
      assert.isOk(item.isDone());
    }),
    it("should return false when the item is not marked",()=>{
      item.unMark();
      assert.isNotOk(item.isDone());
    })
  })
  describe("getId",()=>{
    it("should return the id of the item",()=>{
      assert.deepEqual(item.getId(),"90");
    })
  })
})
