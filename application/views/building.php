<script src="/js/Search.js"></script>
<script>
    var template = '<tr>\
        <td>{owner}</td>\
        <td>{region}({x}/{y})</td>\
        <td>{count}</td>\
        <td>{quality}</td>\
        <td>{price}(+{shipping})</td>\
    </tr>';
    var search;
    $(function (){
        $('#BuildingTabs').extTab();
        search = new Search({form: $('#ImportSearch'), container: $('#ImportTable'), template: template});
    });
</script>
<div class="page-header">
    <h1><?=$building->name?></h1>
</div>
<ul id="BuildingTabs" class="nav nav-tabs">
    <li class=""><a href="#home" data-toggle="tab">Home</a></li>
    <li class=""><a href="#goods" data-toggle="tab">Goods</a></li>
    <li class=""><a href="#import" data-toggle="tab">Import</a></li>
</ul>
<div id="myTabContent" class="tab-content">
    <div class="tab-pane fade" id="home" data-url="/building/<?=$building->id?>/home">

    </div>
    <div class="tab-pane fade" id="goods" data-url="/building/<?=$building->id?>/goods">

    </div>
    <div class="tab-pane fade" id="import">
        <div class="well" style="margin-top: 1em">
            <form class="form-inline" id="ImportSearch">
                <input type="hidden" name="dest_id" value="<?=$building->id?>"/>
                <fieldset>
                    <ul class="nav navbar-nav">
                        <li>
                            <select class="form-control" name="product_id" id="select">
                                <option value="0">Select product...</option>
                                <?foreach ($products as $product){?>
                                    <option value="<?=$product->id?>"><?=$product->name?></option>
                                <?}?>
                            </select>
                        </li>
                    </ul>
                    <ul class="nav navbar-nav pull-right">
                        <li><button type="submit" class="btn btn-primary" onclick="search.go('goods');return false;">Find</button></li>
                    </ul>
                </fieldset>
            </form>
            <table class="table">
                <tr>
                    <th>owner</th>
                    <th>Raion</th>
                    <th>Count</th>
                    <th>Quality</th>
                    <th>Price(shipping)</th>
                </tr>
                <tbody id="ImportTable">

                <tbody>
            </table>
        </div>
    </div>
</div>