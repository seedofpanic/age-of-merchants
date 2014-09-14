<div class="page-header">
    <h1>Start here</h1>
</div>
<div class="row">
    <div class="col-lg-6">
        <div class="well bs-component">
            <form class="form-horizontal login-form">
                <fieldset>
                    <legend>Authorization</legend>
                    <div id="formError">

                    </div>
                    <div class="form-group">
                        <label for="inputUsername" class="col-lg-2 control-label">Username</label>
                        <div class="col-lg-10">
                            <input type="text" class="form-control username" id="inputUsername" placeholder="Username">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="inputPassword" class="col-lg-2 control-label">Password</label>
                        <div class="col-lg-10">
                            <input type="password" class="form-control password" id="inputPassword" placeholder="Password">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-lg-10 col-lg-offset-2">
                            <button type="submit" class="btn btn-primary pull-right" data-redirect="/own" onclick="loginUser(this);return false">Log in</button>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>
    </div>
	<div class="col-lg-6">
		<div class="well bs-component">
			<form class="form-horizontal">
				<fieldset>
					<legend>Registration</legend>
					<div id="formError">
						
					</div>
					<div class="form-group">
						<label for="inputEmail" class="col-lg-2 control-label">Email</label>
						<div class="col-lg-10">
						  <input type="text" class="form-control" id="inputEmail" placeholder="Email">
						</div>
					</div>
					<div class="form-group">
						<label for="inputUsername" class="col-lg-2 control-label">Username</label>
						<div class="col-lg-10">
						  <input type="text" class="form-control" id="inputUsername" placeholder="Username">
						</div>
					</div>
					<div class="form-group">
						<label for="inputPassword" class="col-lg-2 control-label">Password</label>
						<div class="col-lg-10">
						  <input type="password" class="form-control" id="inputPassword" placeholder="Password">
						</div>
					</div>
					<div class="form-group">
						<label for="inputPasswordC" class="col-lg-2 control-label">Password confirm</label>
						<div class="col-lg-10">
						  <input type="password" class="form-control" id="inputPasswordC" placeholder="Password confirm">
						</div>
					</div>
					<div class="form-group">
						<div class="col-lg-10 col-lg-offset-2">
							<button type="submit" class="btn btn-primary pull-right" onclick="registerUser();return false;">Register</button>
						</div>
					</div>
				</fieldset>
			</form>
		</div>
	</div>
</div>