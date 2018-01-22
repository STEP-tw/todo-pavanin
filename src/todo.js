const Item = require('./item.js');
const Todo = function(id,title,description) {
  this.id=id;
  this.title = title;
  this.description = description || '';
  this.items = {};
  this.itemId=0;
}

Todo.prototype = {
  addItem:function(objective){
    this.items[this.itemId]=new Item(objective);
    this.itemId++;
  },

  deleteItem:function(itemId){
    delete this.items[itemId];
  },

  modifyItem:function(itemId,objective){
    let item = this.items[itemId];
    item.modify(objective);
  },

  markItem:function(itemId){
    let item = this.items[itemId];
    item.mark();
  },

  unmarkItem:function(itemId){
    let item = this.items[itemId];
    item.unmark();
  },

  getItem:function(itemId){
    return this.items[itemId];
  },

  getItems:function(){
    return this.items;
  },

  modifyTitle:function(newTitle){
    this.title = newTitle;
  },

  getTitle:function(){
    return this.title;
  },

  modifyDescription:function(newDescription){
    this.description = newDescription;
  },

  getItemStatus:function(itemId){
    let item = this.items[itemId];
    return item.isDone();
  },

  getItemObjective:function(itemId){
    return this.getItem(itemId).getObjective();
  },

  getTodoId:function(itemId){
    return this.id;
  },

  getDescription:function(){
    return this.description;
  },

}
module.exports=Todo;
