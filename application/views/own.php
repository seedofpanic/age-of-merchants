<?if(isset($user) && ($user->profile->id === $owner->id)){?><a href="/game/project" class="pull-right btn btn-primary">Build</a><?}?>
<h1><?=$owner->name?>'s buildings</h1>
<div class="bs-component">
  <table class="table table-striped table-hover ">
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Type</th>
        <th>Status</th>
        <th>Region</th>
        <th>X/Y</th>
      </tr>
    </thead>
    <tbody>
    	<?foreach ($buildings as $building){?>
	      <tr id="Building<?=$building->id?>" class="building-row">
	        <td><?=$building->id?></td>
	        <td><?=$building->name?></td>
	        <td><?=$building->type?></td>
	        <td><?=$building->status?><?if ($building->status === 'building'){?>(<?=$building->buildtime?>)<?}?></td>
	        <td><?=$building->field->region->name?></td>
	        <td><?=$building->field->x?>/<?=$building->field->y?></td>
	      </tr>
      	<?}?>
    </tbody>
  </table> 
 </div>