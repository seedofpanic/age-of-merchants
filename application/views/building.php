<script>
    $(function (){
        $('#BuildingTabs').extTab();
    });
</script>
<div class="page-header">
    <h1><?=$building->name?></h1>
</div>
<ul id="BuildingTabs" class="nav nav-tabs">
    <li class=""><a href="#home" data-toggle="tab">Home</a></li>
    <li class=""><a href="#goods" data-toggle="tab">Goods</a></li>
</ul>
<div id="myTabContent" class="tab-content">
    <div class="tab-pane fade" id="home" data-url="/building/<?=$building->id?>/home">

    </div>
    <div class="tab-pane fade" id="goods" data-url="/building/<?=$building->id?>/goods">

    </div>
</div>