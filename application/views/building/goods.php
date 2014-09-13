<table class="table table-striped table-hover ">
    <thead>
        <tr>
            <th>#</th>
            <th>Type</th>
            <th>count</th>
            <th>quality</th>
        </tr>
    </thead>
    <tbody>
        <?foreach ($goods as $item){?>
            <tr>
                <td><?=$item->id?></td>
                <td><?=$item->product->name?></td>
                <td><?=$item->count?></td>
                <td><?=$item->quality?></td>
            </tr>
        <?}?>
    </tbody>
</table>