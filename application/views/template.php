<html>
	<head>
		<title>Age of Merchants</title>
		<link rel="stylesheet" href="/css/bootstrap.min.css">
		<link rel="stylesheet" href="/css/style.css">

		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
		<script src="/js/external/underscore-min.js"></script>
		<script src="/js/external/backbone-min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
		
		<script src="/js/User.js"></script>
	</head>
	<body>
		<div class="container">
			<div class="bs-component">
	              <div class="navbar navbar-default">
	                <div class="navbar-header">
	                  <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
	                    <span class="icon-bar"></span>
	                    <span class="icon-bar"></span>
	                    <span class="icon-bar"></span>
	                  </button>
	                  <a class="navbar-brand" href="#">Age of Merchants</a>
	                </div>
	                <div class="navbar-collapse collapse navbar-responsive-collapse">
	                  <ul class="nav navbar-nav">
	                    <li class="active"><a href="/">Main</a></li>
	                  </ul>
	                  <ul class="nav navbar-nav navbar-right quick-login login-form">
	                  	<?if ($user){?>
	                  		<li><?=$user->username?></li>
	                  	<?}else{?>
		                  	<li><a href="/user/registration">Registration</a></li>
		                    <li><input type="text" class="form-control username" placeholder="login"/></li>
		                    <li><input type="password" class="form-control password" placeholder="password"/></li>
		                    <li><div class="btn btn-default" onclick="loginUser(this)">Log in</div></li>
	                    <?}?>
	                  </ul>
	                </div>
	              </div>
	            <div id="source-button" class="btn btn-primary btn-xs" style="display: none;">&lt; &gt;</div>
	        </div>
			<?=$content?>
		</div>
	</body>
</html>