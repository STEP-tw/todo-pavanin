const Item= function(objective){
  this.objective=objective;
  this.status=false;
}

Item.prototype={
  isDone:function(){
    return this.status;
  },

  mark:function(){
    this.status=true;
  },

  unmark:function(){
    this.status=false;
  },

  modify:function(newObjective){
    this.objective=newObjective;
  },

  getObjective:function(){
    return this.objective;
  }

}

module.exports=Item;
