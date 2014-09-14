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
            <tr>
                <td><?=$item->id?></td>
                <td><?=$item->product->name?></td>
                <td><?=$item->count?></td>
                <td><?=$item->quality?></td>
                <td>
                    <div class="checkbox"><label><input type="checkbox" name="itemExport[]" value="<?=$item->id?>"/> Allow</label></div>
                </td>
            </tr>
        <?}?>
    </tbody>
</table>