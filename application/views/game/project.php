<script src="/js/Wizard.js"></script>
<script>
	var projectWizard;
	var wizardContainer;
	$(function(){
		wizardContainer = $('#ProjectWizard');
		projectWizard = new Wizard({container: wizardContainer});
		$('#step1 .type', wizardContainer).change(step1Validate)
		$('#step2 input', wizardContainer).change(step2Validate)
	})
	function step1Validate()
	{
        var selectedType = $('#step1 .type:checked', wizardContainer)
		if (selectedType.length > 0)
		{
            $('#TimeToBuild').html(selectedType.attr('data-time'));
			$('#step1 .next', wizardContainer).removeClass('disabled');
		}else{
			$('#step1 .next', wizardContainer).addClass('disabled');
		}
	}
	function step2Validate()
	{
		var filled = true;
		$('#step2 input', wizardContainer).each(function (){
			var val = $(this).val();
			if (!((val != '') && (val > -1) && (val < 64)))
			{
				filled = false;
			}
		});
		if (filled)
		{
			$('#step2 .next', wizardContainer).removeClass('disabled');
		}else{
			$('#step2 .next', wizardContainer).addClass('disabled');
		}
	}
</script>
<div class="page-header">
	<h1>Project building</h1>
</div>
<div class="well bs-component">
  <form class="form-horizontal" action="/game/save_project" method="post" id="ProjectWizard">
    <fieldset id="step1" class="step">
      <legend>What to build</legend>
      <div class="form-group">
        <div class="col-lg-12">
        	<?foreach (array_keys($types) as $key){?>
	          <div class="radio">
	            <label>
	              <input type="radio" class="type" name="type" value="<?=$key?>"data-time="<?=$params[$key]['build_time']?>">
	              <?=$types[$key]?>
	            </label>
	          </div>
	        <?}?>
        </div>
      </div>
      <div class="form-group">
        <div class="col-lg-12">
          <div class="btn btn-primary disabled pull-right next" onclick="projectWizard.next()">Next</div>
        </div>
      </div>
    </fieldset>
    <fieldset id="step2" class="step">
      <legend>Where to build</legend>
      <div class="form-group">
      	<label for="region" class="col-lg-1 control-label">Regions</label>
      	<div class="col-lg-5">
          <select class="form-control" name="region_id" id="region">
            <?foreach ($regions as $region){?>
            	<option value="<?=$region->id?>"><?=$region->name?></option>
            <?}?>
          </select>
        </div>
        <label class="col-lg-1 control-label">Field</label>
        <div class="col-lg-2">
        	<input type="number" name="x" class="form-control" placeholder="X"/>
        </div>
        <div class="col-lg-2">
        	<input type="number" name="y" class="form-control" placeholder="Y"/>
        </div>
      </div>
      <div class="form-group">
        <div class="col-lg-12">
          <div class="btn btn-default" onclick="projectWizard.back()">Back</div>
          <div class="btn btn-primary disabled pull-right next" onclick="projectWizard.next()">Next</div>
        </div>
      </div>
    </fieldset>
    <fieldset id="step3" class="step">
      <legend>Confirm</legend>
      <div class="form-group">
        <div class="col-lg-12">
          <div>Gold: 100</div>
          <div>Time to build: <span id="TimeToBuild"></span></div>
        </div>
      </div>
      <div class="form-group">
        <div class="col-lg-12">
          <div class="btn btn-default" onclick="projectWizard.back()">Back</div>
          <button type="submit" class="btn btn-success pull-right">Finish</button>
        </div>
      </div>
    </fieldset>
  </form>
</div>