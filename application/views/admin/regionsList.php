<h1>Regions</h1>
<div class="col-lg-4">
	<div class="well bs-component">
	  <form class="form-horizontal" action="/admin/regions/add" method="POST">
	    <fieldset>
	      <legend>Add Region</legend>
	      <div class="form-group">
	        <label for="inputName" class="col-lg-2 control-label">Name:</label>
	        <div class="col-lg-10">
	          <input type="text" class="form-control" name="name" id="inputName" placeholder="Name">
	        </div>
	      </div>
	      <div class="form-group">
	        <label for="inputX" class="col-lg-2 control-label">X:</label>
	        <div class="col-lg-4">
	          <input type="number" class="form-control" name="x" id="inputX" placeholder="X">
	        </div>
	        <label for="inputY" class="col-lg-2 control-label">Y:</label>
	        <div class="col-lg-4">
	          <input type="number" class="form-control" name="y" id="inputY" placeholder="Y">
	        </div>
	      </div>
	      <div class="form-group">
	        <div class="col-lg-10 col-lg-offset-2">
	          <button type="submit" class="btn btn-primary pull-right">Add</button>
	        </div>
	      </div>
	    </fieldset>
	  </form>
  </div>
</div>
<div class="bs-component">
  <table class="table table-striped table-hover ">
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>X/Y</th>
      </tr>
    </thead>
    <tbody>
    	<?foreach ($regions as $region){?>
	      <tr id="Region<?=$region->id?>" class="region-row">
	        <td><?=$region->id?></td>
	        <td><?=$region->name?></td>
	        <td><?=$region->x?>/<?=$region->y?></td>
	      </tr>
      	<?}?>
    </tbody>
  </table> 
  <div id="source-button" class="btn btn-primary btn-xs" style="display: none;">&lt; &gt;</div>
</div>