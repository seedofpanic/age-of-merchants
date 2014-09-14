var Goods = Backbone.Model.extend({
    url: 'building/goods/save'
});
var GoodsCollection = Backbone.Collection.extend({
   model: Goods,
   save: function ()
   {
       $.ajax({
           url: 'building/save_goods',
           type: 'post',
           data: 'data=' + JSON.stringify(this.toJSON()),
           success: function ()
           {
               window.location.reload();
           }
       })
   }
});