<div class="page-header">
	<h1>Project building</h1>
</div>
<div class="well bs-component">
  <form class="form-horizontal">
    <fieldset id="step1" class="step">
      <legend>What to build</legend>
      <div class="form-group">
        <div class="col-lg-12">
        	<?foreach (array_keys($types) as $key){?>
	          <div class="radio">
	            <label>
	              <input type="radio" name="type" value="<?=$key?>">
	              <?=$types[$key]?>
	            </label>
	          </div>
	        <?}?>
        </div>
      </div>
      <div class="form-group">
        <div class="col-lg-12">
          <button type="submit" class="btn btn-disabled pull-right">Next</button>
        </div>
      </div>
    </fieldset>
    <fieldset id="step2" class="step">
      <legend>Where to build</legend>
      <div class="form-group">
        
      </div>
      <div class="form-group">
        <div class="col-lg-12">
          <button class="btn btn-default">Back</button>
          <button type="submit" class="btn btn-disabled pull-right">Next</button>
        </div>
      </div>
    </fieldset>
  </form>
</div>