<script src="/js/Goods.js"></script>
<script>
    var goods;
    $(function (){
        data = [];
        $('.obj-data','#goodsForm').each(function()
        {
            var item = [];
            var me = $(this);
            item.id = me.find('.item-id').val();
            item.price = me.find('.item-price').val();
            item.export = me.find('.item-export').is(':checked');

            data.push(new Goods(item));
        });
        goods = new GoodsCollection(data);
    });
</script>
<form id="goodsForm">
    <table class="table table-striped table-hover ">
        <thead>
            <tr>
                <th>#</th>
                <th>Type</th>
                <th>count</th>
                <th>quality</th>
                <th>Export</th>
            </tr>
        </thead>
        <tbody>
            <?foreach ($goods as $item){?>
                <tr class="obj-data">
                    <td><?=$item->id?></td>
                    <td><?=$item->product->name?></td>
                    <td><?=$item->count?></td>
                    <td><?=$item->quality?></td>
                    <td>
                        <input type="hidden" class="item-id" value="<?=$item->id?>"/>
                        <input type="text" class="item-price" size="5" value="<?=$item->price?>" onchange="goods.get(<?=$item->id?>).set('price', $(this).val())"/>
                        <input type="checkbox" class="item-export" value="" <?if ($item->export) {?>checked="" <?}?> onchange="goods.get(<?=$item->id?>).set('export', $(this).is(':checked'))"/>
                    </td>
                </tr>
            <?}?>
        </tbody>
    </table>
    <div class="pull-right"><button type="submit" class="btn btn-success" onclick="goods.save();return false;">Save</button></div>
</form>